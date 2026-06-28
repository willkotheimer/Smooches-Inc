import { useFormik } from 'formik';
import * as Yup from 'yup';
import getUser from '../../helpers/data/authData';
import Button from '../../ui/Button';
import { useCreateService, useUpdateService } from '../../data/useServiceData';
import type { Service } from '../../types';

interface Props {
  service?: Service;
  onUpdate?: () => void;
  toggle?: () => void; // injected by AppModal
  user?: any;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
});

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
    validationSchema,
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
    <form onSubmit={formik.handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="name" className="field-label">
          Service name
        </label>
        <input
          id="name"
          name="name"
          className="field"
          placeholder="e.g. Bring coffee"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="field-error">{formik.errors.name}</p>
        )}
      </div>
      <div>
        <label htmlFor="description" className="field-label">
          Description
        </label>
        <input
          id="description"
          name="description"
          className="field"
          placeholder="What does it involve?"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.description && formik.errors.description && (
          <p className="field-error">{formik.errors.description}</p>
        )}
      </div>
      <div>
        <label htmlFor="offerDescription" className="field-label">
          Special offer (optional)
        </label>
        <input
          id="offerDescription"
          name="offerDescription"
          className="field"
          placeholder="Optional special offer"
          value={formik.values.offerDescription}
          onChange={formik.handleChange}
        />
      </div>
      <Button type="submit">
        <i className="fa-solid fa-floppy-disk" aria-hidden /> Save
      </Button>
    </form>
  );
}
