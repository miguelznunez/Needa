const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");
require("dotenv").config();

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

// NEW INSTANCE OF THE S3 OBJECT SO WE CAN ACCESS THE BUCKET FROM AWS
const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
});

// IMAGE FUNCTIONS ================================================

deleteImage = (userId, filekey) => {
    const deleteParams = {
        Key: `${userId}/images/${filekey}`,
        Bucket: bucketName
    }
    return s3.deleteObject(deleteParams).promise();
}

uploadImage = (userId, file) => {
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: `${userId}/images/${file.filename}`
    }
    return s3.upload(uploadParams).promise();
}

getImageStream = (userId, fileKey) => {
    const downloadParams = {
        Key: `${userId}/images/${fileKey}`,
        Bucket: bucketName
    }
    return s3.getObject(downloadParams).createReadStream()
}

module.exports = {deleteImage, uploadImage, getImageStream};