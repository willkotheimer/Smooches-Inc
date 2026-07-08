import Auth from '../Components/Auth';
import Loader from '../Components/Loader';
import LeaveReviewPage from './LeaveReviewPage';
import { useAppContext } from '../context/AppContext';

export default function LeaveReview() {
  const { user } = useAppContext();
  return (
    <div>
      {user ? (
        <LeaveReviewPage />
      ) : user === null ? (
        <Loader />
      ) : (
        <>
          <h3 className="title d-flex justify-content-center">Leave Review</h3>
          <br />
          <Auth />
        </>
      )}
    </div>
  );
}
