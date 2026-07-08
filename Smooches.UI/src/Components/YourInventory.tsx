import ServiceCard from './Cards/ServiceCard';
import ServiceForm from './Forms/ServiceForm';
import Loader from './Loader';
import getUid from '../helpers/data/authData';
import AppModal from './AppModal';
import { useUserServices } from '../data/useServiceData';

export default function YourInventory() {
  const uid = getUid();
  const { data: services = {}, isLoading, refetch } = useUserServices(uid);

  const showServices = () =>
    Object.values(services).map((service, index) => (
      <ServiceCard key={index} service={service} redrawDom={() => refetch()} />
    ));

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <h3 className="taskHeader">Tasks You Offer:</h3>

          {services && showServices()}

          <div className="createServiceButton">
            <AppModal title={'Create A New Task'} buttonLabel={'Create A New Task +'}>
              <ServiceForm onUpdate={() => refetch()} />
            </AppModal>
          </div>
        </>
      )}
    </>
  );
}
