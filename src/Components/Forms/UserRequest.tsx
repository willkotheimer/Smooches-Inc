import { useFormik } from 'formik';
import * as Yup from 'yup';
import getUser from '../../helpers/data/authData';
import Button from '../../ui/Button';
import { useCreateUserJoin } from '../../data/useUserData';
import type { User, UserJoin } from '../../types';

interface Props {
  usersToConnect: User[];
  otherUser?: { firebaseKey?: string };
  joinedUser?: any;
  toggle?: () => void; // injected by AppModal
}

const validationSchema = Yup.object({
  user2FBKey: Yup.string().required('Please select a user'),
});

export default function UserRequest({ usersToConnect, otherUser, toggle }: Props) {
  const createUserJoin = useCreateUserJoin();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      user1FBKey: getUser(),
      user2FBKey: otherUser?.firebaseKey || '',
      confirm: false,
    },
    validationSchema,
    onSubmit: (values) => {
      createUserJoin.mutate(values as unknown as UserJoin, { onSuccess: () => toggle?.() });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-3">
      <p className="text-sm text-muted">No users will be linked until confirmed.</p>
      <div>
        <label htmlFor="user2FBKey" className="field-label">
          User to link
        </label>
        <select
          id="user2FBKey"
          name="user2FBKey"
          className="field"
          value={formik.values.user2FBKey}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="">Select a user</option>
          {Object.values(usersToConnect).map((option) => (
            <option key={option.uid} value={option.uid}>
              {option.name}
            </option>
          ))}
        </select>
        {formik.touched.user2FBKey && formik.errors.user2FBKey && (
          <p className="field-error">{formik.errors.user2FBKey}</p>
        )}
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
