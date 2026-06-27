import ServiceCard from './Cards/ServiceCard';
import ServiceForm from './Forms/ServiceForm';
import Loader from './Loader';
import getUid from '../helpers/data/authData';
import AppModal from './AppModal';
import SectionHeading from '../ui/SectionHeading';
import { useUserServices } from '../data/useServiceData';

export default function YourInventory() {
  const uid = getUid();
  const { data: services = {}, isLoading, refetch } = useUserServices(uid);

  const showServices = () =>
    Object.values(services).map((service, index) => (
      <ServiceCard key={index} service={service} redrawDom={() => refetch()} />
    ));

  if (isLoading) return <Loader />;

  return (
    <>
      <SectionHeading icon="fa-solid fa-store">Tasks You Offer</SectionHeading>
      {services && showServices()}
      <div className="mt-3">
        <AppModal title={'Create A New Task'} buttonLabel={'Create A New Task +'}>
          <ServiceForm onUpdate={() => refetch()} />
        </AppModal>
      </div>
    </>
  );
}
