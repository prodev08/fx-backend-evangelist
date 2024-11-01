const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const bucket = admin.storage().bucket().name;

const app = express();
app.use(cors({origin: true}));
app.use(bodyParser.json());
app.get(/\/0\/(.*)/, async (req: any, res: any) => {
  try {
    const param = req.params['0'];
    res.type(param.substring(param.lastIndexOf('.') + 1));
    admin.storage()
        .bucket(bucket)
        .file(`photos/${param}`)
        .createReadStream({decompress: true})
        .pipe(res);
  } catch (e) {
    console.error(e);
    res.sendStatus(404);
  }
});

app.get(/\/sports\/(.*)/, async (req: any, res: any) => {
  try {
    const param = req.params['0'];
    res.type(param.substring(param.lastIndexOf('.') + 1));
    admin.storage()
        .bucket(bucket)
        .file(`sports/${param}`)
        .createReadStream({decompress: true})
        .pipe(res);
  } catch (e) {
    console.error(e);
    res.sendStatus(404);
  }
});

module.exports = functions.https.onRequest(app);
