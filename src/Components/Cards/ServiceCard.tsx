import AppModal from '../AppModal';
import DeleteModal from '../DeleteModal';
import ServiceForm from '../Forms/ServiceForm';
import DeleteService from '../Forms/DeleteService';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Chip from '../../ui/Chip';
import { useSetServiceActive } from '../../data/useServiceData';
import type { Service } from '../../types';

interface Props {
  service: Service;
  redrawDom: () => void;
}

export default function ServiceCard({ service, redrawDom }: Props) {
  const setActive = useSetServiceActive();
  const isActive = service.active ?? true;
  const isCustom = (service.source ?? 'custom') === 'custom';

  const toggleActive = () =>
    setActive.mutate(
      { firebaseKey: service.firebaseKey, active: !isActive },
      { onSuccess: redrawDom },
    );

  return (
    <Card tone="blue" className={isActive ? undefined : 'opacity-60'}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold">{service.name}</h3>
        <Chip tone={isActive ? 'accent' : 'neutral'}>{isActive ? 'Offered' : 'In bank'}</Chip>
      </div>
      <p className="text-sm text-muted">{service.description}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" onClick={toggleActive} disabled={setActive.isLoading}>
          {isActive ? (
            <>
              <i className="fa-solid fa-toggle-on" aria-hidden /> Deactivate
            </>
          ) : (
            <>
              <i className="fa-solid fa-toggle-off" aria-hidden /> Activate
            </>
          )}
        </Button>
        <AppModal title={'Edit Service'} buttonLabel={'Edit Service'}>
          <ServiceForm service={service} onUpdate={redrawDom} />
        </AppModal>
        {isCustom && (
          <DeleteModal title={'Delete Service'} buttonLabel={'Delete Service'}>
            This action is undoable. Delete?
            <DeleteService service={service} redrawDom={redrawDom} />
          </DeleteModal>
        )}
      </div>
    </Card>
  );
}
