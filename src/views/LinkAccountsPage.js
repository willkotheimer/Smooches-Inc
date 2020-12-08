import React, { Component } from 'react';
import UserJoin from '../components/UserJoin';

export default class LinkAccountsPage extends Component {
  state = {
    user: this.props.user,
    otherName: this.props.otherName,
    otherKey: this.props.otherKey,
    userKey: this.props.userKey,
    joinedUser: this.props.joinedUser
  }

  // To do:
  // - find out if user has a linked account... if so, remind them who they are 
  // linked to. Otherwise simply say: No linked users

  // -other user will receive notification on their dashboard and on the menu bar
  // Link request pending
  // Other user can approve or dismiss:
  // if approved will be added to userJoin table as connected.

  // If dismissed, userJoin entry will be withdrawn. If approved, userJoin confirmed

  // - Stretch Goal: if user doesn't have a linked account allow them to search for users by email
  
  

  render() {
    const { user } = this.state;
    return (
      <>
      <div className="linkedAccountsPage d-flex justify-content-center">
        <div className="leftSide">
          <div>
            <h2>User Connections:</h2>
            {<UserJoin user={user} userKey={this.props.userKey} otherKey={this.props.otherKey} joinedUser={this.props.joinedUser} otherName={this.props.otherName} />}
            
          </div>
        </div>
      </div> 
      </>
    );
  }
}