import { useEffect, useState } from 'react';
import Services from '../helpers/data/serviceData';
import type { Review, Service } from '../types';

interface Props {
  service: string;
  previousReview: Review;
  otherName: string;
}

export default function YourPreviousReviews({ service, previousReview, otherName }: Props) {
  const [serviceInfo, setServiceInfo] = useState<Service | undefined>(undefined);

  useEffect(() => {
    Services.getTaskByFBKey(service).then((value) => setServiceInfo(value[0]));
  }, [service]);

  return (
    <>
      {/* FIXME: `fireBaseKey` is a typo for `firebaseKey`; preserved from original. */}
      <p id={(previousReview as any).fireBaseKey} className="previousReviewsGivenByYou">
        Comment:
        {previousReview.reviewText}
      </p>
      <p className="review">
        {[...Array(parseInt(previousReview.reviewStars, 10) || 5)].map((e, i) => (
          <span className="stars" key={i}>
            <i className="hearts fas fa-heart"></i>
          </span>
        ))}{' '}
        to{' '}
        <strong>
          <i>{otherName.split(' ')[0]}</i>
        </strong>{' '}
        for{' '}
        <strong>
          <i>{serviceInfo && serviceInfo.name}</i>
        </strong>{' '}
      </p>
    </>
  );
}
