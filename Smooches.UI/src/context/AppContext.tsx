import { createContext, useContext } from 'react';
import firebase from 'firebase/app';

/**
 * Global, app-wide user/partner state that used to be threaded as props through
 * Routes -> views -> components. Consumed via useAppContext() instead.
 */
export interface AppContextValue {
  user: firebase.User | false | null;
  userKey: string;
  otherKey: string;
  otherName: any;
  joinedUser: any;
  joinedUserName: string;
}

export const defaultAppContext: AppContextValue = {
  user: null,
  userKey: '',
  otherKey: '',
  otherName: '',
  joinedUser: '',
  joinedUserName: '',
};

export const AppContext = createContext<AppContextValue>(defaultAppContext);

export const useAppContext = (): AppContextValue => useContext(AppContext);
