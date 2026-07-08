import type { Service, ToDo } from '../../types';

interface Props {
  task: Service[];
  service: ToDo;
  hideRequest: (todosKey: string) => void;
}

export default function RequestCard({ task, service, hideRequest }: Props) {
  const { name, description } = task[0] || ({} as Service);
  return (
    <div className="card m-2">
      {/* Original had a duplicate `id` attribute; kept the meaningful todosKey one. */}
      <div id={service.todosKey} className="card-body d-flex justify-content-between">
        <div>
          <h5 className="card-title">{name}</h5>
          <p className="card-text description">{description}</p>
          <p className="card-text date">Requested: {service.requestedTime}</p>
        </div>

        <div className="d-flex">
          {service.completedTime && (
            <button className="hideButton" onClick={() => hideRequest(service.todosKey)}>
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
