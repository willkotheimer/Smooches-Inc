import { useEffect, useState } from 'react';
import CheckoutCard from './Cards/CheckoutCard';
import Loader from './Loader';
import { useAppContext } from '../context/AppContext';
import type { Service } from '../types';

type ServiceCollection = Service[] | Record<string, Service>;

interface Props {
  services: ServiceCollection;
  addToOrder: (index: number | string) => void;
}

export default function YourCheckout({ services, addToOrder }: Props) {
  const { otherName } = useAppContext();
  const [loading, setLoading] = useState(true);

  // Brief loading delay before showing the partner's services.
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const showServices = () =>
    Object.values(services).map((service) => (
      <CheckoutCard
        key={service.firebaseKey}
        index={service.firebaseKey}
        service={service}
        addToOrder={addToOrder}
      />
    ));

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div>
            Your Smooches Inc Representative,{' '}
            {otherName[0][1] && otherName[0][1].name.split(' ')[0]},
            <br /> has authorized the following services:
          </div>
          <div className="tasksOffered">
            <h3 className="checkoutHeader">Tasks Offered</h3>
            {services && showServices()}
          </div>
        </>
      )}
    </>
  );
}
