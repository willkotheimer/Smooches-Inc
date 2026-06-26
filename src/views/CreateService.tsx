import Auth from '../Components/Auth';
import Loader from '../Components/Loader';
import CreateServicePage from './CreateServicePage';
import { useAppContext } from '../context/AppContext';

export default function CreateService() {
  const { user } = useAppContext();
  return (
    <div>
      <h3 className="title d-flex justify-content-center">Create Service</h3>
      <br />
      {user ? <CreateServicePage /> : user === null ? <Loader /> : <Auth />}
    </div>
  );
}
