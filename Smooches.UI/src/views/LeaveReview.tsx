import Auth from '../Components/Auth';
import Loader from '../Components/Loader';
import LeaveReviewPage from './LeaveReviewPage';
import PageLayout from '../ui/PageLayout';
import PageTitle from '../ui/PageTitle';
import { useAppContext } from '../context/AppContext';

export default function LeaveReview() {
  const { user } = useAppContext();
  return (
    <PageLayout>
      <PageTitle>Leave Review</PageTitle>
      {user ? <LeaveReviewPage /> : user === null ? <Loader /> : <Auth />}
    </PageLayout>
  );
}
