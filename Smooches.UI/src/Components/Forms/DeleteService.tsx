import React from 'react';
import { useDeleteService } from '../../data/useServiceData';
import type { Service } from '../../types';

interface Props {
  service: Service;
  services?: Service[];
  redrawDom: () => void;
}

// No input fields, so Formik would be pure ceremony here — a plain function
// component with the delete mutation is clearer.
export default function DeleteService({ service, redrawDom }: Props) {
  const deleteService = useDeleteService();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    deleteService.mutate(service.servicesKey, { onSuccess: () => redrawDom() });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="deleteService">{service.name}</h3>
      <input type="hidden" name="servicesKey" value={service.servicesKey} />
      <button type="submit">Delete</button>
    </form>
  );
}
