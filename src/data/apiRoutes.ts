// Centralized Firebase REST endpoint strings (all paths end in `.json`).
export const apiRoutes = {
  services: '/services.json',
  service: (key: string) => `/services/${key}.json`,
  servicesByUid: (uid: string) => `/services.json?orderBy="uid"&equalTo="${uid}"`,

  todos: '/todo.json',
  todo: (key: string) => `/todo/${key}.json`,
  todosByUid: (uid: string) => `/todo.json?orderBy="uid"&equalTo="${uid}"`,

  reviews: '/review.json',
  review: (key: string) => `/review/${key}.json`,

  users: '/users.json',
  user: (key: string) => `/users/${key}.json`,
  usersByUid: (uid: string) => `/users.json?orderBy="uid"&equalTo="${uid}"`,

  userJoins: '/userjoin.json',
  userJoin: (key: string) => `/userjoin/${key}.json`,
};
