import React from 'react';
import type { Service, ToDo } from '../../types';

interface Props {
  task: Service[];
  service: ToDo;
  hideRequest: (firebaseKey: string) => void;
}

export default class RequestCard extends React.Component<Props> {
  render() {
    const { name, description } = this.props.task[0] || ({} as Service);
    return (
      <div className="card m-2">
        {/* Original had a duplicate `id` attribute; kept the meaningful firebaseKey one. */}
        <div id={this.props.service.firebaseKey} className="card-body d-flex justify-content-between">
          <div>
            <h5 className="card-title">{name}</h5>
            <p className="card-text description">{description}</p>
            <p className="card-text date">Requested: {this.props.service.requestedTime}</p>
          </div>

          <div className="d-flex">
            {this.props.service.completedTime && (
              <button
                className="hideButton"
                onClick={() => this.props.hideRequest(this.props.service.firebaseKey)}
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
