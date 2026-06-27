import Card from '../../ui/Card';
import type { Service } from '../../types';

interface Props {
  toDo: [string, number];
  services: Service[];
}

export default function OrderHistory({ toDo, services }: Props) {
  const taskKey = toDo[0];
  const service = Object.values(services).filter((x) => x.firebaseKey === taskKey);

  return (
    <Card className="flex items-center justify-between gap-3">
      <h3 className="font-semibold">{service[0] && service[0].name}</h3>
      <span className="text-sm text-muted">&times;{toDo[1]}</span>
    </Card>
  );
}
