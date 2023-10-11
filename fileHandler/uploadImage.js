const sharp = require('sharp');
const { v4: uuidv4 } = require("uuid");
const {initializeApp} = require("firebase/app");
const {getStorage, ref, uploadBytesResumable, getDownloadURL} = require("firebase/storage");
const asyncHandler = require("express-async-handler")
const {multerSettings} = require("../settings/multerSettings")
const {firebaseConfig} = require("../Config/firebase");

const uploadImageList = (fieldNamesArray) => multerSettings.fields(fieldNamesArray);

const filterImageInfo = (request) => {
    const buffers = [];
    if(request.files) {
        for(const field in request.files) {
            const info = request.files[field].map(element => ({buffer: element.buffer, size: element.size}))
            buffers.push({name: field, fileInfo: info});
        }
        return buffers;
    }
}

const processImage = async (files) => {
    const processedImageBuffer = [];
    if(files) {
        for(const file of files) {
            const processedFile = [];
            for(const info of file.fileInfo) {
                if(info.size / 1024 > 200) {
                    const processedBuffer = await sharp(info.buffer, { failOnError: false }).toFormat("jpeg").jpeg({ mozjpeg: true, quality: 10}).toBuffer();
                    processedFile.push(processedBuffer);
                }
                else {
                    processedFile.push(info.buffer);
                }
            }
            processedImageBuffer.push({name: file.name, buffers: processedFile});
        }
    }
    return processedImageBuffer;    
}

const uploadImageOnFirebase = async (modelName, path, arrayOfBuffer) => {
    const uploadedImage = [];
    if(arrayOfBuffer.length > 0) {
        initializeApp(firebaseConfig);
        const storage = getStorage();
        for(const item of arrayOfBuffer) {
            const urls = [];
            for(const buffer of item.buffers) {
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
                const fileName = `${modelName}-${uuidv4()}-${uniqueSuffix}.jpeg`;
                const storageRef = ref(storage, `images/${path}/${fileName}`);
                const snapshot = await uploadBytesResumable(storageRef, buffer, {contentType: 'image/jpeg'});
                const imageUrl = await getDownloadURL(snapshot.ref);
                urls.push(imageUrl);
            }
            uploadedImage.push({name: item.name, urls: urls})
        }
    }
    return uploadedImage
}

const toFirebase = (fieldNamesArray, modelName, directory) =>
asyncHandler(async (request, response, next) => {
    const files = filterImageInfo(request);
    const arrayOfBuffer = await processImage(files);
    const imageURLs = await uploadImageOnFirebase(modelName, directory, arrayOfBuffer);
    if(imageURLs.length > 0) {
        for(let i = 0; i < fieldNamesArray.length; i++) {
            if(fieldNamesArray[i].maxCount > 1) {
                request.body[imageURLs[i].name] = imageURLs[i].urls;
            }
            else {
                request.body[imageURLs[i].name] = imageURLs[i].urls[0];
            }
            // await deleteImage(user.profileImage);
        }
    }
    next();
})


module.exports = {uploadImageList, toFirebase};
