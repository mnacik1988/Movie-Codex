// 1. Create a Firebase project.
// 2. Enable Firestore Database, Storage, and Authentication with Email/Password.
// 3. Copy your web app config here.
// 4. Change enabled to true.

export const firebaseConfig = {
  apiKey: "AIzaSyAumaD8KnKABjYrfCRB_MDIHKWGen4vEoM",
  authDomain: "movie-mood-6ea4c.firebaseapp.com",
  projectId: "movie-mood-6ea4c",
  storageBucket: "movie-mood-6ea4c.firebasestorage.app",
  messagingSenderId: "73836944599",
  appId: "1:73836944599:web:bac525f037786ec8236492",
};

export const firebaseOptions = {
  enabled: true,
  moviesCollection: "movies",
  storageFolder: "movie-posters"
};
