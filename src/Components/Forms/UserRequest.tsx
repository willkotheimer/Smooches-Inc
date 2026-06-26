import { useFormik } from 'formik';
import getUser from '../../helpers/data/authData';
import { useCreateUserJoin } from '../../data/useUserData';
import type { User, UserJoin } from '../../types';

interface Props {
  usersToConnect: User[];
  otherUser?: { firebaseKey?: string };
  joinedUser?: any;
}

export default function UserRequest({ usersToConnect, otherUser }: Props) {
  const createUserJoin = useCreateUserJoin();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      user1FBKey: getUser(),
      user2FBKey: otherUser?.firebaseKey || '',
      confirm: false,
    },
    onSubmit: (values) => {
      // backend assigns firebaseKey on create.
      createUserJoin.mutate(values as unknown as UserJoin, {
        onSuccess: () => console.warn('made user', values),
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h3>User Request Form</h3>
      (No users will be linked to until confirmed) User available to link to:
      <select
        className="browser-default custom-select"
        name="user2FBKey"
        value={formik.values.user2FBKey}
        onChange={formik.handleChange}
      >
        <option>select a user</option>
        {Object.values(usersToConnect).map((option) => (
          <option key={option.uid} value={option.uid}>
            {option.name}
          </option>
        ))}
      </select>
      <button type="submit">Submit</button>
    </form>
  );
}
