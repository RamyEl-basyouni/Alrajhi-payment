import { firebaseAuth } from "../../firebase";
import { firebaseStorage } from "../../firebase/storage";
import { ErrorCode } from "./ErrorCode";
import Geolocation from "@react-native-community/geolocation";
import AsyncStorage from "@react-native-community/async-storage";
import { Alert } from "react-native";
import { deleteToken, deleteUser } from "../../../helpers/tokenManager";

const FBSDK = require("react-native-fbsdk");
const { LoginManager, AccessToken } = FBSDK;
import axios from "axios";
import CONFIG from "./serviceConfig";

const defaultProfilePhotoURL =
  "https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg";

const retrievePersistedAuthUser = () => {
  debugger;
  return new Promise((resolve) => {
    AsyncStorage.getItem("id_token").then((token) => {
      if (token) {
        resolve({ token });
      } else {
        resolve(null);
      }
    });
  });
  // return new Promise((resolve) => {
  //   firebaseAuth.retrievePersistedAuthUser().then((user) => {
  //     if (user) {
  //       handleSuccessfulLogin(user, false).then((user) => {
  //         // Persisted login successful, push token stored, login credential persisted, so we log the user in.
  //         resolve({ user });
  //       });
  //     } else {
  //       resolve(null);
  //     }
  //   });
  // });
};

// const loginWithEmailAndPassword = (email, password) => {
//   return new Promise(function(resolve, _reject) {
//     firebaseAuth.loginWithEmailAndPassword(email, password).then((response) => {
//       if (!response.error) {
//         handleSuccessfulLogin({ ...response.user }, false).then((user) => {
//           // Login successful, push token stored, login credential persisted, so we log the user in.
//           resolve({ user });
//         });
//       } else {
//         resolve({ error: response.error });
//       }
//     });
//   });
// };

const loginWithEmailAndPassword = (email, password) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${CONFIG.domain}/api/v1/users/login`, {
        email,
        password,
      })
      .then((response) => {
        if (response.data) {
          handleSuccessfulLogin({ ...response.data }, false).then((user) => {
            // Login successful, push token stored, login credential persisted, so we log the user in.
            resolve({ user });
          });
        } else {
          debugger;
          reject(response.data.error);
        }
      })
      .catch((err) => {
        // setLoading(false);
        // Alert.alert(err.message, " error ", [{ text: IMLocalized("OK") }], {
        //   cancelable: false,
        // });
        reject(err.message);
      });
  });
};

// const logout = (user) => {
//   const userData = {
//     ...user,
//     isOnline: false,
//   };
//   firebaseAuth.updateUser(user.id || user.userID, userData);
//   firebaseAuth.logout();
// };

const logout = async () => {
  try {
    await AsyncStorage.removeItem("id_token");
    await deleteToken();
    await deleteUser();
    // Alert.alert("Logout Success!");
  } catch (error) {
    console.log("AsyncStorage error: " + error.message);
  }
};

// const createAccountWithEmailAndPassword = (userDetails, appIdentifier) => {
//   const { photoURI } = userDetails;
//   const accountCreationTask = (userData) => {
//     return new Promise(function(resolve, _reject) {
//       firebaseAuth.register(userData, appIdentifier).then((response) => {
//         if (response.error) {
//           resolve({ error: response.error });
//         } else {
//           // We created the user succesfully, time to upload the profile photo and update the users table with the correct URL
//           let user = response.user;
//           if (photoURI) {
//             firebaseStorage.uploadImage(photoURI).then((response) => {
//               if (response.error) {
//                 // if account gets created, but photo upload fails, we still log the user in
//                 resolve({
//                   nonCriticalError: response.error,
//                   user: { ...user, profilePictureURL: defaultProfilePhotoURL },
//                 });
//               } else {
//                 firebaseAuth
//                   .updateProfilePhoto(user.id, response.downloadURL)
//                   .then((_result) => {
//                     resolve({
//                       user: {
//                         ...user,
//                         profilePictureURL: response.downloadURL,
//                       },
//                     });
//                   });
//               }
//             });
//           } else {
//             resolve({
//               user: {
//                 ...response.user,
//                 profilePictureURL: defaultProfilePhotoURL,
//               },
//             });
//           }
//         }
//       });
//     });
//   };

//   return new Promise(function(resolve, _reject) {
//     const userData = {
//       ...userDetails,
//       profilePictureURL: defaultProfilePhotoURL,
//     };
//     accountCreationTask(userData).then((response) => {
//       if (response.error) {
//         resolve({ error: response.error });
//       } else {
//         // We signed up successfully, so we are logging the user in (as well as updating push token, persisting credential,s etc.)
//         handleSuccessfulLogin(response.user, true).then((response) => {
//           resolve(response);
//         });
//       }
//     });
//   });
// };

const createAccountWithEmailAndPassword = (userDetails) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${CONFIG.domain}/api/v1/users/create`, {
        ...userDetails,
      })
      .then((response) => {
        debugger;
        if (response.error) {
          resolve({ error: response.error });
        } else {
          // We signed up successfully, so we are logging the user in (as well as updating push token, persisting credential,s etc.)
          handleSuccessfulLogin(response.data.data, true).then((response) => {
            resolve(response);
          });
        }
      })
      .catch((err) => {
        // setLoading(false);
        // Alert.alert(err.message, " error ", [{ text: IMLocalized("OK") }], {
        //   cancelable: false,
        // });
        reject(err.message);
      });
  });
};

const loginOrSignUpWithFacebook = (appIdentifier) => {
  return new Promise((resolve, _reject) => {
    LoginManager.logInWithPermissions(["email"]).then(
      (result) => {
        if (result.isCancelled) {
          resolve({ error: ErrorCode.fbAuthCancelled });
          return;
        }
        AccessToken.getCurrentAccessToken().then((data) => {
          const fbAccessToken = data.accessToken;
          firebaseAuth
            .loginWithFacebook(fbAccessToken, appIdentifier)
            .then((response) => {
              if (response.user) {
                const newResponse = {
                  user: { ...response.user },
                  accountCreated: response.accountCreated,
                };
                handleSuccessfulLogin(
                  newResponse.user,
                  response.accountCreated
                ).then((response) => {
                  resolve(response);
                });
              } else {
                resolve({ error: ErrorCode.fbAuthFailed });
              }
            });
        });
      },
      (_error) => {
        resolve({ error: ErrorCode.fbAuthFailed });
      }
    );
  });
};

const retrieveUserByPhone = (phone) => {
  return firebaseAuth.retrieveUserByPhone(phone);
};

const sendSMSToPhoneNumber = (phoneNumber) => {
  return firebaseAuth.sendSMSToPhoneNumber(phoneNumber);
};

const loginWithSMSCode = (smsCode, verificationID) => {
  return new Promise(function(resolve, _reject) {
    firebaseAuth.loginWithSMSCode(smsCode, verificationID).then((response) => {
      if (response.error) {
        resolve({ error: response.error });
      } else {
        // successful phone number login, we fetch the push token
        handleSuccessfulLogin(response.user, false).then((response) => {
          resolve(response);
        });
      }
    });
  });
};

const registerWithPhoneNumber = (
  userDetails,
  smsCode,
  verificationID,
  appIdentifier
) => {
  const { photoURI } = userDetails;
  const accountCreationTask = (userData) => {
    return new Promise(function(resolve, _reject) {
      firebaseAuth
        .registerWithPhoneNumber(
          userData,
          smsCode,
          verificationID,
          appIdentifier
        )
        .then((response) => {
          if (response.error) {
            resolve({ error: response.error });
          } else {
            // We created the user succesfully, time to upload the profile photo and update the users table with the correct URL
            let user = response.user;
            if (photoURI) {
              firebaseStorage.uploadImage(photoURI).then((response) => {
                if (response.error) {
                  // if account gets created, but photo upload fails, we still log the user in
                  resolve({
                    nonCriticalError: response.error,
                    user: {
                      ...user,
                      profilePictureURL: defaultProfilePhotoURL,
                    },
                  });
                } else {
                  firebaseAuth
                    .updateProfilePhoto(user.id, response.downloadURL)
                    .then((_res) => {
                      resolve({
                        user: {
                          ...user,
                          profilePictureURL: response.downloadURL,
                        },
                      });
                    });
                }
              });
            } else {
              resolve({
                user: {
                  ...response.user,
                  profilePictureURL: defaultProfilePhotoURL,
                },
              });
            }
          }
        });
    });
  };

  return new Promise(function(resolve, _reject) {
    const userData = {
      ...userDetails,
      profilePictureURL: defaultProfilePhotoURL,
    };
    accountCreationTask(userData).then((response) => {
      if (response.error) {
        resolve({ error: response.error });
      } else {
        handleSuccessfulLogin(response.user, true).then((response) => {
          resolve(response);
        });
      }
    });
  });
};

const handleSuccessfulLogin = (user, accountCreated) => {
  // After a successful login, we fetch & store the device token for push notifications, location, online status, etc.
  // we don't wait for fetching & updating the location or push token, for performance reasons (especially on Android)
  // fetchAndStoreExtraInfoUponLogin(user, accountCreated);
  return new Promise((resolve) => {
    resolve({ user: { ...user } });
  });
};

const fetchAndStoreExtraInfoUponLogin = async (user, accountCreated) => {
  getCurrentLocation(Geolocation).then(async (location) => {
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    var locationData = {};
    if (location) {
      locationData = {
        location: {
          latitude: latitude,
          longitude: longitude,
        },
      };
      if (accountCreated) {
        locationData = {
          ...locationData,
          signUpLocation: {
            latitude: latitude,
            longitude: longitude,
          },
        };
      }
    }
    const pushToken = await firebaseAuth.fetchPushTokenIfPossible();
    const userData = {
      ...user,
      ...locationData,
      pushToken: pushToken,
      isOnline: true,
    };
    firebaseAuth.updateUser(user.id || user.userID, userData);
  });
};

const getCurrentLocation = (geolocation) => {
  return new Promise((resolve) => {
    geolocation.getCurrentPosition(
      resolve,
      () => resolve({ coords: { latitude: "", longitude: "" } }),
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
    );
  });
};

const authManager = {
  retrievePersistedAuthUser,
  loginWithEmailAndPassword,
  logout,
  createAccountWithEmailAndPassword,
  loginOrSignUpWithFacebook,
  sendSMSToPhoneNumber,
  loginWithSMSCode,
  registerWithPhoneNumber,
  retrieveUserByPhone,
};

export default authManager;
