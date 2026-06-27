import Button from '../ui/Button';
import Card from '../ui/Card';
import SectionHeading from '../ui/SectionHeading';
import type { Service } from '../types';

interface Props {
  services: Record<string, Service>;
  order: Record<string, number>;
  removeFromOrder: (key: string) => void;
  submitOrder: () => void;
  submitted?: boolean;
}

export default function YourOrder({
  services,
  order,
  removeFromOrder,
  submitOrder,
  submitted,
}: Props) {
  const orderIds = Object.keys(order);

  return (
    <div className="mt-4">
      <SectionHeading icon="fa-solid fa-cart-shopping">My Checkout</SectionHeading>
      <Card tone="blue">
        {orderIds.length === 0 ? (
          <p className="text-sm text-muted">Nothing added yet.</p>
        ) : (
          <ul className="space-y-1.5">
            {orderIds.map((key) => {
              const task = services[key];
              const count = order[key];
              return (
                <li key={`${key}-${Date.now()}`} className="flex items-center justify-between text-sm">
                  <span>
                    {count} &times; {task.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromOrder(key)}
                    aria-label="Remove"
                  >
                    <i className="fa-solid fa-minus" aria-hidden />
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
      <Button className="mt-2" onClick={() => submitOrder()}>
        <i className="fa-solid fa-paper-plane" aria-hidden /> Place Order
      </Button>
      {submitted && (
        <p className="mt-2 text-sm text-accent">
          Order confirmed — check the dashboard for progress.
        </p>
      )}
    </div>
  );
}
