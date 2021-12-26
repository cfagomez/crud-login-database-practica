import firebase from "firebase/app";
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAWSBbtgTIStewI-jnZtLWTFZ3plXRdyMI",
    authDomain: "crud-udemy-practica.firebaseapp.com",
    projectId: "crud-udemy-practica",
    storageBucket: "crud-udemy-practica.appspot.com",
    messagingSenderId: "1037411078553",
    appId: "1:1037411078553:web:2a33ec2d611cc0a8dc4308"
  };

firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()
const auth = firebase.auth()

export {db, auth}