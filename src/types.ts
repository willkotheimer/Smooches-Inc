// Shared data models, derived from the Firebase Realtime Database export.
// The `uid` field is the Firebase Auth UID and is the real cross-entity join key;
// `firebaseKey` is the push-id of the record's own node.

export interface User {
  firebaseKey: string;
  uid: string;
  name: string;
  email: string;
  image: string;
  lastSignInTime: string;
}

export interface Service {
  firebaseKey: string;
  uid: string;
  name: string;
  description: string;
  offerDescription: string;
  active?: boolean; // offered to the partner when true
  source?: 'custom' | 'preset'; // custom = user-created (deletable)
}

export interface ToDo {
  firebaseKey: string;
  uid: string;
  taskId: string;
  requesterId: string;
  requestedTime: string;
  completedTime: string;
  reviewId: string;
  status: string;
  hidden?: boolean;
}

export interface Review {
  firebaseKey: string;
  uid: string;
  serviceid: string;
  toDoid: string;
  reviewStars: string;
  reviewText: string;
  // Legacy data mixes epoch-millis numbers and human-readable date strings.
  dateTime: string | number;
}

export interface UserJoin {
  firebaseKey: string;
  user1FBKey: string;
  user2FBKey: string;
  confirm: boolean;
}
