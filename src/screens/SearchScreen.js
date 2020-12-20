import React from "react";
import { FlatList, Text, View, BackHandler } from "react-native";
import { ListItem, SearchBar } from "react-native-elements";
import { firebaseListing } from "../firebase";
import { ListStyle } from "../AppStyles";
import { Configuration } from "../Configuration";
import { IMLocalized } from "../Core/localization/IMLocalization";
import { timeFormat } from "../Core";

class SearchScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: (
        <SearchBar
          containerStyle={{
            backgroundColor: "transparent",
            borderBottomColor: "transparent",
            borderTopColor: "transparent",
            flex: 1,
          }}
          inputStyle={{
            backgroundColor: "#f5f5f5",
            borderRadius: 10,
            color: "#151723",
            fontSize: 14,
          }}
          showLoading
          clearIcon={true}
          searchIcon={true}
          onChangeText={(text) => params.handleSearch(text)}
          // onClear={alert('onClear')}
          placeholder={IMLocalized("Search")}
        />
      ),
    };
  };

  constructor(props) {
    super(props);

    this.unsubscribe = null;

    this.state = {
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
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
  onSearch = (text) => {
    this.searchedText = text;

    this.unsubscribe = firebaseListing.subscribeListings(
      {},
      this.onCollectionUpdate
    );
  };

  onCollectionUpdate = (querySnapshot) => {
    const data = [];
    querySnapshot.forEach((doc) => {
      const listing = doc.data();
      var text =
        this.searchedText != null ? this.searchedText.toLowerCase() : "";
      if (listing.title) {
        var index = listing.title.toLowerCase().search(text);
        if (index != -1) {
          data.push({ ...listing, id: doc.id });
        }
      }
    });

    this.setState({ data });
  };

  componentDidMount() {
    this.unsubscribe = firebaseListing.subscribeListings(
      {},
      this.onCollectionUpdate
    );
    this.props.navigation.setParams({
      handleSearch: this.onSearch,
    });

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

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%",
        }}
      />
    );
  };

  onPress = (item) => {
    this.props.navigation.navigate("SearchDetail", {
      item: item,
      customLeft: true,
      headerLeft: null,
      routeName: "Search",
    });
  };

  renderItem = ({ item }) => (
    <ListItem
      key={item.id}
      title={item.title}
      titleStyle={ListStyle.title}
      subtitle={
        <View style={ListStyle.subtitleView}>
          <View style={ListStyle.leftSubtitle}>
            <Text style={ListStyle.time}>{timeFormat(item.createdAt)}</Text>
            <Text style={ListStyle.place}>{item.place}</Text>
          </View>
          <Text numberOfLines={1} style={ListStyle.price}>
            {item.price}
          </Text>
        </View>
      }
      onPress={() => this.onPress(item)}
      avatarStyle={ListStyle.avatarStyle}
      avatarContainerStyle={ListStyle.avatarStyle}
      avatar={{ uri: item.photo }}
      containerStyle={{ borderBottomWidth: 0 }}
      hideChevron={true}
    />
  );

  render() {
    return <Text>test3</Text>;
    // return (
    //   <FlatList
    //     data={this.state.data}
    //     renderItem={this.renderItem}
    //     keyExtractor={item => `${item.id}`}
    //     initialNumToRender={5}
    //     refreshing={this.state.refreshing}
    //   />
    // );
  }
}

export default SearchScreen;
