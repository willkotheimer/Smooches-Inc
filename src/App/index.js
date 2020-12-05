import React from 'react';
import firebase from 'firebase/app';
import fbConnection from '../helpers/data/connection';
import Auth from '../components/Auth';
import MyNavbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';

fbConnection();

class App extends React.Component {
  state = {
    authed: false,
  };

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ authed: true });
      } else {
        this.setState({ authed: false });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    const { authed } = this.state;
    const loadComponent = () => {
      let component = '';
      if (authed) {
        component = <Dashboard />;
      } else {
        component = <Auth />;
      }
      return component;
    };

    return (
      <div className="App">
        <MyNavbar authed={authed} />
        {loadComponent()}
      </div>
    );
  }
}

export default App;
