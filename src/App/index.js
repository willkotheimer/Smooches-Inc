import React from 'react';
import firebase from 'firebase/app';
import { BrowserRouter as Router } from 'react-router-dom';
import fbConnection from '../helpers/data/connection';
import Navbar from '../components/Navbar';
import Routes from '../helpers/routes';
import userData from '../helpers/data/userData';

// patchFBBoardkeys();
// patchFBPinkeys();
fbConnection();

class App extends React.Component {
  state = {
    user: null
  };

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        userData.setCurrentUser(user);
        this.setState({ user });
      } else {
        this.setState({ user: false });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    const { user } = this.state;
    return (
      <div className="App">
        <Router>
          <Navbar user={user} />
          <Routes user={user} />
        </Router>
      </div>
    );
  }
}

export default App;
