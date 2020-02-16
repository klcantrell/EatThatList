import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAPkyMJpeZhgil9LCtTBoz7JMOimpF2764',
  authDomain: 'eatthatlist.firebaseapp.com',
  databaseURL: 'https://eatthatlist.firebaseio.com',
  projectId: 'eatthatlist',
  storageBucket: 'eatthatlist.appspot.com',
  messagingSenderId: '927915290820',
  appId: '1:927915290820:web:5d41e7c65597efe80ad991',
};

const setupFirebase = () => firebase.initializeApp(firebaseConfig);

export { setupFirebase };
