import React, { Component } from 'react';
import getUser from '../../helpers/data/authData';
import ReviewData from '../../helpers/data/reviewData';

export default class LeaveReview extends Component {

  state = {
    dateTime: Date.now(),
    toDoid: this.props.toDoId || '',
    serviceid: this.props.taskid || '',
    firebaseKey: this.props.toDo?.firebaseKey || '',
    reviewText: this.props.review?.reviewText || '',
    reviewStars: this.props.review?.reviewStars || '',
  };

  componentDidMount() {
    const userId = getUser();
    this.setState({
      uid: userId,
    });
  };

  handleChange = e => {
     console.warn(e.target.value);
      this.setState({
        [e.target.name]: e.target.value
      });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.firebaseKey === '') {
      this.setState({
        firebaseKey: this.props.firebaseKey
      });
    }  
  
      ReviewData.createReview(this.state).then(() => {
        this.props.onUpdate();
      });
    
  };

  render() {
    const { reviewStars } = this.state;
    const options = [
      {
        label: "1",
        value: "1",
      },
      {
        label: "2",
        value: "2",
      },
      {
        label: "3",
        value: "3",
      },
      {
        label: "4",
        value: "4",
      },
      {
        label: "5",
        value: "5",
      }
    ];
    return (
        
      <form onSubmit={this.handleSubmit}>
        <h3>Leave a Review</h3>
        <hr/>
        <div className="form-group">
        <label htmlFor="leaveReview">Leave a Review</label>
        <textarea name="reviewText"
          onChange={this.handleChange} className="form-control" id="leaveReviee" rows="4" required></textarea>
        </div>
        <label htmlFor="leaveRating">Leave a Rating</label>
          <select name="reviewStars" id="reviewStars" className="selectpicker" value={reviewStars}
          onChange={this.handleChange} >
            <option value="">-SELECT-</option>
            {options.map((option) => (
              <option value={option.value}>{option.label}</option>
            ))}
            </select>
       
        <button>Submit</button>
      </form>
    );
  }
  }
