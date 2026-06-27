import { useEffect, useMemo } from 'react';
import Rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/database';
import { useQueryClient } from '@tanstack/react-query';
import RequestCard from './Cards/RequestCard';
import ToDosCard from './Cards/ToDosCard';
import TheirPreviousReviews from './TheirPreviousReviews';
import OrderHistory from './Cards/OrderHistory';
import Card from '../ui/Card';
import SectionHeading from '../ui/SectionHeading';
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
    <div>
      <SectionHeading icon="fa-solid fa-bell">Services Needing Your Attention</SectionHeading>
      {todos.length ? showToDos() : <p className="text-sm text-muted">Nothing right now.</p>}

      <SectionHeading icon="fa-solid fa-list-check">Services Requested By You</SectionHeading>
      {requested.length ? showRequests() : <p className="text-sm text-muted">No requests yet.</p>}

      <SectionHeading icon="fa-solid fa-heart">Reviews Given To You</SectionHeading>
      {theirReviews && theirReviews.length ? (
        theirPreviousReviews()
      ) : (
        <p className="text-sm text-muted">No reviews yet.</p>
      )}

      <SectionHeading icon="fa-solid fa-chart-simple">Your Stats</SectionHeading>
      <Card>
        <p className="text-sm">
          Finished tasks: <span className="font-bold">{doneTodos}</span>
        </p>
        <p className="text-sm text-muted">
          Completion rate: {((avgDoneToDos as number) * 100).toFixed(2)}%
        </p>
        {userToDosCount && userToDosCount.length > 0 && (
          <div className="mt-2">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
              Order history
            </p>
            {showUserRequests()}
          </div>
        )}
      </Card>
    </div>
  );
}
