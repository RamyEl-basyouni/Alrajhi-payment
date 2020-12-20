import React from "react";
import { StyleSheet, BackHandler } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { firebaseListing } from "../firebase";
import { AppStyles } from "../AppStyles";
import { Configuration } from "../Configuration";
import { IMLocalized } from "../Core/localization/IMLocalization";
import DynamicAppStyles from '../DynamicAppStyles';
import Geolocation from "@react-native-community/geolocation";

class MapScreen extends React.Component {
  static navigationOptions = ({ screenProps }) => {
    let currentTheme = DynamicAppStyles.navThemeConstants[screenProps.theme];
    return {
      title: IMLocalized("Map View"),
      headerTintColor: currentTheme.activeTintColor,
      headerTitleStyle: { color: currentTheme.fontColor }
    }
  };

  constructor(props) {
    super(props);

    const { navigation } = props;
    this.item = navigation.getParam("item");

    this.unsubscribe = null;

    this.state = {
      category: this.item,
      data: [],
      latitude: Configuration.map.origin.latitude,
      longitude: Configuration.map.origin.longitude,
      latitudeDelta: Configuration.map.delta.latitude,
      longitudeDelta: Configuration.map.delta.longitude,
      refreshing: false,
      shouldUseOwnLocation: true // Set this to false if you don't want the current user's location to be considered
    };

    this.didFocusSubscription = props.navigation.addListener(
      "didFocus",
      payload =>
        BackHandler.addEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        )
    );
  }

  onChangeLocation = (location) => {
    this.setState({
      latitude: location.latitude,
      longitude: location.longitude
    });
  }

  componentDidMount() {
    if (this.item) {
      this.unsubscribe = firebaseListing.subscribeListings(
        { categoryId: this.item.id },
        this.onCollectionUpdate
      );
    } else {
      this.unsubscribe = firebaseListing.subscribeListings(
        {},
        this.onCollectionUpdate
      );
    }

    if (this.state.shouldUseOwnLocation) {
      Geolocation.getCurrentPosition(
        position => {
          this.onChangeLocation(position.coords);
        },
        error => alert(error.message),
        { enableHighAccuracy: false, timeout: 1000 }
      );
    }

    this.willBlurSubscription = this.props.navigation.addListener(
      "willBlur",
      payload =>
        BackHandler.removeEventListener(
          "hardwareBackPress",
          this.onBackButtonPressAndroid
        )
    );
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();

    return true;
  };

  onCollectionUpdate = querySnapshot => {
    const data = [];
    let max_latitude = -400,
      min_latitude = 400,
      max_longitude = -400,
      min_logitude = 400;
    querySnapshot.forEach(doc => {
      const listing = doc.data();
      if (max_latitude < listing.latitude)
        max_latitude = listing.latitude;
      if (min_latitude > listing.latitude)
        min_latitude = listing.latitude;
      if (max_longitude < listing.longitude)
        max_longitude = listing.longitude;
      if (min_logitude > listing.longitude)
        min_logitude = listing.longitude;
      data.push({ ...listing, id: doc.id });
    });

    this.setState({
      data
    });

    if (!this.state.shouldUseOwnLocation || !this.state.latitude) {
      this.setState({
        latitude: (max_latitude + min_latitude) / 2,
        longitude: (max_longitude + min_logitude) / 2,
        latitudeDelta: Math.abs(
          (max_latitude - (max_latitude + min_latitude) / 2) * 3
        ),
        longitudeDelta: Math.abs(
          (max_longitude - (max_longitude + min_logitude) / 2) * 3
        )
      });
    }
  };

  onPress = item => {
    this.props.navigation.navigate("Detail", {
      item: item,
      customLeft: true,
      headerLeft: null,
      routeName: "Map"
    });
  };

  render() {
    const markerArr = this.state.data.map(listing => (
      <Marker
        title={listing.title}
        description={listing.description}
        onCalloutPress={() => {
          this.onPress(listing);
        }}
        coordinate={{
          latitude: listing.latitude,
          longitude: listing.longitude
        }}
      />
    ));

    return (
      <MapView
        style={styles.mapView}
        showsUserLocation={true}
        region={{
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          latitudeDelta: this.state.latitudeDelta,
          longitudeDelta: this.state.longitudeDelta
        }}
      >
        {markerArr}
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  mapView: {
    width: "100%",
    height: "100%",
    backgroundColor: AppStyles.color.grey
  }
});

export default MapScreen;
