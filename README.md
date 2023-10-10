This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

base64 memory:
- based on testing, each base64string is apprx. .525MB
- for a 1GB storage, that means 1900 docs


# Major issues
- have website with "PDF Summarizer" as lead magnet for app
- A/B test product page optimizations
- add locust to stress test flask endpoints
- implement memory
- option to get quick summary of note / notebook
- implement ability to upload pdf to become text note
- create "loading" text for each notebook screen
- Create iphone version of app

# Ongoing To-Dos
- test payments (Maybe start off giving everyone free access?)
- add ability to expand / minimize writing area
- clear up all react native warnings
- add memory to output text (can do this in an update, need to get a SQL instance on cloud to do this)


# Bugs

# Ideas
- optimize /create-chroma to only change instances where the user was active recently (since the last update)


# To start on physical ipad
- cd ios
- open notesAi.xcworkspace
- run on xcode UI


# Test cURL commands


curl -H 'Content-Type: application/json' \
      -d '{ "uid":"NmjO6WwswsbA5B8YTwFW8t1vzRw2", "query_string":"what do i do with java?", "notebook":"All"}' \
      -X POST \
     https://notesai-flask.onrender.com/query

curl -H 'Content-Type: application/json' \
      -d '{ "uid":"ZEkJK1yJjlXE6fk9XRocer3Ba1H2", "notebook_id":"58", "note": null, "note_id": null}' \
      -X POST \
     http://127.0.0.1:8000/summarize

curl -H 'Content-Type: application/json' \
      -d '{ "uid":"NmjO6WwswsbA5B8YTwFW8t1vzRw2"}' \
      -X POST \
     http://127.0.0.1:8000/create-chroma

curl -H 'Content-Type: application/json' \
      -d '{ "uid":"NmjO6WwswsbA5B8YTwFW8t1vzRw2"}' \
      -X POST \
     https://notesai-flask.onrender.com/create-chroma

curl -H 'Content-Type: application/json' \
      -d '{ "uid":"cWDMTEP1S2RN6Jbf7HHrndeZ4gU2","title":"1", "content": "1", "notebook":"New shit", "base64String":"1"}' \
      -X POST \
     https://notesai-flask.onrender.com/post

curl -H 'Content-Type: application/json' \
      -d '{ "uid":"NmjO6WwswsbA5B8YTwFW8t1vzRw2","notebook":"notebook againnn"}' \
      -X POST \
     http://127.0.0.1:8000/post-notebook

curl -H 'Content-Type: application/json' \
      -d '{ "uid":"cWDMTEP1S2RN6Jbf7HHrndeZ4gU2","notebook":"notebook shit again"}' \
      -X POST \
     https://notesai-flask.onrender.com/post-notebook

curl -H 'Content-Type: application/json' \
      -d '{ "uid":"cWDMTEP1S2RN6Jbf7HHrndeZ4gU2", "notebook":"doesnt exist", "title":"doesnt exist"}' \
      -X DELETE \
     https://notesai-flask.onrender.com/delete




curl -X DELETE "https://notesai-flask.onrender.com/delete?uid=cWDMTEP1S2RN6Jbf7HHrndeZ4gU2&notebook=doesnt%20exist&title=doesnt%20exist"

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
