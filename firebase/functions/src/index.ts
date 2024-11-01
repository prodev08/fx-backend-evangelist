import * as admin from 'firebase-admin';
admin.initializeApp();

exports.onFileUploaded = require('./contents/onFileUploaded');
exports.photos = require('./contents/photos');
