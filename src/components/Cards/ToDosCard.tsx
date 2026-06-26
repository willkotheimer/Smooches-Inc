import React from 'react';
import type { Service, ToDo } from '../../types';

interface Props {
  task: Service[];
  service: ToDo;
  firebaseKey: string;
  completeTask: (firebaseKey: string, time: Date) => void;
  hideTask: (firebaseKey: string) => void;
  otherName?: any;
}

export default class toDosCard extends React.Component<Props> {
  render() {
    const { name, description } = this.props.task[0] || ({} as Service);
    const dateTime = new Date();
    return (
      <div className="card m-2">
        <div className="card-body d-flex justify-content-between" id="">
          <div>
            <h5 className="card-title">{name}</h5>
            <p className="card-text description">{description}</p>
            <p className="card-text date">{this.props.service.requestedTime}</p>
          </div>

          <div className="d-flex">
            {!this.props.service.completedTime && (
              <button
                className="completeButton"
                onClick={() => this.props.completeTask(this.props.firebaseKey, dateTime)}
              >
                Complete Task
              </button>
            )}
            {this.props.service.completedTime && (
              <button
                className="hideButton"
                onClick={() => this.props.hideTask(this.props.firebaseKey)}
              >
                <i className="fas fa-eye-slash"></i>
              </button>
            )}
            <div className={this.props.service.completedTime ? 'done status' : 'pending status'}>
              {this.props.service.completedTime ? 'Done!' : 'Pending'}{' '}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
