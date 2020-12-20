const axios = require("axios").default;

axios.defaults.baseURL = "http://payments.labeeb.sa:8080/labeeb-payment";
import { getToken } from "../helpers/tokenManager";

export const addTokenToHeader = async () => {
  await getToken().then((token) => {
    debugger;
    if (token !== undefined) {
      axios.defaults.headers.common.Authorization = JSON.parse(token);
      console.log("token added");
    }
  });
};

export const getCardsByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    // ${CONFIG.domain}
    axios
      .get(`/api/v1/card/get-by-user/` + userId)
      .then((response) => {
        if (response.error) {
          resolve({ error: response.error });
        } else {
          resolve(response.data);
        }
      })
      .catch((err) => {
        debugger;
        reject(err.message);
      });
  });
};

const handleSuccessfulLogin = (user, accountCreated) => {
  return new Promise((resolve) => {
    resolve({ user: { ...user } });
  });
};

export const loginWithEmailAndPassword = (email, password) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/v1/users/login`, {
        email,
        password,
      })
      .then((response) => {
        debugger;
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
        reject(err.message);
      });
  });
};

export const getResourcesByCardId = (cardId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`/api/v1/category/get-by-card/` + cardId)
      .then((response) => {
        if (response.error) {
          resolve({ error: response.error });
        } else {
          resolve(response.data);
        }
      })
      .catch((err) => {
        debugger;
        reject(err.message);
      });
  });
};

export const getTransactionByCategoryId = (
  userId,
  cardId,
  classificationId /*categoryId*/
) => {
  return new Promise((resolve, reject) => {
    // ${CONFIG.domain}
    axios
      .get(
        // `${CONFIG.domain}/api/v1/transaction/get-by-category/${categoryId}/0/20`
        `/api/v1/transaction/get-by-user-card-classification/${userId}/${cardId}/${classificationId}/0/50`
      )
      .then((response) => {
        if (response.error) {
          resolve({ error: response.error });
        } else {
          resolve(response.data);
        }
      })
      .catch((err) => {
        debugger;
        reject(err.message);
      });
  });
};
