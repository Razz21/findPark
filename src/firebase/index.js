import firebase from "firebase/app";
import "firebase/firestore";

import { GeoFirestore } from "geofirestore";

const config = {
  apiKey: process.env.VUE_APP_apiKey,
  authDomain: process.env.VUE_APP_authDomain,
  projectId: process.env.VUE_APP_projectId
};

firebase.initializeApp(config);

const { Timestamp, GeoPoint } = firebase.firestore;
const firestore = firebase.firestore();

const geofirestore = new GeoFirestore(firestore);
export { Timestamp, GeoPoint, geofirestore };
