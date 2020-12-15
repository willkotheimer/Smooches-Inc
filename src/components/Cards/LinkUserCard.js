import React from 'react';
import userData from '../../helpers/data/userData';

export default class LinkUserCard extends React.Component {
  state = {
    user: this.props.user,
    otherName: this.props.otherName,
    otherKey: this.props.otherKey,
    userKey: this.props.userKey,
    joinedUser: this.props.joinedUser
  }
 
  rejectUser = () => {
    userData.deleteUserConnect(this.state.joinedUser.firebaseKey);
    this.setState({
      joinedUser: null
    });
    console.warn('reject');
  }

  connectToUser = () => {
    userData.confirmUserJoin(this.state.joinedUser);
    const joined = this.state.joinedUser;
    joined.confirm = true;
    this.setState({
      joinedUser: joined
    });
    console.warn('connect');
  }

  render() {
    const { otherName, joinedUser, user } = this.state;
  return (<>
    <div className="card m-2">
      <div className="card-body">
      <h5 className="card-title">{otherName[0][1].name} 
      {joinedUser && (joinedUser.confirm) ? ' is connected' : ' is pending...'}.</h5>
      <div>{(joinedUser && (joinedUser.user2FBKey === user.uid) && (!joinedUser.confirm)) ? (
      <>
      <button onClick={this.connectToUser} className='btn btn-danger'>Connect</button>
      <button onClick={this.rejectUser} className='btn btn-danger'>Reject</button>
      </>
      ) : (joinedUser && (joinedUser.confirm) && 'congrats!')}</div>
      </div>
    </div>
    </>
  );
      }

}
