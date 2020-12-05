import React from 'react';
import Loader from '../components/Loader';


export default class LeaveReview extends React.Component {

  state = {
      loading: false
  }

  render() {
    return (
      <>
        {this.state.loading ? (
          <Loader />
        ) : (
          <>
            <h2>Leave a review</h2>
            
          </>
        )}
      </>
    );
  }
}
