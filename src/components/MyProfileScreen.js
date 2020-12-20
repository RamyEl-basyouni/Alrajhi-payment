import React, { Component } from "react";
import { BackHandler } from "react-native";
import { connect } from "react-redux";
import { AppIcon } from "../AppStyles";
import authManager from "../Core/onboarding/utils/authManager";
import DynamicAppStyles from "../DynamicAppStyles";
import ListingAppConfig from "../ListingAppConfig";
import { IMUserProfileComponent } from "../Core/profile";
import { logout, setUserData } from "../Core/onboarding/redux/auth";
import { IMLocalized } from "../Core/localization/IMLocalization";

class MyProfileScreen extends Component {
  static navigationOptions = ({ screenProps }) => {
    let currentTheme = DynamicAppStyles.navThemeConstants[screenProps.theme];
    return {
      title: IMLocalized("My Profile"),
      headerTintColor: currentTheme.activeTintColor,
      headerTitleStyle: { color: currentTheme.fontColor },
    };
  };

  constructor(props) {
    super(props);

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
    this.didFocusSubscription && this.didFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();

    return true;
  };

  onLogout() {
    authManager.logout();
    // authManager.logout(this.props.user);
    this.props.logout();
    this.props.navigation.navigate("LoadScreen", {
      appStyles: DynamicAppStyles,
      appConfig: ListingAppConfig,
    });
  }

  onUpdateUser = (newUser) => {
    this.props.setUserData({ user: newUser });
  };

  render() {
    var menuItems = [
      {
        title: IMLocalized("My Listings"),
        tintColor: "#baa3f3",
        icon: AppIcon.images.list,
        onPress: () => this.props.navigation.navigate("MyListingModal"),
      },
      {
        title: IMLocalized("My Favorites"),
        tintColor: "#df9292",
        icon: AppIcon.images.wishlistFilled,
        onPress: () => this.props.navigation.navigate("SavedListingModal"),
      },
      {
        title: IMLocalized("Account Details"),
        icon: AppIcon.images.accountDetail,
        tintColor: "#6b7be8",
        onPress: () =>
          this.props.navigation.navigate("AccountDetail", {
            appStyles: DynamicAppStyles,
            form: ListingAppConfig.editProfileFields,
            screenTitle: IMLocalized("Edit Profile"),
          }),
      },
      {
        title: IMLocalized("Settings"),
        icon: AppIcon.images.settings,
        tintColor: "#a6a4b1",
        onPress: () =>
          this.props.navigation.navigate("Settings", {
            appStyles: DynamicAppStyles,
            form: ListingAppConfig.userSettingsFields,
            screenTitle: IMLocalized("Settings"),
          }),
      },
      {
        title: IMLocalized("Contact Us"),
        icon: AppIcon.images.contactUs,
        tintColor: "#9ee19f",
        onPress: () =>
          this.props.navigation.navigate("Contact", {
            appStyles: DynamicAppStyles,
            form: ListingAppConfig.contactUsFields,
            screenTitle: IMLocalized("Contact us"),
          }),
      },
    ];

    // if (this.props.isAdmin) {
    //   menuItems.push({
    //     title: IMLocalized("Admin Dashboard"),
    //     tintColor: "#8aced8",
    //     icon: AppIcon.images.checklist,
    //     onPress: () => this.props.navigation.navigate("AdminDashboard"),
    //   });
    // }

    return (
      <IMUserProfileComponent
        user={this.props.user}
        onUpdateUser={(user) => this.onUpdateUser(user)}
        onLogout={() => this.onLogout()}
        menuItems={menuItems}
        appStyles={DynamicAppStyles}
      />
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.user,
    // isAdmin: auth.user && auth.user.isAdmin,
  };
};

export default connect(mapStateToProps, {
  logout,
  setUserData,
})(MyProfileScreen);
