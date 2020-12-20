import { Platform, Dimensions, I18nManager } from "react-native";
import { DynamicValue } from "react-native-dark-mode";
import TNColor from "./Core/truly-native/TNColor";

const WINDOW_WIDTH = Dimensions.get("window").width;
const WINDOW_HEIGHT = Dimensions.get("window").height;

const colorSet = {
  mainThemeBackgroundColor: new DynamicValue("#ffffff", "#121212"),
  mainThemeForegroundColor: "#31B8EB",
  mainTextColor: new DynamicValue("#151723", "#ffffff"),
  mainSubtextColor: new DynamicValue("#7e7e7e", "#f5f5f5"),
  hairlineColor: new DynamicValue("#e0e0e0", "#222222"),
  grey0: TNColor("#eaeaea"),
  grey3: TNColor("#e6e6f2"),
  grey6: TNColor("#d6d6d6"),
  grey9: TNColor("#939393"),
  subHairlineColor: new DynamicValue("#f2f2f3", "#f2f2f3"),
  facebook: new DynamicValue("#4267b2", "#4267b2"),
  grey: new DynamicValue("grey", "grey"),
  whiteSmoke: new DynamicValue("#f5f5f5", "#222222"),
  headerStyleColor: new DynamicValue("#ffffff", "#222222"),
  headerTintColor: new DynamicValue("#000000", "#ffffff"),
  bottomStyleColor: new DynamicValue("#ffffff", "#222222"),
  bottomTintColor: new DynamicValue("grey", "lightgrey"),
  mainButtonColor: new DynamicValue("#e8f1fd", "#062246"),
  subButtonColor: new DynamicValue("#eaecf0", "#20242d"),
};

const navThemeConstants = {
  light: {
    backgroundColor: "#fff",
    fontColor: "#151723",
    activeTintColor: "#31B8EB",
    inactiveTintColor: "#ccc",
    hairlineColor: "#e0e0e0",
  },
  dark: {
    backgroundColor: "#000",
    fontColor: "#fff",
    activeTintColor: "#31B8EB",
    inactiveTintColor: "#888",
    hairlineColor: "#222222",
  },
  main: "#31B8EB",
};

const iconSet = {
  logo: require("../assets/icons/logo.png"),
  userAvatar: require("./CoreAssets/default-avatar.png"),
  menuHamburger: require("./CoreAssets/hamburger-menu-icon.png"),
  backArrow: require("./CoreAssets/arrow-back-icon.png"),
  close: require("./CoreAssets/close-x-icon.png"),
  home: require("../assets/icons/home.png"),
  categories: require("../assets/icons/categories.png"),
  commentFilled: require("../assets/icons/comment-filled.png"),
  compose: require("../assets/icons/compose.png"),
  filter: require("../assets/icons/filter.png"),
  filters: require("../assets/icons/filters.png"),
  heart: require("../assets/icons/heart.png"),
  heartFilled: require("../assets/icons/heart-filled.png"),
  map: require("../assets/icons/map.png"),
  search: require("../assets/icons/search.png"),
  review: require("../assets/icons/review.png"),
  list: require("../assets/icons/list.png"),
  starFilled: require("../assets/icons/star_filled.png"),
  starNoFilled: require("../assets/icons/star_nofilled.png"),
  logout: require("../assets/icons/shutdown.png"),
  rightArrow: require("../assets/icons/right-arrow.png"),
  accountDetail: require("../assets/icons/account-detail.png"),
  wishlistFilled: require("../assets/icons/wishlist-filled.png"),
  orderDrawer: require("../assets/icons/order-drawer.png"),
  settings: require("../assets/icons/settings.png"),
  contactUs: require("../assets/icons/contact-us.png"),
  delete: require("../assets/icons/delete.png"),
  communication: require("../assets/icons/communication.png"),
  cameraFilled: require("../assets/icons/camera-filled.png"),
  send: require("../assets/icons/send.png"),
  emptyAvatar: require("../assets/icons/empty-avatar.jpg"),
  checklist: require("../assets/icons/checklist.png"),
  homeUnfilled: require("../assets/icons/home-unfilled.png"),
  homefilled: require("../assets/icons/home-filled.png"),
  search: require("../assets/icons/search.png"),
  magnifier: require("../assets/icons/magnifier.png"),
  profileUnfilled: require("../assets/icons/profile-unfilled.png"),
  profileFilled: require("../assets/icons/profile-filled.png"),
  camera: require("../assets/icons/camera.png"),
  cameraFilled: require("../assets/icons/camera-filled.png"),
  inscription: require("../assets/icons/inscription.png"),
  more: require("../assets/icons/more.png"),
  send: require("../assets/icons/send.png"),
  pinpoint: require("../assets/icons/pinpoint.png"),
  checked: require("../assets/icons/checked.png"),
  bell: require("../assets/icons/bell.png"),
  heartUnfilled: require("../assets/icons/heart-unfilled.png"),
  cameraRotate: require("../assets/icons/camera-rotate.png"),
  libraryLandscape: require("../assets/icons/library-landscape.png"),
  playButton: require("../assets/icons/play-button.png"),
  logout: require("../assets/icons/logout-drawer.png"),
  onboardingBg: require("./CoreAssets/onboarding-background.png"),
  identityBackground: require("./CoreAssets/gradient-identity-background.png"),
  homeBackground: require("./CoreAssets/home-background.png"),
  identityBackgroundButton: require("./CoreAssets/gradient-identity-background-button.png"),
  foodRestaurants: require("../assets/icons/food-restaurants.png"),
  profileImage: require("../assets/icons/profile-image.png"),
  firstBottomIconFilled: require("../assets/icons/firstBottomIcon.png"),
  firstBottomIconUnFilled: require("../assets/icons/firstBottomIconUnFilled.png"),
  secondBottomIconFilled: require("../assets/icons/secondBottomIcon.png"),
  secondBottomIconUnFilled: require("../assets/icons/secondBottomIconUnFilled.png"),
  thirdBottomIcon: require("../assets/icons/thirdBottomIcon.png"),
  thirdBottomIconUnFilled: require("../assets/icons/thirdBottomIconUnFilled.png"),
  clothes: require("../assets/icons/clothes.png"),
  rajhiBank: require("./CoreAssets/rajhi-bank.png"),
  rajhiLogo: require("./CoreAssets/rajhi-logo.png"),
  inmaaBank: require("./CoreAssets/inmaa-bankLatest.png"),
  alAhliBank: require("./CoreAssets/alahli-bank.png"),
  savingsLogo: require("./CoreAssets/savings.png"),
  notifications: require("./CoreAssets/notifications.png"),
  operationsLoaderLogo: require("./CoreAssets/operationsLoader.png"),
  incomeLogo: require("../assets/icons/income.png"),
  outcomeLogo: require("../assets/icons/outcome.png"),
};

const fontFamily = {
  boldFont: "",
  semiBoldFont: "",
  regularFont: "",
  mediumFont: "",
  lightFont: "",
  extraLightFont: "",
};

const fontSet = {
  xxlarge: 40,
  xlarge: 30,
  large: 25,
  middle: 20,
  normal: 16,
  small: 13,
  xsmall: 11,
  title: 30,
  content: 20,
};

const loadingModal = {
  color: "#FFFFFF",
  size: 20,
  overlayColor: "rgba(0,0,0,0.5)",
  closeOnTouch: false,
  loadingType: "Spinner", // 'Bubbles', 'DoubleBounce', 'Bars', 'Pulse', 'Spinner'
};

const sizeSet = {
  buttonWidth: "70%",
  inputWidth: "80%",
  radius: 18,
};

const styleSet = {
  menuBtn: {
    container: {
      backgroundColor: colorSet.grayBgColor,
      borderRadius: 22.5,
      padding: 10,
      marginLeft: 10,
      marginRight: 10,
    },
    icon: {
      tintColor: "black",
      width: 15,
      height: 15,
    },
  },
  searchBar: {
    container: {
      marginLeft: Platform.OS === "ios" ? 30 : 0,
      backgroundColor: "transparent",
      borderBottomColor: "transparent",
      borderTopColor: "transparent",
      flex: 1,
    },
    input: {
      backgroundColor: colorSet.inputBgColor,
      borderRadius: 10,
      color: "black",
    },
  },
  rightNavButton: {
    marginRight: 10,
  },
  borderRadius: {
    main: 25,
    small: 5,
  },
  textInputWidth: {
    main: "80%",
  },
  backArrowStyle: {
    resizeMode: "contain",
    tintColor: "#ff5a66",
    width: 25,
    height: 25,
    marginTop: Platform.OS === "ios" ? 50 : 20,
    marginLeft: 10,
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
};

const StyleDict = {
  iconSet,
  fontFamily,
  colorSet,
  navThemeConstants,
  fontSet,
  sizeSet,
  styleSet,
  loadingModal,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
};

export default StyleDict;
