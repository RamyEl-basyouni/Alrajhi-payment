import firebase from "react-native-firebase";
import ServerConfiguration from "../ServerConfiguration";
import axios from "axios";
import CONFIG from "../Core/onboarding/utils/serviceConfig";

const savedListingsRef = firebase
  .firestore()
  .collection(ServerConfiguration.database.collection.SAVED_LISTINGS);
const listingsRef = firebase
  .firestore()
  .collection(ServerConfiguration.database.collection.LISTINGS);
const ListingCategoriesRef = firebase
  .firestore()
  .collection(ServerConfiguration.database.collection.CATEGORIES)
  .orderBy("order");

export const subscribeListingCategories = (callback) => {
  return ListingCategoriesRef.onSnapshot((querySnapshot) =>
    callback(querySnapshot)
  );
};

export const subscribeListings = (
  { docId, userId, categoryId, isApproved = true },
  callback
) => {
  if (docId) {
    return listingsRef.doc(docId).onSnapshot(callback);
  }

  if (userId) {
    return listingsRef
      .where("authorID", "==", userId)
      .where("isApproved", "==", isApproved)
      .onSnapshot(callback);
  }

  if (categoryId) {
    return listingsRef
      .where("categoryID", "==", categoryId)
      .where("isApproved", "==", isApproved)
      .onSnapshot(callback);
  }

  return listingsRef.where("isApproved", "==", isApproved).onSnapshot(callback);
};

export const subscribeSavedListings = (userId, callback, listingId) => {
  if (listingId) {
    return savedListingsRef
      .where("userID", "==", userId)
      .where("listingID", "==", listingId)
      .onSnapshot((querySnapshot) => callback(querySnapshot));
  }
  if (userId) {
    return savedListingsRef
      .where("userID", "==", userId)
      .onSnapshot((querySnapshot) => callback(querySnapshot));
  }

  return savedListingsRef.onSnapshot((querySnapshot) =>
    callback(querySnapshot)
  );
};

export const saveUnsaveListing = (item, userId) => {
  if (item.saved) {
    savedListingsRef
      .where("listingID", "==", item.id)
      .where("userID", "==", userId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
  } else {
    savedListingsRef
      .add({
        userID: userId,
        listingID: item.id,
      })
      .then((docRef) => {})
      .catch((error) => {
        alert(error);
      });
  }
};

export const removeListing = async (listingId, callback) => {
  listingsRef
    .doc(listingId)
    .delete()
    .then(() => {
      savedListingsRef
        .where("listingID", "==", listingId)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(function(doc) {
            doc.ref.delete();
          });
        });
      callback({ success: true });
    })
    .catch((error) => {
      callback({ success: false });
      console.log("Error deleting listing: ", error);
    });
};

export const approveListing = (listingId, callback) => {
  listingsRef
    .doc(listingId)
    .update({ isApproved: true })
    .then(() => {
      callback({ success: true });
    })
    .catch((error) => {
      callback({ success: false });
      console.log("Error approving listing: ", error);
    });
};

export const postListing = (
  selectedItem,
  uploadObject,
  photoUrls,
  location,
  callback
) => {
  const updatedUploadObjects = {
    ...uploadObject,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    coordinate: new firebase.firestore.GeoPoint(
      location.latitude,
      location.longitude
    ),
  };

  const coverPhoto = photoUrls.length > 0 ? photoUrls[0] : null;

  if (selectedItem) {
    listingsRef
      .doc(selectedItem.id)
      .update({ ...updatedUploadObjects, photo: coverPhoto })
      .then((docRef) => {
        callback({ success: true });
      })
      .catch((error) => {
        console.log(error);
        callback({ success: false });
      });
  } else {
    listingsRef
      .add(updatedUploadObjects)
      .then((docRef) => {
        if (docRef.id) {
          listingsRef
            .doc(docRef.id)
            .update({ id: docRef.id, photo: coverPhoto });
        }
        callback({ success: true });
      })
      .catch((error) => {
        console.log(error);
        callback({ success: false });
      });
  }
};

export const getCardsByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${CONFIG.domain}/api/v1/card/get-by-user/` + userId)
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

export const getResourcesByCardId = (cardId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${CONFIG.domain}/api/v1/category/get-by-card/` + cardId)
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
    axios
      .get(
        // `${CONFIG.domain}/api/v1/transaction/get-by-category/${categoryId}/0/20`
        `${CONFIG.domain}/api/v1/transaction/get-by-user-card-classification/${userId}/${cardId}/${classificationId}/0/50`
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
