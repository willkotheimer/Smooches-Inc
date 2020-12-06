import React, { Component } from 'react';

export default class LinkAccountsPage extends Component {
  state = {
    user: this.props.user,
  }

  // To do:
  // - find out if user has a linked account... if so, remind them who they are 
  // linked to.
  // - if user doesn't have a linked account allow them to search for users by email
  // - Send a link request
  // -other user will receive notification on their dashboard and on the menu bar
  // Link request pending
  // Other user can approve or dismiss:
  // if approved will be added to userJoin table as connected.

  render() {
    return (
      <>
      <div className="LinkAccountsPage d-flex justify-content-center">
        Link Accounts Here
      </div> 
      </>
    );
  }
}