import React from "react";
import {
  Modal,
  ScrollView,
  Platform,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Text,
  View
} from "react-native";
import Geolocation from "@react-native-community/geolocation";
import ModalSelector from "react-native-modal-selector";
import { AppStyles, ModalHeaderStyle, ModalSelectorStyle } from "../AppStyles";
import TextButton from "react-native-button";
import FastImage from "react-native-fast-image";
import { Configuration } from "../Configuration";
import { connect } from "react-redux";
import ImagePicker from "react-native-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import FilterViewModal from "../components/FilterViewModal";
import SelectLocationModal from "../components/SelectLocationModal";
import ActionSheet from "react-native-actionsheet";
import Geocoder from "react-native-geocoding";
import ServerConfiguration from "../ServerConfiguration";
import { firebaseStorage } from "../Core/firebase/storage";
import ListingAppConfig from "../ListingAppConfig";
import { firebaseListing } from "../firebase";
import { IMLocalized } from "../Core/localization/IMLocalization";
import DynamicAppStyles from '../DynamicAppStyles';

class PostModal extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Home"
  });

  constructor(props) {
    super(props);

    Geocoder.init(ListingAppConfig.reverseGeoCodingAPIKey);

    const { selectedItem, categories } = this.props;
    let category = { name: IMLocalized("Select...") };
    let title = "";
    let description = "";
    let location = {
      latitude: Configuration.map.origin.latitude,
      longitude: Configuration.map.origin.longitude
    };
    let localPhotos = [];
    let photoUrls = [];
    let price = "$1000";
    let textInputValue = "";
    let filter = {};
    let filterValue = IMLocalized("Select...");
    let address: "Checking...";

    // if (categories.length > 0) category = categories[0];
    if (selectedItem) {
      const {
        name,
        latitude,
        longitude,
        photos,
        filters,
        place
      } = selectedItem;

      category = categories.find(
        category => selectedItem.categoryID === category.id
      );
      title = name;
      description = selectedItem.description;
      location = {
        latitude,
        longitude
      };
      localPhotos = photos;
      photoUrls = photos;
      price = selectedItem.price;
      filter = filters;
      address = place;
    }

    this.state = {
      categories: categories,
      category: category,
      title,
      description,
      location,
      localPhotos,
      photoUrls,
      price,
      textInputValue,
      filter,
      filterValue,
      address,
      filterModalVisible: false,
      locationModalVisible: false,
      loading: false
    };
  }

  componentDidMount() {
    this.setFilterString(this.state.filter);
    Geolocation.getCurrentPosition(
      position => {
        this.setState({ location: position.coords });
        this.onChangeLocation(position.coords);
      },
      error => alert(error.message),
      { enableHighAccuracy: false, timeout: 1000 }
    );
  }

  selectLocation = () => {
    this.setState({ locationModalVisible: true });
  };

  onChangeLocation = location => {
    Geocoder.from(location.latitude, location.longitude)
      .then(json => {
        const addressComponent = json.results[0].formatted_address;
        this.setState({ address: addressComponent });
      })
      .catch(error => {
        console.log(error);
        this.setState({ address: "Unknown" });
      });
  };

  setFilterString = filter => {
    let filterValue = "";
    Object.keys(filter).forEach(function (key) {
      if (filter[key] != "Any" && filter[key] != "All") {
        filterValue += " " + filter[key];
      }
    });

    if (filterValue == "") {
      if (Object.keys(filter).length > 0) {
        filterValue = "Any";
      } else {
        filterValue = IMLocalized("Select...");
      }
    }

    this.setState({ filterValue: filterValue });
  };

  onSelectLocationDone = location => {
    this.setState({ location: location });
    this.setState({ locationModalVisible: false });
    this.onChangeLocation(location);
  };

  onSelectLocationCancel = () => {
    this.setState({ locationModalVisible: false });
  };

  selectFilter = () => {
    if (!this.state.category.id) {
      alert(IMLocalized("You must choose a category first."));
    } else {
      this.setState({ filterModalVisible: true });
    }
  };

  onSelectFilterCancel = () => {
    this.setState({ filterModalVisible: false });
  };

  onSelectFilterDone = filter => {
    this.setState({ filter: filter });
    this.setState({ filterModalVisible: false });
    this.setFilterString(filter);
  };

  onPressAddPhotoBtn = () => {
    // More info on all the options is below in the API Reference... just some common use cases shown here
    const options = {
      title: IMLocalized("Select a photo"),
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        alert(response.error);
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        this.setState({
          localPhotos: [...this.state.localPhotos, response.uri]
        });
      }
    });
  };

  onCancel = () => {
    this.props.onCancel();
  };

  onPost = () => {
    const self = this;
    const onCancel = self.onCancel;

    if (!self.state.title) {
      alert(IMLocalized("Title was not provided."));
      return;
    }
    if (!self.state.description) {
      alert(IMLocalized("Description was not set."));
      return;
    }
    if (!self.state.price) {
      alert(IMLocalized("Price is empty."));
      return;
    }
    if (self.state.localPhotos.length == 0) {
      alert(IMLocalized("Please choose at least one photo."));
      return;
    }

    if (Object.keys(self.state.filter).length == 0) {
      alert(IMLocalized("Please set the filters."));
      return;
    }

    self.setState({ loading: true });

    let photoUrls = [];

    if (self.props.selectedItem) {
      photoUrls = [...self.props.selectedItem.photos];
    }

    uploadPromiseArray = [];
    self.state.localPhotos.forEach(uri => {
      if (!uri.startsWith("https://")) {
        uploadPromiseArray.push(
          new Promise((resolve, reject) => {
            firebaseStorage.uploadImage(uri).then(response => {
              if (response.downloadURL) {
                photoUrls.push(response.downloadURL);
              }
              resolve();
            });
          })
        );
      }
    });

    Promise.all(uploadPromiseArray)
      .then(values => {
        const location = {
          latitude: self.state.location.latitude,
          longitude: self.state.location.longitude
        };
        const uploadObject = {
          isApproved: !ServerConfiguration.isApprovalProcessEnabled,
          authorID: self.props.user.id,
          author: self.props.user,
          categoryID: self.state.category.id,
          description: self.state.description,
          latitude: self.state.location.latitude,
          longitude: self.state.location.longitude,
          filters: self.state.filter,
          title: self.state.title,
          price: self.state.price,
          //TODO:
          place: "San Francisco, CA",
          photo: photoUrls.length > 0 ? photoUrls[0] : null,
          photos: photoUrls,
          photoURLs: photoUrls
        };
        firebaseListing.postListing(
          self.props.selectedItem,
          uploadObject,
          photoUrls,
          location,

          ({ success }) => {
            if (success) {
              self.setState({ loading: false }, () => {
                onCancel();
              });
            } else {
              alert(error);
            }
          }
        );
      })
      .catch(reason => {
        console.log(reason);
      });
  };

  showActionSheet = index => {
    this.setState({
      selectedPhotoIndex: index
    });
    this.ActionSheet.show();
  };

  onActionDone = index => {
    if (index == 0) {
      var array = [...this.state.localPhotos];
      array.splice(this.state.selectedPhotoIndex, 1);
      this.setState({ localPhotos: array });
    }
  };

  render() {
    var categoryData = this.state.categories.map((category, index) => ({
      key: category.id,
      label: category.name
    }));
    categoryData.unshift({ key: "section", label: "Category", section: true });

    const photos = this.state.localPhotos.map((photo, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => {
          this.showActionSheet(index);
        }}
      >
        <FastImage style={styles.photo} source={{ uri: photo }} />
      </TouchableOpacity>
    ));
    return (
      <Modal
        visible={this.props.isVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={this.onCancel}
      >
        <View style={ModalHeaderStyle.bar}>
          <Text style={ModalHeaderStyle.title}>Add Listing</Text>
          <TextButton
            style={[ModalHeaderStyle.rightButton, styles.rightButton]}
            onPress={this.onCancel}
          >
            Cancel
          </TextButton>
        </View>
        <ScrollView style={styles.body}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Title</Text>
            <TextInput
              style={styles.input}
              value={this.state.title}
              onChangeText={text => this.setState({ title: text })}
              placeholder="Start typing"
              placeholderTextColor={AppStyles.color.grey}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <TextInput
              multiline={true}
              numberOfLines={2}
              style={styles.input}
              onChangeText={text => this.setState({ description: text })}
              value={this.state.description}
              placeholder="Start typing"
              placeholderTextColor={AppStyles.color.grey}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.section}>
            <View style={styles.row}>
              <Text style={styles.title}>Price</Text>
              <TextInput
                style={styles.priceInput}
                keyboardType="numeric"
                value={this.state.price}
                onChangeText={text => this.setState({ price: text })}
                placeholderTextColor={AppStyles.color.grey}
                underlineColorAndroid="transparent"
              />
            </View>
            <ModalSelector
              touchableActiveOpacity={0.9}
              data={categoryData}
              sectionTextStyle={ModalSelectorStyle.sectionTextStyle}
              optionTextStyle={ModalSelectorStyle.optionTextStyle}
              optionContainerStyle={ModalSelectorStyle.optionContainerStyle}
              cancelContainerStyle={ModalSelectorStyle.cancelContainerStyle}
              cancelTextStyle={ModalSelectorStyle.cancelTextStyle}
              selectedItemTextStyle={ModalSelectorStyle.selectedItemTextStyle}
              backdropPressToClose={true}
              cancelText={IMLocalized("Cancel")}
              initValue={this.state.category.name}
              onChange={option => {
                this.setState(prevState => ({
                  category: { id: option.key, name: option.label },
                  filterValue:
                    prevState.category.id === option.key
                      ? this.state.filterValue
                      : IMLocalized("Select..."),
                  filter:
                    prevState.category.id === option.key
                      ? this.state.filter
                      : {}
                }));
              }}
            >
              <View style={styles.row}>
                <Text style={styles.title}>{IMLocalized("Category")}</Text>
                <Text style={styles.value}>{this.state.category.name}</Text>
              </View>
            </ModalSelector>
            <TouchableOpacity onPress={this.selectFilter}>
              <View style={styles.row}>
                <Text style={styles.title}>{IMLocalized("Filters")}</Text>
                <Text style={styles.value}>{this.state.filterValue}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.selectLocation}>
              <View style={styles.row}>
                <Text style={styles.title}>{IMLocalized("Location")}</Text>
                <View style={styles.location}>
                  <Text style={styles.value}>{this.state.address}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.addPhotoTitle}>{IMLocalized("Add Photos")}</Text>
            <ScrollView style={styles.photoList} horizontal={true}>
              {photos}
              <TouchableOpacity onPress={this.onPressAddPhotoBtn.bind(this)}>
                <View style={[styles.addButton, styles.photo]}>
                  <Icon name="camera" size={30} color="white" />
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
          {this.state.filterModalVisible && (
            <FilterViewModal
              value={this.state.filter}
              onCancel={this.onSelectFilterCancel}
              onDone={this.onSelectFilterDone}
              category={this.state.category}
            />
          )}
          {this.state.locationModalVisible && (
            <SelectLocationModal
              location={this.state.location}
              onCancel={this.onSelectLocationCancel}
              onDone={this.onSelectLocationDone}
            />
          )}
        </ScrollView>
        {this.state.loading ? (
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator size="large" color={AppStyles.color.main} />
          </View>
        ) : (
            <TextButton
              containerStyle={styles.addButtonContainer}
              onPress={this.onPost}
              style={styles.addButtonText}
            >
              {IMLocalized("Add Listing")}
            </TextButton>
          )}
        <ActionSheet
          ref={o => (this.ActionSheet = o)}
          title={IMLocalized("Confirm to delete?")}
          options={[IMLocalized("Confirm"), IMLocalized("Cancel")]}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          onPress={index => {
            this.onActionDone(index);
          }}
        />
      </Modal>
    );
  }
}
const actionSheetStyles = {
  titleBox: {
    backgroundColor: "pink"
  },
  titleText: {
    fontSize: 16,
    color: "#000fff"
  }
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: AppStyles.color.white
  },
  divider: {
    backgroundColor: AppStyles.color.background,
    height: 10
  },
  container: {
    justifyContent: "center",
    height: 65,
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: AppStyles.color.grey
  },
  rightButton: {
    marginRight: 10
  },
  sectionTitle: {
    textAlign: "left",
    alignItems: "center",
    color: AppStyles.color.title,
    fontSize: 19,
    padding: 10,
    paddingTop: 15,
    paddingBottom: 7,
    fontFamily: AppStyles.fontName.bold,
    fontWeight: "bold"
    // borderBottomWidth: 2,
    // borderBottomColor: AppStyles.color.grey
  },
  input: {
    width: "100%",
    fontSize: 19,
    padding: 10,
    textAlignVertical: "top",
    justifyContent: "flex-start",
    paddingRight: 0,
    fontFamily: AppStyles.fontName.main,
    color: AppStyles.color.text
  },
  priceInput: {
    flex: 1,
    borderRadius: 5,
    borderColor: AppStyles.color.grey,
    borderWidth: 0.5,
    height: 40,
    textAlign: "right",
    paddingRight: 5,
    fontFamily: AppStyles.fontName.main,
    color: AppStyles.color.text
  },
  title: {
    flex: 2,
    textAlign: "left",
    alignItems: "center",
    color: AppStyles.color.title,
    fontSize: 19,
    fontFamily: AppStyles.fontName.bold,
    fontWeight: "bold"
  },
  value: {
    textAlign: "right",
    color: AppStyles.color.description,
    fontFamily: AppStyles.fontName.main
  },
  section: {
    backgroundColor: "white",
    marginBottom: 10
  },
  row: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10
  },
  addPhotoTitle: {
    color: AppStyles.color.title,
    fontSize: 19,
    paddingLeft: 10,
    marginTop: 10,
    fontFamily: AppStyles.fontName.bold,
    fontWeight: "bold"
  },
  photoList: {
    height: 70,
    marginTop: 20,
    marginRight: 10
  },
  location: {
    alignItems: "center",
    width: "50%"
  },
  photo: {
    marginLeft: 10,
    width: 70,
    height: 70,
    borderRadius: 10
  },

  addButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DynamicAppStyles.colorSet.mainThemeForegroundColor
  },
  photoIcon: {
    width: 50,
    height: 50
  },
  addButtonContainer: {
    backgroundColor: DynamicAppStyles.colorSet.mainThemeForegroundColor,
    borderRadius: 5,
    padding: 15,
    margin: 10,
    marginVertical: 27
  },
  activityIndicatorContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30
  },
  addButtonText: {
    color: AppStyles.color.white,
    fontWeight: "bold",
    fontSize: 15
  }
});

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(PostModal);
