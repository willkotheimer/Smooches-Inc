import type { Service, ToDo } from '../../types';

interface Props {
  task: Service[];
  service: ToDo;
  firebaseKey: string;
  completeTask: (firebaseKey: string, time: Date) => void;
  hideTask: (firebaseKey: string) => void;
  otherName?: any;
}

export default function ToDosCard({ task, service, firebaseKey, completeTask, hideTask }: Props) {
  const { name, description } = task[0] || ({} as Service);
  const dateTime = new Date();
  return (
    <div className="card m-2">
      <div className="card-body d-flex justify-content-between" id="">
        <div>
          <h5 className="card-title">{name}</h5>
          <p className="card-text description">{description}</p>
          <p className="card-text date">{service.requestedTime}</p>
        </div>

        <div className="d-flex">
          {!service.completedTime && (
            <button className="completeButton" onClick={() => completeTask(firebaseKey, dateTime)}>
              Complete Task
            </button>
          )}
          {service.completedTime && (
            <button className="hideButton" onClick={() => hideTask(firebaseKey)}>
              <i className="fas fa-eye-slash"></i>
            </button>
          )}
          <div className={service.completedTime ? 'done status' : 'pending status'}>
            {service.completedTime ? 'Done!' : 'Pending'}{' '}
          </div>
        </div>
      </div>
    </div>
  );
}
