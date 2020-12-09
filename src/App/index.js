import React from 'react';
import firebase from 'firebase/app';
import { BrowserRouter as Router } from 'react-router-dom';
import fbConnection from '../helpers/data/connection';
import Navbar from '../components/Navbar';
import Routes from '../helpers/routes';
import userData from '../helpers/data/userData';
import getUid from '../helpers/data/authData';

// patchFBBoardkeys();
// patchFBPinkeys();
fbConnection();

class App extends React.Component {
  state = {
    user: null,
    joinedUser: '',
    userKey: '',
    otherKey: '',
    otherName: '',
    currenUserId: ''
  };

  getYourJoinedUser = () => 
        userData.getJoinedUser(getUid()).then((response) => {
            this.setState({
                joinedUser: response[0],
            });

            if (this.state.joinedUser) {
              if (this.state.user.uid === response[0].user1FBKey) {
                this.setState({
                    userKey: response[0].user1FBKey,
                    otherKey: response[0].user2FBKey
                });
            } else {
                this.setState({
                    userKey: response[0].user2FBKey,
                    otherKey: response[0].user1FBKey
                });
            }
            userData.getUserByUid(this.state.otherKey)
                .then((value) => {
                    this.setState({
                        otherName: value
                    });
                });
            }
        });

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        userData.setCurrentUser(user);
        this.setState({ currenUserId: user.uid, user });
        this.getYourJoinedUser();
      } else {
        this.setState({ user: false });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    const { user, otherName, otherKey, userKey, joinedUser } = this.state;
    return (
      <div className="App">
        <Router>
          <Navbar user={user} />
          <Routes joinedUser={joinedUser} otherName={otherName} user={user} userKey={userKey} otherKey={otherKey} />
        </Router>
      </div>
    );
  }
}

export default App;
