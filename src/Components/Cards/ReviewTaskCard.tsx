import AppModal from '../AppModal';
import ReviewForm from '../Forms/ReviewForm';
import type { Service, ToDo } from '../../types';

interface Props {
  toDo: ToDo;
  services: Service[];
  onUpdate: () => void;
}

export default function ReviewTaskCard({ toDo, services, onUpdate }: Props) {
  const taskKey = toDo.taskId;
  const toDoId = toDo.firebaseKey;
  const service = Object.values(services).filter((x) => x.firebaseKey === taskKey);

  return (
    <div className="card m-2">
      <div className="card-body" id="">
        <h5 className="card-title">{service && service[0].name}</h5>
        <AppModal title={'Leave a Review'} buttonLabel={'Leave a Review'}>
          <ReviewForm toDoId={toDoId} taskid={taskKey} onUpdate={onUpdate} />
        </AppModal>
      </div>
    </div>
  );
}
