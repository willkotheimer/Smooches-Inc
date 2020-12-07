import React from 'react';
import userData from '../../helpers/data/userData';
import LinkUserCard from '../Cards/LinkUserCard';
import UserRequest from '../Forms/UserRequest';
import Loader from '../Loader';
import getUid from '../../helpers/data/authData';
import AppModal from '../AppModal';

export default class UserJoin extends React.Component {
    state = {
        currentUserId: '',
        joinedUser: [],
        usersToConnect: [],
        loading: true,
        show: true,
        userKey: '',
        otherKey: '',
        otherName: ''
    }

    componentDidMount() {
        this.setState({
            currentUserId: getUid()
        });
        this.getUsersToConnect();
    }

    // Need to try to move these up to the root of the page:
    
    getYourJoinedUser = () => 
        userData.getJoinedUser(getUid()).then((response) => {
            this.setState({
                joinedUser: response[0],
            });
            if (this.state.currentUserId === response[0].user1FBKey) {
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
            this.setLoading();
        });
    
    getUsersToConnect = () => {
        userData.getAllUsers().then((response) => {
            const arr = Object.values(response.data).filter(user => user.uid !== this.state.currentUserId) 
            this.setState({
                usersToConnect: arr,
            })
        });
    }

    setLoading = () => {
        this.timer = setInterval(() => {
            this.setState({ loading: false });
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        this.getYourJoinedUser();
        const { otherName, otherKey, currentUserId, joinedUser, usersToConnect, loading } = this.state;

        const showJoinedUser = () => (
            <LinkUserCard key={otherKey} user={currentUserId} 
            connectedUser={ otherName } />
        );
         
        return (
            <>
                {loading ? (
                    <Loader />
                ) : (
                  <>
                  <AppModal title={'Link User'} buttonLabel={'Link User'}>
                    {usersToConnect ? <UserRequest usersToConnect={usersToConnect} joinedUser={joinedUser}/> : ('There are not any users to connect with')}
                  </AppModal>
                  <div className="d-flex flex-wrap container">
            
                      { joinedUser && showJoinedUser() }
                  </div>
                  </>
                )}
            </>
        )
    }
}

