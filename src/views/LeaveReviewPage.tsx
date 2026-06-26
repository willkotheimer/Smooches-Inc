import { useEffect, useMemo } from 'react';
import Rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/database';
import { useQueryClient } from '@tanstack/react-query';
import ReviewTaskCard from '../Components/Cards/ReviewTaskCard';
import Loader from '../Components/Loader';
import YourPreviousReviews from '../Components/YourPreviousReviews';
import TheirPreviousReviews from '../Components/TheirPreviousReviews';
import { useAppContext } from '../context/AppContext';
import { useAllReviews } from '../data/useReviewData';
import { useAllServices } from '../data/useServiceData';
import { useCompletedUnreviewed } from '../data/useTodoData';
import type { Review } from '../types';

export default function LeaveReviewPage() {
  const { user, otherKey, joinedUserName } = useAppContext();
  const queryClient = useQueryClient();

  const { data: reviews = {}, isLoading: reviewsLoading } = useAllReviews();
  const { data: services = [], isLoading: servicesLoading } = useAllServices();
  const { data: toDos = [] } = useCompletedUnreviewed(otherKey);

  const loading = reviewsLoading || servicesLoading;

  // Split reviews into yours/theirs; recomputed only when reviews/user change.
  const { yourReviews, theirReviews } = useMemo(() => {
    const yours: Review[] = [];
    const theirs: Review[] = [];
    Object.values(reviews).forEach((item) => {
      if (item.uid === (user as any)?.uid && (user as any)?.uid !== undefined) {
        yours.push(item);
      } else {
        theirs.push(item);
      }
    });
    return { yourReviews: yours, theirReviews: theirs };
  }, [reviews, user]);

  // Realtime review listener is a subscription, so useEffect is needed. On a
  // change it just invalidates the queries and lets React Query refetch.
  useEffect(() => {
    const base = Rebase.createClass(firebase.database());
    const reviewRef = base.listenTo('review', {
      context: {},
      asArray: true,
      then() {
        queryClient.invalidateQueries(['reviews']);
        queryClient.invalidateQueries(['completedUnreviewed']);
      },
    });
    return () => base.removeBinding(reviewRef);
  }, [queryClient]);

  const redrawDom = () => {
    queryClient.invalidateQueries(['reviews']);
    queryClient.invalidateQueries(['completedUnreviewed']);
  };

  const yourPreviousReviews = () =>
    yourReviews
      .slice(Math.max(yourReviews.length - 5, 1))
      .reverse()
      .map((review) => (
        <YourPreviousReviews
          key={review.firebaseKey}
          previousReview={review}
          service={review.serviceid}
          otherName={joinedUserName as string}
        />
      ));

  const theirPreviousReviews = () =>
    theirReviews
      .slice(Math.max(theirReviews.length - 5, 1))
      .reverse()
      .map((review) => (
        <TheirPreviousReviews
          key={review.firebaseKey}
          previousReview={review}
          service={review.serviceid}
          otherName={joinedUserName as string}
        />
      ));

  const showUnreviewed = () =>
    Object.values(toDos)
      // FIXME: ToDo has no `reviewed` field (it uses `reviewId`); this filter is
      // always true. Preserved from the original JS.
      .filter((x) => (x as any).reviewed !== true)
      .map((toDo) => (
        <ReviewTaskCard key={toDo.firebaseKey} services={services} toDo={toDo} onUpdate={redrawDom} />
      ));

  return (
    <>
      <div className="servicePage">
        <div className="leftSide">
          <div className="reviewsToGiveDiv">
            <>
              {loading ? (
                <Loader />
              ) : (
                <>
                  <h3 className="reviewHeader">Completed Tasks To Review:</h3>
                  <div className="d-flex flex-wrap">{toDos && showUnreviewed()}</div>
                </>
              )}
            </>
          </div>
        </div>
        <div className="rightSide">
          <div className="previousReviewsGivenDiv">
            <h4>Previous Reviews Given</h4>
            <div className="fullLine"></div>
            {yourReviews && yourPreviousReviews()}
          </div>
          <div className="reviewsGivenToYouDiv">
            <h4>Reviews Given To You</h4>
            <div className="fullLine"></div>
            {theirReviews !== undefined && theirPreviousReviews()}
          </div>
        </div>
      </div>
    </>
  );
}
