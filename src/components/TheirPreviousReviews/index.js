import React from 'react';
import Services from '../../helpers/data/serviceData';

export default class TheirPreviousReviews extends React.Component {
  state = {
    serviceInfo: []
  }

  componentDidMount() {
    this.getServiceData(this.props.service).then(value => {
      this.setState({
        serviceInfo: value[0]
      });
  });
}

  getServiceData = (fbKey) => Services.getTaskByFBKey(fbKey);

  render() {
   
    return (
      <>
          <p id={this.props.previousReview.fireBaseKey} 
          className="previousReviewsGivenByYou">
            Comment: {this.props.previousReview.reviewText}
          </p>
          <p className="review">{[...Array(parseInt(this.props.previousReview.reviewStars,10) || 5)]
            .map((e, i) => 
          <span className="stars" 
          key={i}><i className="hearts fas fa-heart"></i></span>) } 
             from <strong><i>{ this.props.otherName  } </i></strong> 
           for <strong><i>{ this.state.serviceInfo && this.state.serviceInfo.name }
          </i></strong> </p>
      </> 
    );
  }
}
