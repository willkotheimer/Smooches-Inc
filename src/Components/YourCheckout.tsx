import CheckoutCard from './Cards/CheckoutCard';
import Loader from './Loader';
import SectionHeading from '../ui/SectionHeading';
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

  if (loading) return <Loader />;

  return (
    <>
      <p className="mb-2 text-sm text-muted">
        Your Smooches Inc Representative,{' '}
        <strong className="text-foreground">
          {otherName[0]?.[1] && otherName[0][1].name.split(' ')[0]}
        </strong>
        , has authorized the following services:
      </p>
      <SectionHeading icon="fa-solid fa-store">Tasks Offered</SectionHeading>
      {services && showServices()}
    </>
  );
}
