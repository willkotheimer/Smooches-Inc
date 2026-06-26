import { useFormik } from 'formik';
import getUser from '../../helpers/data/authData';
import { useCreateService, useUpdateService } from '../../data/useServiceData';
import type { Service } from '../../types';

interface Props {
  service?: Service;
  onUpdate?: () => void;
  // Injected at runtime by AppModal via React.cloneElement.
  toggle?: () => void;
  user?: any;
}

export default function ServiceForm({ service, onUpdate, toggle }: Props) {
  const createService = useCreateService();
  const updateService = useUpdateService();

  const formik = useFormik<Service>({
    enableReinitialize: true,
    initialValues: {
      firebaseKey: service?.firebaseKey || '',
      name: service?.name || '',
      uid: service?.uid || getUser(),
      description: service?.description || '',
      offerDescription: service?.offerDescription || '',
    },
    onSubmit: (values) => {
      const done = () => {
        onUpdate?.();
        toggle?.();
      };
      if (values.firebaseKey === '') {
        createService.mutate(values, { onSuccess: done });
      } else {
        updateService.mutate(values, { onSuccess: done });
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h3>Service Form</h3>
      <input
        type="text"
        name="name"
        value={formik.values.name}
        onChange={formik.handleChange}
        placeholder="Service Name"
        className="form-control form-control-lg m-1"
        required
      />
      <input
        type="text"
        name="description"
        value={formik.values.description}
        onChange={formik.handleChange}
        placeholder="Service Description"
        className="form-control form-control-lg m-1"
        required
      />
      <input
        type="text"
        name="offerDescription"
        value={formik.values.offerDescription}
        onChange={formik.handleChange}
        placeholder="Optional: This is a special offer"
        className="form-control form-control-lg m-1"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
