// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDzNV3pXn_PGcgBTIvzyD1nVOU5bmNA-TE",
  authDomain: "tourvir-fd341.firebaseapp.com",
  databaseURL: "https://tourvir-fd341-default-rtdb.firebaseio.com",
  projectId: "tourvir-fd341",
  storageBucket: "tourvir-fd341.firebasestorage.app",
  messagingSenderId: "965264976790",
  appId: "1:965264976790:web:fc0f626f87251d4eee4bb7",
  measurementId: "G-C9PRZ1G4Y5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();

// Optional: Analytics
// firebase.analytics();
