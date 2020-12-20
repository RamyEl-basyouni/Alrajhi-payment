import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import Button from "react-native-button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDynamicStyleSheet } from "react-native-dark-mode";
import dynamicStyles from "./styles";
import TNActivityIndicator from "../../truly-native/TNActivityIndicator";
import TNProfilePictureSelector from "../../truly-native/TNProfilePictureSelector/TNProfilePictureSelector";
import { IMLocalized } from "../../localization/IMLocalization";
import { setUserData } from "../redux/auth";
import { connect } from "react-redux";
import authManager from "../utils/authManager";
import { localizedErrorMessage } from "../utils/ErrorCode";
import TermsOfUseView from "../components/TermsOfUseView";

const SignupScreen = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [profilePictureURL, setProfilePictureURL] = useState(null);
  const [loading, setLoading] = useState(false);

  const appConfig =
    props.navigation.state.params.appConfig ||
    props.navigation.getParam("appConfig");
  const appStyles =
    props.navigation.state.params.appStyles ||
    props.navigation.getParam("appStyles");
  const styles = useDynamicStyleSheet(dynamicStyles(appStyles));

  const onRegister = () => {
    setLoading(true);
    const userDetails = {
      firstName,
      lastName,
      username,
      email,
      password,
      // photoURI: profilePictureURL,
      // appIdentifier: appConfig.appIdentifier,
    };
    authManager
      .createAccountWithEmailAndPassword(userDetails, appConfig.appIdentifier)
      .then((response) => {
        const user = response.user;
        if (user) {
          // props.setUserData({ user: user });
          // props.navigation.navigate("MainStack", { user: user });
          authManager
            .loginWithEmailAndPassword(email, password)
            .then((response) => {
              if (response.user) {
                const user = response.user;
                props.setUserData(user);
                props.navigation.navigate("MainStack", { user: user });
              } else {
                setLoading(false);
                Alert.alert(
                  "",
                  localizedErrorMessage(response.errors[0]),
                  [{ text: IMLocalized("OK") }],
                  {
                    cancelable: false,
                  }
                );
              }
            })
            .catch((responseError) => {
              setLoading(false);
              Alert.alert(
                "خطأ",
                responseError.errors[0],
                [{ text: IMLocalized("OK") }],
                {
                  cancelable: false,
                }
              );
            });
        } else {
          Alert.alert(
            "خطأ",
            localizedErrorMessage(responseError.errors[0]),
            [{ text: IMLocalized("OK") }],
            {
              cancelable: false,
            }
          );
        }
        setLoading(false);
      })
      .catch((responseError) => {
        debugger;
        setLoading(false);
        Alert.alert(
          "خطأ",
          "برجاء التحقق من البريد الالكتروني",
          [{ text: IMLocalized("OK") }],
          {
            cancelable: false,
          }
        );
      });
  };

  const renderSignupWithEmail = () => {
    return (
      <>
        <TextInput
          style={styles.InputContainer}
          placeholder={IMLocalized("First Name")}
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
          underlineColorAndroid="transparent"
        />

        <TextInput
          style={styles.InputContainer}
          placeholder={IMLocalized("Last Name")}
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setLastName(text)}
          value={lastName}
          underlineColorAndroid="transparent"
        />

        <TextInput
          style={styles.InputContainer}
          placeholder={IMLocalized("User Name")}
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setUserName(text)}
          value={username}
          underlineColorAndroid="transparent"
        />

        <TextInput
          style={styles.InputContainer}
          placeholder={IMLocalized("E-mail Address")}
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.InputContainer}
          placeholder={IMLocalized("Password")}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <Button
          containerStyle={styles.signupContainer}
          style={styles.signupText}
          onPress={() => onRegister()}
          disabledContainerStyle={{ backgroundColor: "#ccc" }}
          disabled={
            loading ||
            !email ||
            !password ||
            !firstName ||
            !lastName ||
            !username
          }
        >
          {IMLocalized("Sign Up")}
        </Button>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image
            style={appStyles.styleSet.backArrowStyle}
            source={appStyles.iconSet.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{IMLocalized("Create new account")}</Text>
        {/* <TNProfilePictureSelector
          setProfilePictureURL={setProfilePictureURL}
          appStyles={appStyles}
        /> */}
        {renderSignupWithEmail()}
        {/* {appConfig.isSMSAuthEnabled && (
          <>
            <Text style={styles.orTextStyle}>{IMLocalized('OR')}</Text>
            <Button
              containerStyle={styles.PhoneNumberContainer}
              onPress={() =>
                props.navigation.navigate('Sms', {
                  isSigningUp: true,
                  appStyles,
                  appConfig,
                })
              }
            >
              {IMLocalized('Sign up with phone number')}
            </Button>
          </>
        )} */}
        <TermsOfUseView tosLink={appConfig.tosLink} style={styles.tos} />
      </KeyboardAwareScrollView>
      {loading && <TNActivityIndicator appStyles={appStyles} />}
    </View>
  );
};

export default connect(null, {
  setUserData,
})(SignupScreen);
