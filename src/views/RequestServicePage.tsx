import { useEffect, useState } from 'react';
import YourCheckout from '../Components/YourCheckout';
import ServiceData from '../helpers/data/serviceData';
import YourOrder from '../Components/YourOrder';
import toDoData from '../helpers/data/todoData';
import { useAppContext } from '../context/AppContext';
import type { Service } from '../types';

export default function RequestServicePage() {
  const { user, otherKey } = useAppContext();
  const uid = (user as any)?.uid;

  const [order, setOrder] = useState<Record<string, number>>({});
  const [services, setServices] = useState<Record<string, Service>>({});
  const [submitted, setSubmitted] = useState(false);

  const getServices = () => {
    ServiceData.getUserServices(otherKey).then((response: any) => {
      setServices(response.data);
    });
  };

  // On-mount/partner-change fetch of the partner's services.
  useEffect(() => {
    getServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherKey]);

  const removeAll = () => {
    setOrder({});
    setSubmitted(true);
  };

  const submitOrder = () => {
    const dateTime = new Date();
    const postObj: any[] = [];
    Object.keys(order).forEach((key) => {
      postObj.push({
        requesterId: `${uid}`,
        uid: `${otherKey}`,
        taskId: `${key}`,
        status: 'pending',
        reviewId: '',
        requestedTime: `${dateTime.toDateString()}`,
        completedTime: '',
      });
    });
    postObj.forEach((item) => {
      toDoData.createToDo(item).then(() => {
        removeAll();
      });
    });
  };

  const addToOrder = (key: string) => {
    setOrder((prev) => ({ ...prev, [key]: 1 }));
    setSubmitted(false); // reset submit confirmation
  };

  const removeFromOrder = (key: string) => {
    setOrder((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  return (
    <>
      <div className="servicePage">
        <div className="leftSide">
          <div className="createService">
            <h3>Your Smooch's Inc partner's Inventory:</h3>
            {<YourCheckout addToOrder={addToOrder} services={services} />}
          </div>
        </div>
        <div className="rightSide d-flex flex-column">
          <div className="todos">
            <div className="requestRightDiv">
              {
                <YourOrder
                  order={order}
                  submitted={submitted}
                  services={services}
                  submitOrder={submitOrder}
                  removeFromOrder={removeFromOrder}
                />
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
