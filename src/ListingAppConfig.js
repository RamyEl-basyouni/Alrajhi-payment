import { IMLocalized } from "./Core/localization/IMLocalization";
import AppStyles from "./DynamicAppStyles";
import { setI18nConfig } from "./Core/localization/IMLocalization";

setI18nConfig();

const regexForNames = /^[a-zA-Z]{2,25}$/;
const regexForPhoneNumber = /\d{9}$/;

const ListingAppConfig = {
  isSMSAuthEnabled: true,
  appIdentifier: "rn-ulistings-android",
  onboardingConfig: {
    welcomeTitle: "أهلا بك في تطبيق لبيب للمدفوعات",
    welcomeCaption:
      "تطبيق لبيب للمدفوعات يتيح لك إمكانية مراجعة حساباتك وتصنيفها أوتوماتيكيا",
    walkthroughScreens: [
      {
        icon: require("../assets/icons/logo.png"),
        title: IMLocalized("Build your perfect app"),
        description: IMLocalized("يجب عليك الربط بالايميل اولا"),
      },
      {
        icon: require("../assets/icons/map.png"),
        title: IMLocalized("Map View"),
        description: IMLocalized(
          "ثم عليك إعطاء الصلاحية للتطبيق للوصول للبيانات الخاصة بالايميل"
        ),
      },
      {
        icon: require("../assets/icons/heart.png"),
        title: IMLocalized("Saved Listings"),
        description: IMLocalized("ثم عليك إنشاء rule كما هو موضح بالايميل"),
      },
      // {
      //   icon: require("../assets/icons/filters.png"),
      //   title: IMLocalized("Advanced Custom Filters"),
      //   description: IMLocalized(
      //     "Custom dynamic filters to accommodate all markets and all customer needs."
      //   ),
      // },
      // {
      //   icon: require("../assets/icons/instagram.png"),
      //   title: IMLocalized("Add New Listings"),
      //   description: IMLocalized(
      //     "Add new listings directly from the app, including photo gallery and filters."
      //   )
      // },
      // {
      //   icon: require("../assets/icons/chat.png"),
      //   title: IMLocalized("Chat"),
      //   description: IMLocalized(
      //     "Communicate with your customers and vendors in real-time."
      //   )
      // },
      // {
      //   icon: require("../assets/icons/notification.png"),
      //   title: IMLocalized("Get Notified"),
      //   description: IMLocalized(
      //     "Stay on top of your game with real-time push notifications."
      //   )
      // }
    ],
  },

  tabIcons: {
    Home: {
      focus: AppStyles.iconSet.homefilled,
      unFocus: AppStyles.iconSet.homeUnfilled,
    },
    Categories: {
      focus: AppStyles.iconSet.firstBottomIconFilled,
      unFocus: AppStyles.iconSet.firstBottomIconUnFilled,
    },
    Messages: {
      focus: AppStyles.iconSet.secondBottomIconFilled,
      unFocus: AppStyles.iconSet.secondBottomIconUnFilled,
    },
    Search: {
      focus: AppStyles.iconSet.thirdBottomIcon,
      unFocus: AppStyles.iconSet.thirdBottomIconUnFilled,
    },
  },
  reverseGeoCodingAPIKey: "AIzaSyCDeWXVrJxUCRQlpcWK2JJQSB-kFVjCqlM",
  tosLink: "https://tetco.sa/",
  editProfileFields: {
    sections: [
      {
        title: IMLocalized("PUBLIC PROFILE"),
        fields: [
          {
            displayName: IMLocalized("First Name"),
            type: "text",
            editable: true,
            regex: regexForNames,
            key: "firstName",
            placeholder: "Your first name",
          },
          {
            displayName: IMLocalized("Last Name"),
            type: "text",
            editable: true,
            regex: regexForNames,
            key: "lastName",
            placeholder: "Your last name",
          },
        ],
      },
      {
        title: IMLocalized("PRIVATE DETAILS"),
        fields: [
          {
            displayName: IMLocalized("E-mail Address"),
            type: "text",
            editable: false,
            key: "email",
            placeholder: "Your email address",
          },
          {
            displayName: IMLocalized("Phone Number"),
            type: "text",
            editable: true,
            regex: regexForPhoneNumber,
            key: "phone",
            placeholder: "Your phone number",
          },
        ],
      },
    ],
  },
  userSettingsFields: {
    sections: [
      {
        title: IMLocalized("GENERAL"),
        fields: [
          {
            displayName: IMLocalized("Allow Push Notifications"),
            type: "switch",
            editable: true,
            key: "push_notifications_enabled",
            value: false,
          },
          {
            displayName: IMLocalized("Enable Face ID / Touch ID"),
            type: "switch",
            editable: true,
            key: "face_id_enabled",
            value: false,
          },
        ],
      },
      {
        title: "",
        fields: [
          {
            displayName: IMLocalized("Save"),
            type: "button",
            key: "savebutton",
          },
        ],
      },
    ],
  },
  contactUsFields: {
    sections: [
      {
        title: IMLocalized("CONTACT"),
        fields: [
          {
            displayName: IMLocalized("Address"),
            type: "text",
            editable: false,
            key: "contacus",
            value: "142 Steiner Street, San Francisco, CA, 94115",
          },
          {
            displayName: IMLocalized("E-mail us"),
            value: "florian@instamobile.io",
            type: "text",
            editable: false,
            key: "email",
            placeholder: "Your email address",
          },
        ],
      },
      {
        title: "",
        fields: [
          {
            displayName: IMLocalized("Call Us"),
            type: "button",
            key: "savebutton",
          },
        ],
      },
    ],
  },
  contactUsPhoneNumber: "+16504859694",
  homeConfig: {
    mainCategoryID: "11pMPqVV53qUsacuF6N1YD",
    mainCategoryName: "Restaurants",
  },
};

export default ListingAppConfig;
