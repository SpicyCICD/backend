// Load environment variables from .env file
require('dotenv').config();

// Import the AWS SDK
const AWS = require('aws-sdk');

// Configure AWS to use your credentials and region from environment variables
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Create an S3 service object
const s3 = new AWS.S3();

// Your bucket name from environment variable
const bucketName = process.env.S3_BUCKET_NAME;

// Example usage: Listing the buckets
s3.listBuckets((err, data) => {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data.Buckets);
    }
});

// Note: To use the bucketName for operations, you'll reference it in your S3 method calls.
// For example, to list objects in the specified bucket:
/*
s3.listObjectsV2({ Bucket: bucketName }, (err, data) => {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});
*/
