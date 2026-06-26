import { useEffect, useState } from 'react';
import ServiceData from '../helpers/data/serviceData';
import ServiceCard from './Cards/ServiceCard';
import ServiceForm from './Forms/ServiceForm';
import Loader from './Loader';
import getUid from '../helpers/data/authData';
import AppModal from './AppModal';
import type { Service } from '../types';

export default function YourInventory() {
  const [services, setServices] = useState<Record<string, Service> | Service[]>([]);
  const [loading, setLoading] = useState(true);

  const getServices = () => {
    const UID = getUid();
    ServiceData.getUserServices(UID).then((response: any) => {
      setServices(response.data);
      setLoading(false);
    });
  };

  // On-mount data fetch: genuine side effect, so useEffect is needed.
  useEffect(() => {
    getServices();
  }, []);

  const showServices = () =>
    Object.values(services).map((service, index) => (
      <ServiceCard key={index} service={service} redrawDom={getServices} />
    ));

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <h3 className="taskHeader">Tasks You Offer:</h3>

          {services && showServices()}

          <div className="createServiceButton">
            <AppModal title={'Create A New Task'} buttonLabel={'Create A New Task +'}>
              <ServiceForm onUpdate={getServices} />
            </AppModal>
          </div>
        </>
      )}
    </>
  );
}
