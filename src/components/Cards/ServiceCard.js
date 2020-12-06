import React from 'react';
import ServiceForm from '../Forms/ServiceForm';
import AppModal from '../AppModal';
import DeleteService from '../Forms/DeleteService';

export default function ServiceCard({ service, redrawDom }) {
  return (
    <div className="card m-2">
      <div className="card-body" id={service.fireBaseKey}>
        <h5 className="card-title">{service.name}</h5>
        <p className="card-text">{service.description}</p>
        <div className="create-delete-btn"></div>

        <AppModal title={'Edit Service'} buttonLabel={'Edit Service'}>
              <ServiceForm service={service} onUpdate={redrawDom} />
        </AppModal>
        <AppModal title={'Delete Service'} buttonLabel={'Delete Service'}>
          This action is undoable. Delete?
          <DeleteService service={service} redrawDom={redrawDom} />
        </AppModal>
      </div>
    </div>
  );
}
