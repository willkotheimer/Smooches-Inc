import { useServiceByKey } from '../data/useServiceData';
import type { Review } from '../types';

interface Props {
  service: string;
  previousReview: Review;
  otherName: string;
}

export default function TheirPreviousReviews({ service, previousReview, otherName }: Props) {
  const { data: serviceInfo } = useServiceByKey(service);

  return (
    <>
      <p id={previousReview.reviewsKey} className="previousReviewsGivenByYou">
        Comment: {previousReview.reviewText}
      </p>
      <p className="review">
        {[...Array(parseInt(previousReview.reviewStars, 10) || 5)].map((e, i) => (
          <span className="stars" key={i}>
            <i className="hearts fas fa-heart"></i>
          </span>
        ))}{' '}
        from{' '}
        <strong>
          <i>{otherName} </i>
        </strong>
        for{' '}
        <strong>
          <i>{serviceInfo && serviceInfo.name}</i>
        </strong>{' '}
      </p>
    </>
  );
}
