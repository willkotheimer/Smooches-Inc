import React from 'react';

export default function TheirPreviousReviews({ previousReview }) {
  return (
    <div className="card m-2">
      <div className="card-body" id={previousReview.fireBaseKey}>
        <h5 className="card-title">Name</h5>
        <p className="card-text">Comment: {previousReview.reviewText}</p>
        <p className="card-text">Review Stars: {previousReview.reviewStars}</p>
        <div className="create-delete-btn"></div>

      </div>
    </div>
  );
}
