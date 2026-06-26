import { useEffect, useMemo } from 'react';
import Rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/database';
import { useQueryClient } from '@tanstack/react-query';
import RequestCard from './Cards/RequestCard';
import ToDosCard from './Cards/ToDosCard';
import TheirPreviousReviews from './TheirPreviousReviews';
import OrderHistory from './Cards/OrderHistory';
import { useAppContext } from '../context/AppContext';
import { useAllServices } from '../data/useServiceData';
import { useCompleteTask, useHideTask, useTodoCounts, useUserTodos } from '../data/useTodoData';
import { useAllReviews } from '../data/useReviewData';
import { useTaskLeaderboard } from '../data/useLeaderboardData';

export default function Dashboard() {
  const { user, userKey, otherKey, otherName } = useAppContext();
  const queryClient = useQueryClient();

  const { data: services = [] } = useAllServices();
  const { data: requested = [] } = useUserTodos(userKey);
  const { data: todos = [] } = useUserTodos(otherKey);
  const { data: reviews = {} } = useAllReviews();
  const { data: userToDosCount = [] } = useTodoCounts(userKey);
  const { data: leaderboard } = useTaskLeaderboard(userKey);

  const completeTaskMutation = useCompleteTask();
  const hideTaskMutation = useHideTask();

  // Derived values — recomputed only when their inputs change.
  const partnerName = useMemo(() => (otherName ? otherName[0][1].name : ''), [otherName]);
  const theirReviews = useMemo(
    () =>
      Object.values(reviews).filter(
        (item) => item.uid !== (user as any)?.uid && (user as any)?.uid !== undefined,
      ),
    [reviews, user],
  );

  const doneTodos = leaderboard?.numberToDos ?? null;
  const avgDoneToDos = leaderboard?.avgToDos ?? null;

  // re-base realtime listeners are subscriptions, so useEffect is needed. On a
  // change they invalidate the relevant queries and React Query refetches.
  useEffect(() => {
    const base = Rebase.createClass(firebase.database());
    const todoRef = base.listenTo('todo', {
      context: {},
      asArray: true,
      then() {
        queryClient.invalidateQueries(['todos']);
        queryClient.invalidateQueries(['todoCounts']);
        queryClient.invalidateQueries(['taskLeaderboard']);
      },
    });
    const reviewRef = base.listenTo('review', {
      context: {},
      asArray: true,
      then() {
        queryClient.invalidateQueries(['reviews']);
      },
    });
    return () => {
      base.removeBinding(todoRef);
      base.removeBinding(reviewRef);
    };
  }, [queryClient]);

  const completeTask = (firebaseKey: string, time: string | Date) =>
    completeTaskMutation.mutate({ firebaseKey, time });

  const hideTask = (firebaseKey: string) => hideTaskMutation.mutate(firebaseKey);

  const getTask = (firebaseKey: string) => services.filter((x) => x.firebaseKey === firebaseKey);

  const theirPreviousReviews = () =>
    theirReviews
      .slice(Math.max(theirReviews.length - 5, 1))
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
          hideRequest={hideTask}
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
