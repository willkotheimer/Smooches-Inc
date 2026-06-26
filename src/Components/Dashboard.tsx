import { useEffect, useMemo, useState } from 'react';
import Rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/database';
import RequestCard from './Cards/RequestCard';
import ToDosCard from './Cards/ToDosCard';
import ServiceData from '../helpers/data/serviceData';
import ToDoData from '../helpers/data/todoData';
import ReviewData from '../helpers/data/reviewData';
import TheirPreviousReviews from './TheirPreviousReviews';
import LeaderBoardData from '../helpers/data/leaderboardData';
import OrderHistory from './Cards/OrderHistory';
import { useAppContext } from '../context/AppContext';
import type { Review, Service, ToDo } from '../types';

export default function Dashboard() {
  const { user, userKey, otherKey, otherName } = useAppContext();

  const [services, setServices] = useState<Service[]>([]);
  const [todos, setTodos] = useState<ToDo[]>([]);
  const [requested, setRequested] = useState<ToDo[]>([]);
  const [doneTodos, setDoneTodos] = useState<number | null>(null);
  const [avgDoneToDos, setAvgDoneToDos] = useState<number | null>(null);
  const [userToDosCount, setUserToDosCount] = useState<[string, number][]>([]);
  const [theirReviews, setTheirReviews] = useState<Review[] | undefined>(undefined);

  // Derived from the partner record; recomputed only when otherName changes.
  const partnerName = useMemo(() => (otherName ? otherName[0][1].name : ''), [otherName]);

  const getServices = () => ServiceData.getAllServices().then((s) => setServices(s));

  const getTodos = () =>
    ToDoData.getUserToDosArrayByUid(userKey).then((toDos) => setRequested(toDos));

  const getotheruserrequests = () =>
    ToDoData.getUserToDosArrayByUid(otherKey).then((toDos) => setTodos(toDos));

  const getReviews = () => {
    ReviewData.getAllReviews().then((stuff) => {
      const theirs: Review[] = [];
      Object.values(stuff).forEach((item) => {
        if (item.uid !== (user as any)?.uid && (user as any)?.uid !== undefined) {
          theirs.push(item);
        }
      });
      if (theirs.length) {
        setTheirReviews(theirs);
      }
    });
  };

  const getUserRequests = () =>
    ToDoData.getUserToDosCountArrayByUid(userKey).then((data) => setUserToDosCount(data));

  const getLeaderBoardInfo = () =>
    LeaderBoardData.getTaskLeaderBoards(userKey).then((array) => {
      setDoneTodos(array.numberToDos);
      setAvgDoneToDos(array.avgToDos);
    });

  const completeTask = (firebaseKey: string, time: string | Date) => {
    ToDoData.completeTask(firebaseKey, time).then(() => getTodos());
  };

  const hideTask = (firebaseKey: string) => {
    ToDoData.hideTask(firebaseKey).then(() => getTodos());
  };

  const hideRequest = (firebaseKey: string) => {
    ToDoData.hideTask(firebaseKey).then(() => getotheruserrequests());
  };

  const getTask = (firebaseKey: string) => services.filter((x) => x.firebaseKey === firebaseKey);

  // Initial fetches + realtime listeners. A subscription with cleanup, so
  // useEffect is genuinely needed. Re-runs if the user/partner keys change.
  useEffect(() => {
    getServices();
    getTodos();
    getReviews();
    getotheruserrequests();
    getLeaderBoardInfo();
    getUserRequests();

    const base = Rebase.createClass(firebase.database());
    const todoRef = base.listenTo('todo', {
      context: {},
      asArray: true,
      then() {
        getTodos();
        getUserRequests();
        getotheruserrequests();
      },
    });
    const reviewRef = base.listenTo('review', {
      context: {},
      asArray: true,
      then() {
        getReviews();
      },
    });

    return () => {
      base.removeBinding(todoRef);
      base.removeBinding(reviewRef);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userKey, otherKey]);

  const theirPreviousReviews = () =>
    theirReviews!
      .slice(Math.max(theirReviews!.length - 5, 1))
      .reverse()
      .map((review) => (
        <TheirPreviousReviews
          key={review.firebaseKey}
          previousReview={review}
          service={review.serviceid}
          otherName={partnerName}
        />
      ));

  const showUserRequests = () =>
    userToDosCount.map((toDo, index) => (
      <OrderHistory key={index} toDo={toDo} services={services} />
    ));

  const showRequests = () =>
    todos
      .filter((service) => service.hidden !== true)
      .map((service) => (
        <RequestCard
          key={service.firebaseKey + Date.now()}
          service={service}
          hideRequest={hideRequest}
          task={getTask(service.taskId)}
        />
      ));

  const showToDos = () =>
    requested
      .filter((service) => service.hidden !== true)
      .map((service) => (
        <ToDosCard
          key={service.firebaseKey + Date.now()}
          firebaseKey={service.firebaseKey}
          service={service}
          completeTask={completeTask}
          hideTask={hideTask}
          otherName={otherName}
          task={getTask(service.taskId)}
        />
      ));

  return (
    <>
      <div className="servicePage">
        <div className="leftSide">
          <div className="tasksToComplete">
            <h3 className="taskHeader">Services Needing Your Attention:</h3>
            {todos && showToDos()}
          </div>
          <div className="requestLeftDiv">
            <h3 className="requestHeader">Services Requested By You:</h3>
            {requested && showRequests()}
          </div>
        </div>
        <div className="rightSide">
          <div className="reviewsGivenToYouDiv">
            <h3 className="reviewHeader">Reviews Given To You:</h3>
            {theirReviews && theirPreviousReviews()}
          </div>
          <div className="servicesData">
            <div className="card-body">
              <h5 className="card-title">Tasks Data</h5>
              <p className="card-text">Finished Tasks: {doneTodos}</p>
              <p className="card-text">Percent done: {((avgDoneToDos as number) * 100).toFixed(2)}%</p>
              <div>
                <h1>other user requests</h1>
                {userToDosCount && showUserRequests()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
