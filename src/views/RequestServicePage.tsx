import { useState } from 'react';
import YourCheckout from '../Components/YourCheckout';
import YourOrder from '../Components/YourOrder';
import { useAppContext } from '../context/AppContext';
import { useUserServices } from '../data/useServiceData';
import { useCreateToDo } from '../data/useTodoData';
import type { ToDo } from '../types';

export default function RequestServicePage() {
  const { user, otherKey } = useAppContext();
  const uid = (user as any)?.uid;

  const { data: services = {}, isLoading } = useUserServices(otherKey);
  const createToDo = useCreateToDo();

  const [order, setOrder] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const submitOrder = () => {
    const dateTime = new Date();
    Object.keys(order).forEach((key) => {
      const todo = {
        requesterId: `${uid}`,
        uid: `${otherKey}`,
        taskId: `${key}`,
        status: 'pending',
        reviewId: '',
        requestedTime: `${dateTime.toDateString()}`,
        completedTime: '',
      } as ToDo;
      createToDo.mutate(todo, {
        onSuccess: () => {
          setOrder({});
          setSubmitted(true);
        },
      });
    });
  };

  const addToOrder = (key: string) => {
    setOrder((prev) => ({ ...prev, [key]: 1 }));
    setSubmitted(false);
  };

  const removeFromOrder = (key: string) => {
    setOrder((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  return (
    <div>
      <YourCheckout addToOrder={addToOrder} services={services} loading={isLoading} />
      <YourOrder
        order={order}
        submitted={submitted}
        services={services}
        submitOrder={submitOrder}
        removeFromOrder={removeFromOrder}
      />
    </div>
  );
}
