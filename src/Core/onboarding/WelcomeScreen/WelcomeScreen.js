import React, { useState, useEffect } from "react";
import Button from "react-native-button";
import { Text, View, Image } from "react-native";
import { useDynamicStyleSheet } from "react-native-dark-mode";
import TNActivityIndicator from "../../truly-native/TNActivityIndicator";
import { IMLocalized } from "../../localization/IMLocalization";
import dynamicStyles from "./styles";
import { setUserData } from "../redux/auth";
import { connect } from "react-redux";
import authManager from "../utils/authManager";
import { getUser, getToken } from "../../../helpers/tokenManager";

const WelcomeScreen = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const appStyles =
    props.navigation.state.params.appStyles ||
    props.navigation.getParam("appStyles");
  const styles = useDynamicStyleSheet(dynamicStyles(appStyles));
  const appConfig =
    props.navigation.state.params.appConfig ||
    props.navigation.getParam("appConfig");

  useEffect(() => {
    tryToLoginFirst();
  }, []);

  const tryToLoginFirst = async () => {
    setIsLoading(true);
    const token = await getToken();
    // const user = {
    //   user: {
    //     username: "mghazal",
    //     token:
    //       "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhYUBhYS5jb20iLCJleHAiOjE2MDY5MTkyMzR9.W2KGPKxDgXEzYXhX_Pz2VFWT0UL68fh6ayAiMbveiTuw9XLfgKQpSmT3XikWG-qt_p0D3xuozHDQWOGn62NSfA",
    //     email: "aa@aa.com",
    //     firstName: "ghazal",
    //     lastName: "mohamed",
    //     phoneNumber: "null",
    //     createdDate: "2020-08-27 23:38:58.693",
    //     active: "true",
    //     id: "1",
    //     totalSavings: "25533.0",
    //   },
    // };
    setIsLoading(false);
    if (token != undefined) {
      const user = await getUser();
      let userData;
      userData = user && JSON.parse(user);
      props.setUserData(userData);
      props.navigation.navigate("MainStack", { user: userData });
    }
  };

  if (isLoading == true) {
    return <TNActivityIndicator appStyles={appStyles} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Image style={styles.logoImage} source={appStyles.iconSet.logo} />
      </View>
      <Button
        containerStyle={styles.loginContainer}
        style={styles.loginText}
        onPress={() => {
          props.navigation.navigate("Login", { appStyles, appConfig });
        }}
      >
        {IMLocalized("Log In")}
      </Button>
      <Button
        containerStyle={styles.signupContainer}
        style={styles.signupText}
        onPress={() => {
          props.navigation.navigate("Signup", { appStyles, appConfig });
        }}
      >
        {IMLocalized("Sign Up")}
      </Button>
    </View>
  );
};

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.user,
  };
};

export default connect(mapStateToProps, {
  setUserData,
})(WelcomeScreen);
