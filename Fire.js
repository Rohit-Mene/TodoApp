import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCTcaEPCmVik-CyhXO04l2cBqBGnEsL8Z8",
  authDomain: "rntodoapp-726d2.firebaseapp.com",
  databaseURL: "https://rntodoapp-726d2.firebaseio.com",
  projectId: "rntodoapp-726d2",
  storageBucket: "rntodoapp-726d2.appspot.com",
  messagingSenderId: "250925703401",
  appId: "1:250925703401:web:b4a3fb00e70c5ac8b39078",
};

class Fire {
  constructor(callback) {
    this.init(callback);
  }
  init(callback) {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        callback(null, user);
      } else {
        firebase
          .auth()
          .signInAnonymously()
          .catch((error) => {
            callback(error);
          });
      }
    });
  }
  getLists(callback) {
    let ref = this.ref.orderBy("name");

    this.unsubscribe = ref.onSnapshot((snapshot) => {
      lists = [];
      snapshot.forEach((doc) => {
        lists.push({ id: doc.id, ...doc.data() });
      });
      callback(lists);
    });
  }

  addList(list) {
    let ref = this.ref;

    ref.add(list);
  }

  updateList(list) {
    let ref = this.ref;

    ref.doc(list.id).update(list);
  }
  get userId() {
    return firebase.auth().currentUser.uid;
  }
  get ref() {
    return firebase
      .firestore()
      .collection("users")
      .doc(this.userId)
      .collection("lists");
  }
  detach() {
    this.unsubscribe();
  }
}

export default Fire;
