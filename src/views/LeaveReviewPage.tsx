import { useEffect, useState } from 'react';
import Rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/database';
import ServiceData from '../helpers/data/serviceData';
import ToDoData from '../helpers/data/todoData';
import ReviewTaskCard from '../Components/Cards/ReviewTaskCard';
import Loader from '../Components/Loader';
import ReviewData from '../helpers/data/reviewData';
import YourPreviousReviews from '../Components/YourPreviousReviews';
import TheirPreviousReviews from '../Components/TheirPreviousReviews';
import { useAppContext } from '../context/AppContext';
import type { Review, Service, ToDo } from '../types';

export default function LeaveReviewPage() {
  const { user, otherKey, joinedUserName } = useAppContext();

  const [theirReviews, setTheirReviews] = useState<Review[]>([]);
  const [yourReviews, setYourReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [toDos, setToDos] = useState<ToDo[]>([]);
  const [loading, setLoading] = useState(true);

  const getTodos = () =>
    ToDoData.getCompletedToDosByUid(otherKey).then((stuff) => setToDos(stuff));

  const getReviews = () => {
    ReviewData.getAllReviews().then((stuff) => {
      const yours: Review[] = [];
      const theirs: Review[] = [];
      Object.values(stuff).forEach((item) => {
        if (item.uid === (user as any)?.uid && (user as any)?.uid !== undefined) {
          yours.push(item);
        } else {
          theirs.push(item);
        }
      });
      if (yours.length) setYourReviews(yours);
      if (theirs.length) setTheirReviews(theirs);
    });
  };

  const getServices = () => ServiceData.getAllServices().then((stuff) => setServices(stuff));

  const redrawDom = () => {
    getReviews();
    getTodos();
  };

  // Initial fetches, loading delay, and a realtime review listener (subscription).
  useEffect(() => {
    getReviews();
    getServices();
    getTodos();
    const timer = setTimeout(() => setLoading(false), 1000);

    const base = Rebase.createClass(firebase.database());
    const reviewRef = base.listenTo('review', {
      context: {},
      asArray: true,
      then() {
        getTodos();
      },
    });

    return () => {
      clearTimeout(timer);
      base.removeBinding(reviewRef);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherKey]);

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
