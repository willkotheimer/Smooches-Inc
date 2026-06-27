import Card from '../../ui/Card';
import Button from '../../ui/Button';
import type { Service } from '../../types';

interface Props {
  service: Service;
  addToOrder: (index: number | string) => void;
  index: number | string;
}

export default function CheckoutCard({ service, addToOrder, index }: Props) {
  return (
    <Card tone="blue" className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <h3 className="font-bold">{service.name}</h3>
        <p className="text-sm text-muted">{service.description}</p>
      </div>
      <Button size="sm" onClick={() => addToOrder(index)}>
        <i className="fa-solid fa-plus" aria-hidden /> Add
      </Button>
    </Card>
  );
}
