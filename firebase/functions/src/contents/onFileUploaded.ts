import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import processPhoto from './onFileUploaded/processPhoto';
// import processVideo from './onFileUploaded/processVideo';

/*
This function will run as soon as a file gets uploaded on the default bucket
inside images folder

Steps:
1. Retrieve object
2. Extract the name and contentType from object
3. Split the name and check if first index is equal to images and second index has value
4. If true, proceed else delete file and notify error.
5. If contentType starts with uploaded/ run processPhoto function then return id

processPhoto:
1. Get original image
2. Resize
2. Save it in storage
3. Return URL
*/

module.exports = functions
    .runWith({memory: '512MB'})
    .storage.object().onFinalize(async (object) => {
      const {name, contentType} = object;
      const tokens = name?.split('/');
      const bucket = admin.storage().bucket(object.bucket);
      const file = bucket.file(name!);

      if (tokens![0] === 'uploaded' && tokens![1]) {
        if (contentType?.startsWith('image/')) {
          // const fileName = tokens![1].split('.')[0];
          await processPhoto(bucket, file, false);
          return;
        } else {
          file.delete().then(() => {
            console.log('Successfully deleted photo.');
          }).catch((err) => {
            console.log(`Failed to remove photo, error: ${err}`);
          });
        }
      }
      if (tokens![0] === 'channelUploads' && tokens![1]) {
        if (contentType?.startsWith('image/')) {
          await processPhoto(bucket, file, true);
          return;
        } else {
          file.delete().then(() => {
            console.log('Successfully deleted photo.');
          }).catch((err) => {
            console.log(`Failed to remove photo, error: ${err}`);
          });
        }
      }
    } );
