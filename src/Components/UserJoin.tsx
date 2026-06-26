import React from 'react';
import userData from '../helpers/data/userData';
import LinkUserCard from './Cards/LinkUserCard';
import UserRequest from './Forms/UserRequest';
import Loader from './Loader';
import AppModal from './AppModal';
import type { User } from '../types';

interface Props {
  user?: any;
  otherName?: any;
  otherKey?: string;
  userKey?: string;
  joinedUser?: any;
}

interface State {
  currentUserId: any;
  joinedUser: any[];
  usersToConnect: User[];
  loading: boolean;
  show: boolean;
  userKey: string;
  otherKey: string;
  otherName: any;
}

export default class UserJoin extends React.Component<Props, State> {
  timer?: ReturnType<typeof setInterval>;

  state: State = {
    currentUserId: '',
    joinedUser: [],
    usersToConnect: [],
    loading: true,
    show: true,
    userKey: '',
    otherKey: '',
    otherName: this.props.otherName,
  };

  componentDidMount() {
    this.setState({
      currentUserId: this.props.user,
      otherName: this.props.otherName,
      otherKey: this.props.otherKey,
      userKey: this.props.userKey,
    });
    this.getUsersToConnect();
    this.setLoading();
  }

  getUsersToConnect = () => {
    userData.getAllUsers().then((response: any) => {
      const arr = Object.values(response.data as Record<string, User>).filter(
        (user) => user.uid !== this.state.currentUserId.uid,
      );
      this.setState({
        usersToConnect: arr,
      });
    });
  };

  setLoading = () => {
    this.timer = setInterval(() => {
      this.setState({ loading: false });
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { currentUserId, joinedUser, usersToConnect, loading } = this.state;

    const showJoinedUser = () => (
      <LinkUserCard
        key={this.props.otherKey}
        userKey={this.props.userKey}
        otherKey={this.props.otherKey}
        user={currentUserId}
        otherName={this.props.otherName}
        joinedUser={this.props.joinedUser}
      />
    );

    return (
      <>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="d-flex flex-wrap container">
              {(this.props.joinedUser && showJoinedUser()) || (
                <AppModal title={'Link User'} buttonLabel={'Link User'}>
                  {usersToConnect ? (
                    <UserRequest usersToConnect={usersToConnect} joinedUser={joinedUser} />
                  ) : (
                    'There are not any users to connect with'
                  )}
                </AppModal>
              )}
            </div>
          </>
        )}
      </>
    );
  }
}
