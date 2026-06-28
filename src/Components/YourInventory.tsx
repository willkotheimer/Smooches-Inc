import ServiceCard from './Cards/ServiceCard';
import ServiceForm from './Forms/ServiceForm';
import Loader from './Loader';
import getUid from '../helpers/data/authData';
import AppModal from './AppModal';
import SectionHeading from '../ui/SectionHeading';
import { useUserServices, useCreateService } from '../data/useServiceData';
import { servicePresets } from '../data/servicePresets';
import type { Service } from '../types';

export default function YourInventory() {
  const uid = getUid();
  const { data: services = {}, isLoading, refetch } = useUserServices(uid);
  const createService = useCreateService();

  const owned = Object.values(services);
  // Presets the user hasn't added yet (matched by name, case-insensitive).
  const ownedNames = new Set(owned.map((s) => s.name.trim().toLowerCase()));
  const available = servicePresets.filter((p) => !ownedNames.has(p.name.trim().toLowerCase()));

  const addPreset = (name: string, description: string) => {
    const preset: Service = {
      firebaseKey: '',
      uid,
      name,
      description,
      offerDescription: '',
      active: true,
      source: 'preset',
    };
    createService.mutate(preset, { onSuccess: () => refetch() });
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <SectionHeading icon="fa-solid fa-store">Tasks You Offer</SectionHeading>
      {owned.length === 0 && (
        <p className="mb-2 text-sm text-muted">
          You haven&apos;t added any tasks yet. Add one from the bank below, or create your own.
        </p>
      )}
      {owned.map((service, index) => (
        <ServiceCard key={index} service={service} redrawDom={() => refetch()} />
      ))}

      {available.length > 0 && (
        <div className="mt-5">
          <SectionHeading icon="fa-solid fa-piggy-bank">Add From The Bank</SectionHeading>
          <div className="flex flex-wrap gap-2">
            {available.map((preset) => (
              <button
                key={preset.name}
                type="button"
                disabled={createService.isLoading}
                onClick={() => addPreset(preset.name, preset.description)}
                className="rounded-card border border-line px-3 py-1.5 text-xs font-semibold hover:border-accent hover:text-accent disabled:opacity-50"
              >
                <i className="fa-solid fa-plus" aria-hidden /> {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5">
        <AppModal title={'Create A New Task'} buttonLabel={'Create A New Task +'}>
          <ServiceForm onUpdate={() => refetch()} />
        </AppModal>
      </div>
    </>
  );
}
