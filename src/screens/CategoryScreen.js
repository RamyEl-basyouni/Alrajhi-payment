import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
} from "react-native";
import FastImage from "react-native-fast-image";
import { AppStyles } from "../AppStyles";
import { firebaseListing } from "../firebase";
import Icon from "react-native-vector-icons/FontAwesome";
import ImagePicker from "react-native-image-picker";
import DynamicAppStyles from "../DynamicAppStyles";

const PRODUCT_ITEM_HEIGHT = 100;
const PRODUCT_ITEM_OFFSET = 5;

class CategoryScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Categories",
  });

  constructor(props) {
    super(props);

    this.unsubscribe = null;

    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      localPhotos: [],
    };

    this.didFocusSubscription = props.navigation.addListener(
      "didFocus",
      (payload) =>
        BackHandler.addEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        )
    );
  }

  componentDidMount() {
    this.unsubscribe = firebaseListing.subscribeListingCategories(
      this.onCollectionUpdate
    );
    this.willBlurSubscription = this.props.navigation.addListener(
      "willBlur",
      (payload) =>
        BackHandler.removeEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        )
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
    BackHandler.exitApp();
    return true;
  };

  onCollectionUpdate = (querySnapshot) => {
    const data = [];
    querySnapshot.forEach((doc) => {
      const { name, photo } = doc.data();
      data.push({
        id: doc.id,
        doc,
        name, // DocumentSnapshot
        photo,
      });
    });

    this.setState({
      data,
      loading: false,
    });
  };

  onPress = (item) => {
    this.props.navigation.navigate("Listing", { item: item });
  };

  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.onPress(item)}>
      <View style={styles.container}>
        <FastImage style={styles.photo} source={{ uri: item.photo }} />
        <View style={styles.overlay} />
        <Text numberOfLines={3} style={styles.title}>
          {item.name || item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  onPressAddPhotoBtn = () => {
    // More info on all the options is below in the API Reference... just some common use cases shown here
    const options = {
      title: IMLocalized("Select a photo"),
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        alert(response.error);
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        this.setState({
          localPhotos: [...this.state.localPhotos, response.uri],
        });
      }
    });
  };

  render() {
    return (
      <TouchableOpacity onPress={this.onPressAddPhotoBtn.bind(this)}>
        <View style={[styles.addButton, styles.photo]}>
          <Icon name="camera" size={30} color="white" />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  photo: {
    marginLeft: 10,
    width: 70,
    height: 70,
    borderRadius: 10,
  },

  addButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DynamicAppStyles.colorSet.mainThemeForegroundColor,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777",
  },
  textBold: {
    fontWeight: "500",
    color: "#000",
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(0,122,255)",
  },
  buttonTouchable: {
    padding: 16,
  },
  flatContainer: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    margin: PRODUCT_ITEM_OFFSET,
    height: PRODUCT_ITEM_HEIGHT,
  },
  title: {
    color: "white",
    fontSize: 17,
    fontFamily: AppStyles.fontName.bold,
    textAlign: "center",
  },
  photo: {
    height: PRODUCT_ITEM_HEIGHT,
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default CategoryScreen;
