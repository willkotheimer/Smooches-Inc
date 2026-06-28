import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Chip from '../../ui/Chip';
import type { Service, ToDo } from '../../types';

interface Props {
  task: Service[];
  service: ToDo;
  hideRequest: (firebaseKey: string) => void;
}

export default function RequestCard({ task, service, hideRequest }: Props) {
  const { name, description } = task[0] || ({} as Service);
  const done = Boolean(service.completedTime);
  return (
    <Card className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <h3 className="font-bold">{name}</h3>
        <p className="text-sm text-muted">{description}</p>
        <p className="text-xs text-muted">Requested: {service.requestedTime}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2.5">
        {done && (
          <Button size="sm" onClick={() => hideRequest(service.firebaseKey)} aria-label="Hide">
            <i className="fa-solid fa-eye-slash" aria-hidden />
          </Button>
        )}
        <Chip tone={done ? 'accent' : 'neutral'}>{done ? 'Done!' : 'Pending'}</Chip>
      </div>
    </Card>
  );
}
