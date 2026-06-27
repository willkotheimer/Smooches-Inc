import AppModal from '../AppModal';
import DeleteModal from '../DeleteModal';
import ServiceForm from '../Forms/ServiceForm';
import DeleteService from '../Forms/DeleteService';
import Card from '../../ui/Card';
import type { Service } from '../../types';

interface Props {
  service: Service;
  redrawDom: () => void;
}

export default function ServiceCard({ service, redrawDom }: Props) {
  return (
    <Card tone="blue">
      <h3 className="font-bold">{service.name}</h3>
      <p className="text-sm text-muted">{service.description}</p>
      <div className="mt-2 flex gap-2">
        <AppModal title={'Edit Service'} buttonLabel={'Edit Service'}>
          <ServiceForm service={service} onUpdate={redrawDom} />
        </AppModal>
        <DeleteModal title={'Delete Service'} buttonLabel={'Delete Service'}>
          This action is undoable. Delete?
          <DeleteService service={service} redrawDom={redrawDom} />
        </DeleteModal>
      </div>
    </Card>
  );
}
