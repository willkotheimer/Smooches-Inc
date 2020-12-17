import React from 'react';
import ServiceData from '../../helpers/data/serviceData';
import ToDoData from '../../helpers/data/todoData';
import ReviewTaskCard from '../Cards/ReviewTaskCard';
import Loader from '../Loader';
import getUid from '../../helpers/data/authData';

export default class ReviewTasks extends React.Component {
  state = {
    services: [],
    toDos: [],
    loading: true,
    show: true
  };

  componentDidMount() {
    this.setState({
      currentUserId: getUid()
    });
    this.getTodos();
    this.getServices();
    
  }

  getServices = () => {
    const UID = getUid();
    ServiceData.getAllServices().then(stuff => {
      this.setState(
        {
          services: stuff
        },
        this.setLoading
      );
    });
  };

  getTodos = () => ToDoData.getCompletedToDosByUid(this.props.otherKey).then((stuff) => {
      this.setState({
        toDos: stuff
      });
    });

  setLoading = () => {
    this.timer = setInterval(() => {
      this.setState({ loading: false });
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { services, loading, toDos } = this.state;
    const showUnreviewed = () => 
      Object.values(toDos).map(toDo => (
        <ReviewTaskCard key={toDo.firebaseKey} services={services} toDo={toDo} redrawDom={this.getServices} />
      ));
    return (
      <>
        {loading ? (
          <Loader />
        ) : (
          <>
           
            <div>Completed Tasks To Review:</div>
            <div className="d-flex flex-wrap container">
              {toDos && showUnreviewed()}
            </div>
          </>
        )}
      </>
    );
  }
}
