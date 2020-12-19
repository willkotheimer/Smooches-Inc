import React from 'react';

export default function TheirPreviousReviews({ previousReview }) {
  return (
    <>
        <p id={previousReview.fireBaseKey} className="reviewGivenDiv">Comment: {previousReview.reviewText}</p>
        <p className="card-text">Review Stars: {previousReview.reviewStars}</p>
    </> 
    
  );
}
