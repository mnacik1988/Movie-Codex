import { firebaseConfig, firebaseOptions } from "./firebase-config.js";

const SDK_VERSION = "10.12.5";
let firebaseApp = null;
let firebaseAuth = null;
let firebaseDb = null;
let firebaseStorage = null;
let firestoreApi = null;
let storageApi = null;
let authApi = null;

export function isFirebaseEnabled() {
  return Boolean(firebaseOptions.enabled && firebaseConfig.apiKey && firebaseConfig.projectId);
}

async function loadFirebase() {
  if (!isFirebaseEnabled()) return null;
  if (firebaseApp) {
    return { app: firebaseApp, auth: firebaseAuth, db: firebaseDb, storage: firebaseStorage };
  }

  const [appModule, authModule, firestoreModule, storageModule] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-firestore.js`),
    import(`https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-storage.js`)
  ]);

  firestoreApi = firestoreModule;
  storageApi = storageModule;
  authApi = authModule;
  firebaseApp = appModule.initializeApp(firebaseConfig);
  firebaseAuth = authModule.getAuth(firebaseApp);
  firebaseDb = firestoreModule.getFirestore(firebaseApp);
  firebaseStorage = storageModule.getStorage(firebaseApp);

  return { app: firebaseApp, auth: firebaseAuth, db: firebaseDb, storage: firebaseStorage };
}

function normalizeMovie(id, data) {
  return {
    id,
    title: data.title || "Без названия",
    year: Number(data.year) || new Date().getFullYear(),
    time: data.time || "120 мин",
    rating: Number(data.rating) || 0,
    genres: Array.isArray(data.genres) ? data.genres : [],
    poster: data.poster || "",
    backdrop: data.backdrop || data.poster || "",
    description: data.description || "",
    reviews: Array.isArray(data.reviews) ? data.reviews : [],
    trailerId: data.trailerId || "",
    moods: Array.isArray(data.moods) ? data.moods : [],
    collections: Array.isArray(data.collections) ? data.collections : [],
    adminPick: data.adminPick || "",
    sort: Number(data.sort) || 0,
    placements: {
      home: data.placements?.home !== false,
      recommended: Boolean(data.placements?.recommended),
      genres: data.placements?.genres !== false,
      random: data.placements?.random !== false
    }
  };
}

export async function getMovies() {
  const runtime = await loadFirebase();
  if (!runtime) return [];
  const { collection, getDocs, orderBy, query } = firestoreApi;
  const moviesRef = collection(runtime.db, firebaseOptions.moviesCollection);
  const snapshot = await getDocs(query(moviesRef, orderBy("sort", "asc")));
  return snapshot.docs.map((doc) => normalizeMovie(doc.id, doc.data()));
}

export async function listenMovies(onMovies, onError) {
  const runtime = await loadFirebase();
  if (!runtime) return null;
  const { collection, onSnapshot, orderBy, query } = firestoreApi;
  const moviesRef = collection(runtime.db, firebaseOptions.moviesCollection);
  const moviesQuery = query(moviesRef, orderBy("sort", "asc"));
  return onSnapshot(
    moviesQuery,
    (snapshot) => onMovies(snapshot.docs.map((doc) => normalizeMovie(doc.id, doc.data()))),
    onError
  );
}

export async function saveMovie(movie) {
  const runtime = await loadFirebase();
  if (!runtime) throw new Error("Firebase is not enabled.");
  const { doc, serverTimestamp, setDoc } = firestoreApi;
  const id = movie.id || `movie-${Date.now()}`;
  await setDoc(doc(runtime.db, firebaseOptions.moviesCollection, id), {
    ...movie,
    id,
    updatedAt: serverTimestamp()
  }, { merge: true });
  return id;
}

export async function deleteMovie(id) {
  const runtime = await loadFirebase();
  if (!runtime) throw new Error("Firebase is not enabled.");
  const { deleteDoc, doc } = firestoreApi;
  await deleteDoc(doc(runtime.db, firebaseOptions.moviesCollection, id));
}

export async function signInAdmin(email, password) {
  const runtime = await loadFirebase();
  if (!runtime) throw new Error("Firebase is not enabled.");
  const { signInWithEmailAndPassword } = authApi;
  return signInWithEmailAndPassword(runtime.auth, email, password);
}

export async function signOutAdmin() {
  const runtime = await loadFirebase();
  if (!runtime) return;
  const { signOut } = authApi;
  await signOut(runtime.auth);
}

export async function uploadImage(file, namePrefix = "poster") {
  const runtime = await loadFirebase();
  if (!runtime) throw new Error("Firebase is not enabled.");
  const safeName = file.name.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
  const path = `${firebaseOptions.storageFolder}/${namePrefix}-${Date.now()}-${safeName}`;
  const fileRef = storageApi.ref(runtime.storage, path);
  await storageApi.uploadBytes(fileRef, file);
  return storageApi.getDownloadURL(fileRef);
}
