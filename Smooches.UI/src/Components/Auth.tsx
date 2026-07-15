import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import googleImage from './Sign-in-with-Google.png';

export default class Auth extends Component {
  loginClickEvent = (e: React.MouseEvent) => {
    e.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  };

  render() {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <p className="text-muted">Sign in to get started</p>
        <button
          onClick={this.loginClickEvent}
          className="rounded-card transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          <img src={googleImage} alt="Sign in with Google" />
        </button>
      </div>
    );
  }
}
