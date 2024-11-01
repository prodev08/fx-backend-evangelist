import * as http from 'http';

const options = {
  host: 'localhost',
  port: '8080',
  timeout: 2000,
};

const request = http.request(options, res => {
  if (res.statusCode === 200) {
    // eslint-disable-next-line no-process-exit
    process.exit(0);
  } else {
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
});
request.on('error', err => {
  // eslint-disable-next-line no-process-exit
  console.log('healthcheck error', err);
  process.exit(1);
});
request.end();
