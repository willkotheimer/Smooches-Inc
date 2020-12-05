import React from 'react';
import Loader from '../components/Loader';


export default class RequestService extends React.Component {
    
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
            <h2>Request Service</h2>
            
          </>
        )}
      </>
    );
  }
}
