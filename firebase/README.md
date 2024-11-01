# FX1 FIREBASE

FX1 Firebase is the official BE Firebase project for FX1 pips.

## Installation

Use the package manager [npm](https://www.npmjs.com) to install FX1 Firebase packages.

```bash
npm install
```

## Usage
1. Run `npm install -g firebase-tools` to install Firebase CLI.
2. Run `firebase login` to login in Firebase.
   1. Optional: Run `firebase login:list` to verify logged-in email.
    
### Testing
1. Run `changeToDev` or `changeToStaging` to change environment.
2. Run `dev` to test firebase functions, storage etc.

### Deployment
1. Run `lint` to check if there are codes that violated linting rules.
2. If there are, run `fix`.
3. Run `changeToDev` or `changeToStaging` to change environment.
4. Run `deploy` to deploy (duh haha).

### Useful Firebase Commands
1. `firebase --help` display help information
2. `firebase apps:list` list the registered apps of a Firebase project.
3. `firebase functions:list` list all deployed functions in your Firebase project
4. `firebase projects:list` list all Firebase projects you have access to
5. `firebase use` display active project
6. `firebase use --add` define a new project alias

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
