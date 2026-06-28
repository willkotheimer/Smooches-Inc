import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Chip from '../../ui/Chip';
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
  const done = Boolean(service.completedTime);
  return (
    <Card className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <h3 className="font-bold">{name}</h3>
        <p className="text-sm text-muted">{description}</p>
        <p className="text-xs text-muted">{service.requestedTime}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        {!done && (
          <Button size="sm" onClick={() => completeTask(firebaseKey, dateTime)}>
            <i className="fa-solid fa-check" aria-hidden /> Complete
          </Button>
        )}
        {done && (
          <Button size="sm" onClick={() => hideTask(firebaseKey)} aria-label="Hide">
            <i className="fa-solid fa-eye-slash" aria-hidden />
          </Button>
        )}
        <Chip tone={done ? 'accent' : 'neutral'}>{done ? 'Done!' : 'Pending'}</Chip>
      </div>
    </Card>
  );
}
