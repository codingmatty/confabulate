import { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firebase-auth';

export default function useFirebase() {
  useEffect(() => {
    if (firebase.apps.length === 0) {
      firebase.initializeApp({
        projectId: process.env.FIREBASE_PROJECTID,
        authDomain: process.env.FIREBASE_AUTHDOMAIN,
        apiKey: process.env.FIREBASE_CLIENT_APIKEY
      });
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
    }
  }, []);

  return firebase;
}
