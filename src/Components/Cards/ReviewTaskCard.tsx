import AppModal from '../AppModal';
import ReviewForm from '../Forms/ReviewForm';
import Card from '../../ui/Card';
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
    <Card tone="blue" className="flex items-center justify-between gap-3">
      <h3 className="font-bold">{service && service[0] && service[0].name}</h3>
      <AppModal title={'Leave a Review'} buttonLabel={'Leave a Review'}>
        <ReviewForm toDoId={toDoId} taskid={taskKey} onUpdate={onUpdate} />
      </AppModal>
    </Card>
  );
}
