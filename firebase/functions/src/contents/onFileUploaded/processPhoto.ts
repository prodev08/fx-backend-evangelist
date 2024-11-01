import {Bucket, File} from '@google-cloud/storage';
import * as tmp from 'tmp';
import * as fs from 'fs';
import * as sharp from 'sharp';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {v4: uuidv4} = require('uuid');

tmp.setGracefulCleanup();
function createUploadOptions(destination: string, metadata: any) {
  return {
    destination,
    contentType: 'image/webp',
    predefinedAcl: 'publicRead',
    metadata: {
      cacheControl: 'public, max-age=31536000',
      metadata,
    },
  };
}

async function createUpload(bucket: any, fileName: string, type: string | null, uid: string,
    stream: any, format: string, creator: any) {
  const ext = format === 'jpeg' ? 'jpg' : format;
  const file = await newTempFile();
  const newStream = stream.clone().rotate();
  const sharpStream = creator ? creator(newStream) : newStream;
  await sharpStream.toFile(file);
  return bucket
      .upload(file, createUploadOptions(`photos/${fileName}${type ? `-${type}` : ''}.${ext}`, {uid}));
}

function newTempFile() {
  return new Promise((resolve, reject) => {
    tmp.file((err, file) => {
      if (err) return reject(err);
      return resolve(file);
    });
  });
}

export default async function(destinationBucket: Bucket, file: File, fromChannel: boolean) {
  const original: any = await newTempFile();
  const download = await file.createReadStream({validation: false}).pipe(fs.createWriteStream(original));
  await new Promise((resolve) => download.on('finish', resolve));
  const stream = sharp(original);
  const id = file.name.split('/')[1].split('.')[0];
  if (fromChannel) {
    await createUpload(destinationBucket, id, '1024', uuidv4(), stream, 'webp', (sharp: any) =>
      sharp.resize(1024, 1024, {fit: 'inside', withoutEnlargement: true}).jpeg());
    await createUpload(destinationBucket, id, '200sq', uuidv4(), stream, 'webp', (sharp: any) =>
      sharp.resize(200, 200).jpeg());
    await createUpload(destinationBucket, id, '640x360', uuidv4(), stream, 'webp', (sharp: any) =>
      sharp.resize(640, 360, {fit: 'inside', withoutEnlargement: true}).jpeg());
  } else {
    await createUpload(destinationBucket, id, null, uuidv4(), stream, 'webp', (sharp: any) =>
      sharp.jpeg({quality: 80}));
  }
  await file.delete();
  return id;
}
