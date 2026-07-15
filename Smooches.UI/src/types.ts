// Shared data models, derived from the Firebase Realtime Database export.
// The `uid` field is the Firebase Auth UID and is the real cross-entity join key.
// Each record's own push-id is exposed per entity as `<entity>Key`
// (e.g. `servicesKey`), which the server uses as the document _id.

export interface User {
  usersKey: string;
  uid: string;
  name: string;
  email: string;
  image: string;
  lastSignInTime: string;
}

export interface Service {
  servicesKey: string;
  uid: string;
  name: string;
  description: string;
  offerDescription: string;
  active?: boolean; // offered to the partner when true
  source?: 'custom' | 'preset'; // custom = user-created (deletable)
}

export interface ToDo {
  todosKey: string;
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
  reviewsKey: string;
  uid: string;
  serviceid: string;
  toDoid: string;
  reviewStars: string;
  reviewText: string;
  // Legacy data mixes epoch-millis numbers and human-readable date strings.
  dateTime: string | number;
}

export interface UserJoin {
  userJoinsKey: string;
  user1FBKey: string;
  user2FBKey: string;
  confirm: boolean;
}
