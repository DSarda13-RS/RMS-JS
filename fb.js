const express = require('express');
const app = express();
const compression = require('compression');
const path = require('path');

const saltedMd5=require('salted-md5');
const multer=require('multer');
const upload=multer({storage: multer.memoryStorage()});
require('dotenv').config();


// view engine setup
app.set('views', path.join(__dirname, 'static', 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.json());
app.use(compression());
app.use('/public', express.static(path.join(__dirname, 'static', 'public')));


let admin = require("firebase-admin");

let serviceAccount = require("./utils/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.BUCKET_URL
});
app.locals.bucket = admin.storage().bucket();

