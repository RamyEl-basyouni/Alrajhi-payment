import React from "react";
import { Animated, Easing, Image, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { createReduxContainer } from "react-navigation-redux-helpers";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import HomeScreen from "../screens/HomeScreen";
import AdminDashboardScreen from "../screens/AdminDashboardScreen";
import CategoryScreen from "../screens/CategoryScreen";
import DetailScreen from "../screens/DetailScreen";
import ListingScreen from "../screens/ListingScreen";
import MapScreen from "../screens/MapScreen";
import SavedListingScreen from "../screens/SavedListingScreen";
import ConversationsScreen from "../screens/ConversationsScreen";
import SearchScreen from "../screens/SearchScreen";
import DynamicAppStyles from "../DynamicAppStyles";
import {
  LoadScreen,
  WalkthroughScreen,
  LoginScreen,
  WelcomeScreen,
  SignupScreen,
  SmsAuthenticationScreen,
} from "../Core/onboarding";
import DrawerContainer from "../components/DrawerContainer";
import MyProfileScreen from "../components/MyProfileScreen";
import MyListingModal from "../components/MyListingModal";
import ListingProfileModal from "../components/ListingProfileModal";
import ListingAppConfig from "../ListingAppConfig";
import { tabBarBuilder } from "../Core/ui";
import { IMChatScreen } from "../Core/chat";
import {
  IMEditProfileScreen,
  IMUserSettingsScreen,
  IMContactUsScreen,
} from "../Core/profile";

const noTransitionConfig = () => ({
  transitionSpec: {
    duration: 0,
    timing: Animated.timing,
    easing: Easing.step0,
  },
});

// login stack
const LoginStack = createStackNavigator(
  {
    Welcome: {
      screen: WelcomeScreen,
      navigationOptions: { header: null },
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: () => ({
        headerStyle: authScreensStyles.headerStyle,
      }),
    },
    Signup: {
      screen: SignupScreen,
      navigationOptions: () => ({
        headerStyle: authScreensStyles.headerStyle,
      }),
    },
    Sms: {
      screen: SmsAuthenticationScreen,
      navigationOptions: () => ({
        headerStyle: authScreensStyles.headerStyle,
      }),
    },
  },
  {
    initialRouteName: "Welcome",
    initialRouteParams: {
      appStyles: DynamicAppStyles,
      appConfig: ListingAppConfig,
    },
    headerMode: "none",
    cardShadowEnabled: false,
  }
);

const DetailStack = createStackNavigator(
  {
    Detail: { screen: DetailScreen },
    DetailModal: { screen: DetailScreen },
    PersonalChat: { screen: IMChatScreen },
  },
  {
    mode: "modal",
    headerMode: "float",
  }
);

const MainHomeStack = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    Listing: { screen: ListingScreen },
    Detail: {
      screen: DetailScreen,
    },
    PersonalChat: { screen: IMChatScreen },
    Map: { screen: MapScreen },
    ListingProfileModal: { screen: ListingProfileModal },
    ListingProfileModalDetailsScreen: { screen: DetailScreen },
    MyProfile: { screen: MyProfileScreen },
  },
  {
    // initialRouteName: "Home",
    headerMode: "screen",
    headerLayoutPreset: "center",
    navigationOptions: ({ navigation }) => ({
      // headerTintColor: "#fff",
      // headerTitleStyle: styles.headerTitleStyle,
      headerStyle: {
        backgroundColor: "transparent",
      },
      cardStyle: { backgroundColor: "transparent" },
      headerTransparent: true,
    }),
  }
);

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: MainHomeStack,
      navigationOptions: { header: null },
    },
    MyProfile: { screen: MyProfileScreen },
    MyListingModal: { screen: MyListingModal },
    SavedListingModal: { screen: SavedListingScreen },
    MyListingDetailModal: { screen: DetailScreen },
    PersonalChat: { screen: IMChatScreen },
    Contact: { screen: IMContactUsScreen },
    Settings: { screen: IMUserSettingsScreen },
    AdminDashboard: { screen: AdminDashboardScreen },
    AccountDetail: { screen: IMEditProfileScreen },
  },
  {
    headerMode: "float",
  }
);

const CollectionStack = createStackNavigator(
  {
    Category: { screen: CategoryScreen },
    Listing: { screen: ListingScreen },
    Detail: { screen: DetailScreen },
    ListingProfileModalDetailsScreen: { screen: DetailScreen },
    PersonalChat: { screen: IMChatScreen },
    ListingProfileModal: { screen: ListingProfileModal },
    Map: { screen: MapScreen },
  },
  {
    initialRouteName: "Category",
    headerMode: "float",
    headerLayoutPreset: "center",
    navigationOptions: ({ navigation }) => ({
      headerTintColor: "#ff5a66",
      headerTitleStyle: styles.headerTitleStyle,
    }),
  }
);

const MessageStack = createStackNavigator(
  {
    Message: { screen: ConversationsScreen },
    PersonalChat: { screen: IMChatScreen },
  },
  {
    initialRouteName: "Message",
    headerMode: "float",
    initialRouteParams: {
      appStyles: DynamicAppStyles,
      appConfig: ListingAppConfig,
    },
    headerLayoutPreset: "center",
    navigationOptions: ({ navigation }) => ({
      headerTintColor: "#ff5a66",
      headerTitleStyle: styles.headerTitleStyle,
    }),
  }
);

const SearchStack = createStackNavigator(
  {
    Search: { screen: SearchScreen },
    SearchDetail: { screen: DetailScreen },
    ListingProfileModalDetailsScreen: { screen: DetailScreen },
    PersonalChat: { screen: IMChatScreen },
    ListingProfileModal: { screen: ListingProfileModal },
    Map: { screen: MapScreen },
  },
  {
    initialRouteName: "Search",
    headerMode: "float",
  }
);

const TabNavigator = createBottomTabNavigator(
  {
    Home: { screen: HomeStack },
    Categories: { screen: CollectionStack },
    Messages: { screen: MessageStack },
    Search: { screen: SearchStack },
  },
  {
    initialRouteName: "Home",
    tabBarComponent: tabBarBuilder(ListingAppConfig.tabIcons, DynamicAppStyles),
    initialRouteParams: {
      appStyles: DynamicAppStyles,
      appConfig: ListingAppConfig,
    },
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      return {
        headerTitle: routeName,
        header: null,
      };
    },
  }
);

// drawer stack
const DrawerStack = createDrawerNavigator(
  {
    Tab: TabNavigator,
  },
  {
    drawerPosition: "left",
    initialRouteName: "Tab",
    drawerWidth: 300,
    contentComponent: DrawerContainer,
    headerMode: "screen",
    navigationOptions: ({ navigation }) => {
      const routeIndex = navigation.state.index;
      return {
        title: navigation.state.routes[routeIndex].key,
        header: null,
        headerBackTitle: null,
      };
    },
  }
);

const MainNavigator = createStackNavigator(
  {
    DrawerStack: {
      screen: DrawerStack,
      navigationOptions: { header: null, headerTransparent: true },
    },
  },
  {
    // Default config for all screens
    headerMode: "float",
    initialRouteName: "DrawerStack",
    initialRouteParams: {
      appStyles: DynamicAppStyles,
      appConfig: ListingAppConfig,
    },
    transitionConfig: noTransitionConfig,
    navigationOptions: ({ navigation }) => ({
      headerTintColor: "#ff5a66",
      headerTitleStyle: styles.headerTitleStyle,
      headerTransparent: true,
    }),
  }
);

const RootNavigator = createSwitchNavigator(
  {
    LoadScreen: LoadScreen,
    Walkthrough: WalkthroughScreen,
    LoginStack: LoginStack,
    MainStack: MainNavigator,
  },
  {
    initialRouteName: "LoadScreen",
    initialRouteParams: {
      appStyles: DynamicAppStyles,
      appConfig: ListingAppConfig,
    },
    headerMode: "none",
  }
);

// const HomeRootNavigator = createAppContainer(
//   createSwitchNavigator(
//     {
//       MainStack: MainNavigator,
//     },
//     {
//       initialRouteName: "MainStack",
//       initialRouteParams: {
//         appStyles: DynamicAppStyles,
//         appConfig: ListingAppConfig,
//       },
//       headerMode: "none",
//     }
//   )
// );

const styles = StyleSheet.create({
  headerTitleStyle: {
    // fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    // color: "black",
    // flex: 1,
    color: "#FFFFFF",
    backgroundColor: "transparent",
  },
});

const authScreensStyles = StyleSheet.create({
  headerStyle: {
    borderBottomWidth: 0,
    // shadowColor: "transparent",
    shadowOpacity: 0,
    // elevation: 0, // remove shadow on Android
    backgroundColor: "transparent",
  },
});

const AppContainer = createReduxContainer(RootNavigator);
const mapStateToProps = (state) => ({
  state: state.nav,
});
const AppNavigator = connect(mapStateToProps)(AppContainer);
// const HomeNavigator = connect(mapStateToProps)(HomeRootNavigator);
export { RootNavigator, AppNavigator };
