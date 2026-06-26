import firebase from 'firebase/app';
import 'firebase/auth';

const getUid = (): string => firebase.auth().currentUser!.uid;

export default getUid;
