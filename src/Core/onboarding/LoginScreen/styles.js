import { I18nManager } from "react-native";
import { DynamicStyleSheet } from "react-native-dark-mode";

const dynamicStyles = (appStyles) => {
  return new DynamicStyleSheet({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: appStyles.colorSet.mainThemeBackgroundColor,
    },
    orTextStyle: {
      color: appStyles.colorSet.mainTextColor,
      marginTop: 40,
      marginBottom: 10,
      alignSelf: "center",
    },
    title: {
      fontSize: 30,
      fontWeight: "bold",
      color: appStyles.colorSet.mainThemeForegroundColor,
      marginTop: 300,
      marginBottom: 20,
      alignSelf: "stretch",
      textAlign: "left",
      marginLeft: 30,
    },
    loginContainer: {
      width: "80%",
      backgroundColor: appStyles.colorSet.mainThemeForegroundColor,
      borderRadius: 18,
      padding: 10,
      marginTop: 30,
      alignSelf: "center",
      height: 60,
      marginTop: 60,
    },
    loginText: {
      color: appStyles.colorSet.mainThemeBackgroundColor,
      fontSize: 24,
      fontWeight: "bold",
    },
    placeholder: {
      color: "red",
    },
    InputContainer: {
      // height: 38,
      borderWidth: 1,
      borderColor: appStyles.colorSet.grey3,
      paddingLeft: 20,
      color: appStyles.colorSet.mainTextColor,
      width: "80%",
      alignSelf: "center",
      marginTop: 20,
      alignItems: "center",
      borderRadius: 8,
      backgroundColor: "#f0f2f5",
      height: 60,
      textAlign: I18nManager.isRTL ? "right" : "left",
    },
    marginTp260: {
      marginTop: 260,
    },
    facebookContainer: {
      width: "70%",
      backgroundColor: "#4267B2",
      borderRadius: 25,
      padding: 10,
      marginTop: 30,
      alignSelf: "center",
    },
    facebookText: {
      color: "#ffffff",
    },
    phoneNumberContainer: {
      marginTop: 20,
    },
    info: {
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      top: 0,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 6,
      },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      elevation: 12,
      height: "37%",
      width: "50%",
      textAlignVertical: "center",
      textAlign: "center",
      alignContent: "center",
      marginLeft: "23%",
      // borderBottomWidth: 15,
      // borderWidth: 0.3,
      borderBottomLeftRadius: 35,
      borderBottomRightRadius: 35,
      overflow: "hidden",
      // marginTop: "27%",
    },
    // image: {
    //   width: 100,
    //   height: 120,
    //   marginBottom: 60,
    //   tintColor: "green",
    // },
    signupContainer: {
      marginTop: 100,
    },
    signup: {
      alignItems: "center",
      justifyContent: "center",
      height: 30,
      color: "#757482",
    },
  });
};

export default dynamicStyles;
