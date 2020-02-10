import firebase from "firebase/app";
import "firebase/firestore";
import { geofirestore, GeoPoint } from "@/firebase";

const db = firebase.firestore();

const locRef = process.env.VUE_APP_firestore_location_collection;
const ref = db.collection(locRef);
const geoRef = geofirestore.collection(locRef);

export default {
  getFilteredQuery(ref, queryData, filters) {
    /* 
    prepare firebase query based on required parameters - latlng coordinates, radius
    and filters (optional)
    */
    let query = ref;
    if (filters) {
      Object.keys(filters).forEach(i => {
        filters[i].forEach(q => {
          if (q) {
            query = query.where(`${i}`, "==", `${q}`);
          }
        });
      });
    }

    if (queryData) {
      if (queryData.center && queryData.radius) {
        const geoCenter = new GeoPoint(
          parseFloat(queryData.center[0]),
          parseFloat(queryData.center[1])
        );
        query = query.near({
          center: geoCenter,
          radius: parseFloat(queryData.radius)
        });
      }
    }
    return query;
  },
  prepareCollectionData(snapshot) {
    /* prepare retrieved data to use with GeoFirestore*/
    return snapshot.docs.map(doc => this.prepareDoc(doc));
  },
  prepareDoc(doc) {
    /* retrieve location firestore document id and distance and include in data object to use with GeoFirestore*/
    return {
      ...doc.data(),
      distance: doc.distance,
      id: doc.id
    };
  },
  prepareOrderedQuery(snapshot) {
    /* retrieve location firestore document id and distance and include in data object to use with Firebase.Firestore*/
    return snapshot.docs.map(doc => this.prepareOrderedDoc(doc));
  },
  prepareOrderedDoc(doc) {
    /* prepare retrieved data to use with Firestore */
    return {
      ...doc.data().d,
      distance: doc.distance,
      id: doc.id
    };
  }
};
