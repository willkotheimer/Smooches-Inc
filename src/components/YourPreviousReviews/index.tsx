import React from 'react';
import Services from '../../helpers/data/serviceData';
import type { Review, Service } from '../../types';

interface Props {
  service: string;
  previousReview: Review;
  otherName: string;
}

interface State {
  serviceInfo?: Service;
}

export default class YourPreviousReviews extends React.Component<Props, State> {
  state: State = {
    serviceInfo: undefined,
  };

  componentDidMount() {
    this.getServiceData(this.props.service).then((value) => {
      this.setState({
        serviceInfo: value[0],
      });
    });
  }

  getServiceData = (fbKey: string) => Services.getTaskByFBKey(fbKey);

  render() {
    return (
      <>
        {/* FIXME: `fireBaseKey` is a typo for `firebaseKey`; preserved from original. */}
        <p id={(this.props.previousReview as any).fireBaseKey} className="previousReviewsGivenByYou">
          Comment:
          {this.props.previousReview.reviewText}
        </p>
        <p className="review">
          {[...Array(parseInt(this.props.previousReview.reviewStars, 10) || 5)].map((e, i) => (
            <span className="stars" key={i}>
              <i className="hearts fas fa-heart"></i>
            </span>
          ))}{' '}
          to{' '}
          <strong>
            <i>{this.props.otherName.split(' ')[0]}</i>
          </strong>{' '}
          for{' '}
          <strong>
            <i>{this.state.serviceInfo && this.state.serviceInfo.name}</i>
          </strong>{' '}
        </p>
      </>
    );
  }
}
