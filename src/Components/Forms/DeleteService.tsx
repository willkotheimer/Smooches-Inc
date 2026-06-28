import React from 'react';
import Button from '../../ui/Button';
import { useDeleteService } from '../../data/useServiceData';
import type { Service } from '../../types';

interface Props {
  service: Service;
  services?: Service[];
  redrawDom: () => void;
}

export default function DeleteService({ service, redrawDom }: Props) {
  const deleteService = useDeleteService();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    deleteService.mutate(service.firebaseKey, { onSuccess: () => redrawDom() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="font-bold">{service.name}</p>
      <Button type="submit">
        <i className="fa-solid fa-trash" aria-hidden /> Delete
      </Button>
    </form>
  );
}
