import firebase from 'firebase';
import 'firebase/auth';

const getUid = () => firebase.auth().currentUser.uid;

export default getUid;
