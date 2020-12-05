import React from 'react';
import Loader from '../components/Loader';


export default class CreateService extends React.Component {
    
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
            <h2>Dashboard</h2>
            
          </>
        )}
      </>
    );
  }
}
