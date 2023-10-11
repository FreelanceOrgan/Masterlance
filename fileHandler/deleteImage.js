const { getStorage, ref, deleteObject } = require("firebase/storage");
const {initializeApp} = require("firebase/app");
const {firebaseConfig} = require("../Config/firebase");

exports.deleteImage = async (imageUrl) => {
  try {
    initializeApp(firebaseConfig);
    const storage = getStorage();
    const startIndex = imageUrl.indexOf("images");
    const endIndex = imageUrl.indexOf(".jpeg");
    const imageRef = imageUrl.substring(startIndex, endIndex + 5).replaceAll("%2F", "/");
    const desertRef = ref(storage, imageRef);
    await deleteObject(desertRef);
  } catch(error) {
    throw new Error(error.message);
  }
}