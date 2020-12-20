import SInfo from "react-native-sensitive-info";

export const saveToken = (token) => {
  SInfo.setItem("USER_TOKEN_DATA", JSON.stringify(token), {}).then(() => {
    console.log("CallBack");
  });
};

export const getToken = () => {
  return SInfo.getItem("USER_TOKEN_DATA", {});
};

export const deleteToken = () => {
  SInfo.deleteItem("USER_TOKEN_DATA", {});
};

export const saveUser = (user) => {
  SInfo.setItem("USER_Data", JSON.stringify(user), {}).then(() => {
    debugger;
    console.log("CallBack");
  });
};

export const getUser = () => {
  return SInfo.getItem("USER_Data", {});
};

export const deleteUser = () => {
  SInfo.deleteItem("USER_Data", {});
};
