# FX1 API-PUBLIC

FX1 API-Public is the official BE API provider for FX1 pips.

## Installation

Use the package manager [npm](https://www.npmjs.com) to install FX1 API-Public packages.

```bash
npm install
```

## Usage
1. Run `generate:nexus`
2. Before running `dev`, add the following environment variables.

## Environment Variables
Key | Value | Description
--- | --- | ---
MONGODB_URI | *Ask the developers* | MongoDB host and options to be used
APP_ENV | **Local/Develop/Staging**: <br />`develop` <br /><br /> **Production**: <br />`production` | Indicate the environment server is running in
PORT | *By default: `8080`* | Server port
GOOGLE_APPLICATION_CREDENTIALS_BE | *Ask the developers* | Service account in Base64
STORAGE_BUCKET_NAME | *Ask the developers* | Name of the Firebase bucket
BASE_URL | *Ask the developers* | URL of the APIs
SENDGRID_API_KEY | *Ask the developers* | SendGrid API Key
SENTRY_DSN | *Ask the developers* | Data Source Name assigned by Sentry to start monitoring events
MIXPANEL_TOKEN | *Ask the developers* | Mixpanel Project Token to track data

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
