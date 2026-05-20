// 1. Create a Firebase project.
// 2. Enable Firestore Database, Storage, and Authentication with Email/Password.
// 3. Copy your web app config here.
// 4. Change enabled to true.

export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

export const firebaseOptions = {
  enabled: false,
  moviesCollection: "movies",
  storageFolder: "movie-posters"
};
