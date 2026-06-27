// Express API endpoint strings (relative to VITE_API_BASE_URL). Records are
// addressed by `firebaseKey`, which the server uses as the document _id.
export const apiRoutes = {
  services: '/services',
  service: (key: string) => `/services/${key}`,
  servicesByUid: (uid: string) => `/services?uid=${uid}`,

  todos: '/todos',
  todo: (key: string) => `/todos/${key}`,
  todosByUid: (uid: string) => `/todos?uid=${uid}`,

  reviews: '/reviews',
  review: (key: string) => `/reviews/${key}`,

  users: '/users',
  user: (key: string) => `/users/${key}`,
  usersByUid: (uid: string) => `/users?uid=${uid}`,

  userJoins: '/userjoins',
  userJoin: (key: string) => `/userjoins/${key}`,
  userJoinsByUid: (uid: string) => `/userjoins?uid=${uid}`,
};
