import React from 'react';

export default function YourPreviousReviews({ previousReview }) {
  return (
    <>
        <p id={previousReview.fireBaseKey} className="previousReviewsGivenByYou">Comment: {previousReview.reviewText}</p>
        <p className="card-text">Review Stars: {previousReview.reviewStars}</p>
    </> 
  );
}
