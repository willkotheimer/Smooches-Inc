import CheckoutCard from './Cards/CheckoutCard';
import Loader from './Loader';
import { useAppContext } from '../context/AppContext';
import type { Service } from '../types';

type ServiceCollection = Service[] | Record<string, Service>;

interface Props {
  services: ServiceCollection;
  addToOrder: (index: number | string) => void;
  loading?: boolean;
}

export default function YourCheckout({ services, addToOrder, loading }: Props) {
  const { otherName } = useAppContext();

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
