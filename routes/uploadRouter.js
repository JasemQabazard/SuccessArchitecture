const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const authenticate = require('../authenticate');
const cors = require('./cors');

// s3 
const AWS = require('aws-sdk');
const uuid = require('uuid/v1');
const Keys = require('../config');
const s3 = new AWS.S3({
    accessKeyId: Keys.accessKeyId,
    secretAccessKey: Keys.secretAccessKey,
    region: 'ap-southeast-1'
});

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/aws/:specs')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    const uid = req.params.specs.substring(0, 24);
    const fileext = req.params.specs.substring(24);
    const key = `${uid}/${uuid()}.${fileext}`;
    console.log(fileext, req.params.specs, key);
    s3.getSignedUrl('putObject', {
       Bucket: 'successarchitecture',
       ContentType: `image/${fileext}`,
       Key: key
    }, (err, url) => res.send({key, url}));
});

module.exports = uploadRouter;