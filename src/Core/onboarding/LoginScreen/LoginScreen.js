import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import Button from "react-native-button";
import { connect } from "react-redux";
import { useDynamicStyleSheet } from "react-native-dark-mode";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TNActivityIndicator from "../../truly-native/TNActivityIndicator";
import { IMLocalized } from "../../localization/IMLocalization";
import dynamicStyles from "./styles";
import { setUserData } from "../redux/auth";
import authManager from "../utils/authManager";
import { localizedErrorMessage } from "../utils/ErrorCode";
import {
  addTokenToHeader,
  loginWithEmailAndPassword,
} from "../../../API/requestManager";
import { saveToken, saveUser } from "../../../helpers/tokenManager";

const LoginScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const appStyles =
    props.navigation.state.params.appStyles ||
    props.navigation.getParam("appStyles");
  const styles = useDynamicStyleSheet(dynamicStyles(appStyles));
  const appConfig =
    props.navigation.state.params.appConfig ||
    props.navigation.getParam("appConfig");

  const onPressLogin = () => {
    setLoading(true);
    // authManager
    loginWithEmailAndPassword(email, password)
      .then(async (response) => {
        setLoading(false);
        // const user = { user: response.user.user };
        await addTokenToHeader();
        saveToken(response.user.user.token);
        saveUser(response.user);
        if (response.user) {
          debugger;
          props.setUserData(response.user);
          props.navigation.navigate("MainStack", { user: response.user });
        } else {
          Alert.alert(
            "",
            localizedErrorMessage(response.error),
            [{ text: IMLocalized("OK") }],
            {
              cancelable: false,
            }
          );
        }
      })
      .catch((err) => {
        debugger;
        setLoading(false);
        Alert.alert(
          "خطأ",
          JSON.stringify(err) + "خطأ في اسم المستخدم أو كلمة المرور",
          [{ text: IMLocalized("OK") }],
          {
            cancelable: false,
          }
        );
      });
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <TouchableOpacity
          style={{ alignSelf: "flex-start" }}
          onPress={() => props.navigation.goBack()}
        >
          <Image
            style={appStyles.styleSet.backArrowStyle}
            source={appStyles.iconSet.backArrow}
          />
        </TouchableOpacity>

        <View style={styles.info}>
          <ImageBackground
            style={{
              resizeMode: "center",
              width: "100%",
              height: "100%",
            }}
            imageStyle={{
              borderBottomLeftRadius: 35,
              borderBottomRightRadius: 35,
            }}
            source={appStyles.iconSet.identityBackground}
          >
            {/* <Image
              style={styles.image}
              source={appStyles.iconSet.logo}
              size={100}
              color="white"
            /> */}
          </ImageBackground>
        </View>
        {/* <Text style={styles.title}>{IMLocalized("Sign In")}</Text> */}
        <TextInput
          style={[styles.InputContainer, styles.marginTp260]}
          placeholder={IMLocalized("E-mail")}
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.InputContainer}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder={IMLocalized("Password")}
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <Button
          containerStyle={styles.loginContainer}
          style={styles.loginText}
          onPress={() => onPressLogin()}
          disabledContainerStyle={{ backgroundColor: "#ccc" }}
          disabled={loading || !email || !password}
        >
          {IMLocalized("Log In")}
        </Button>
        {/* 
        <View style={styles.signup}>
          <Text style={{ fontSize: 12 }}>
            بإنشائك حساب، تتم موافقتك على قواعد الاستخدام لدينا
          </Text>
        </View> */}
        <Button
          containerStyle={styles.signupContainer}
          style={styles.signup}
          onPress={() =>
            props.navigation.navigate("Signup", { appStyles, appConfig })
          }
        >
          هل لديك حساب؟ إنشاء حساب
        </Button>
        {/* <Text style={styles.orTextStyle}> {IMLocalized('OR')}</Text>
        <Button
          containerStyle={styles.facebookContainer}
          style={styles.facebookText}
          onPress={() => onFBButtonPress()}
        >
          {IMLocalized('Login With Facebook')}
        </Button>
        {appConfig.isSMSAuthEnabled && (
          <Button
            containerStyle={styles.phoneNumberContainer}
            onPress={() =>
              props.navigation.navigate('Sms', {
                isSigningUp: false,
                appStyles,
                appConfig,
              })
            }
          >
            {IMLocalized('Login with phone number')}
          </Button>
        )} */}

        {/* {loading && <TNActivityIndicator appStyles={appStyles} />} */}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default connect(null, {
  setUserData,
})(LoginScreen);
