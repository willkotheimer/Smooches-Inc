import React, { Component } from 'react';
import UserJoin from '../components/UserJoin';

interface Props {
  user?: any;
  otherName?: any;
  otherKey?: string;
  userKey?: string;
  joinedUser?: any;
}

interface State {
  user: any;
  otherName: any;
  otherKey?: string;
  userKey?: string;
  joinedUser: any;
}

export default class LinkAccountsPage extends Component<Props, State> {
  state: State = {
    user: this.props.user,
    otherName: this.props.otherName,
    otherKey: this.props.otherKey,
    userKey: this.props.userKey,
    joinedUser: this.props.joinedUser,
  };

  render() {
    const { user } = this.state;
    return (
      <>
        <div className="linkedAccountsPage d-flex justify-content-center">
          <div className="leftSide">
            <div>
              <h3>User Connections:</h3>
              {
                <UserJoin
                  user={user}
                  userKey={this.props.userKey}
                  otherKey={this.props.otherKey}
                  joinedUser={this.props.joinedUser}
                  otherName={this.props.otherName}
                />
              }
            </div>
          </div>
        </div>
      </>
    );
  }
}
