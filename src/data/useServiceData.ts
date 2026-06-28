import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAPIRequest } from './useAPIRequest';
import { apiRoutes } from './apiRoutes';
import type { Service } from '../types';

export function useAllServices() {
  const { get } = useAPIRequest();
  return useQuery<Service[]>(['services'], () => get<Service[]>(apiRoutes.services));
}

export function useUserServices(uid: string, activeOnly = false) {
  const { get } = useAPIRequest();
  // Returned keyed by firebaseKey because some callers do services[key].
  return useQuery<Record<string, Service>>(
    ['userServices', uid, activeOnly],
    async () => {
      const url = `${apiRoutes.servicesByUid(uid)}${activeOnly ? '&active=true' : ''}`;
      const list = await get<Service[]>(url);
      return Object.fromEntries(list.map((s) => [s.firebaseKey, s]));
    },
    { enabled: Boolean(uid) },
  );
}

export function useServiceByKey(fbKey: string) {
  const { get } = useAPIRequest();
  return useQuery<Service | undefined>(
    ['serviceByKey', fbKey],
    async () => {
      const list = await get<Service[]>(apiRoutes.services);
      return list.find((s) => s.firebaseKey === fbKey);
    },
    { enabled: Boolean(fbKey) },
  );
}

const invalidateServices = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries(['services']);
  queryClient.invalidateQueries(['userServices']);
};

export function useCreateService() {
  const { post } = useAPIRequest();
  const queryClient = useQueryClient();
  return useMutation<Service, Error, Service>(
    (service) =>
      post<Service>(apiRoutes.services, service, {
        successMessage: 'Service created.',
        errorMessage: 'Service not created.',
      }),
    { onSuccess: () => invalidateServices(queryClient) },
  );
}

export function useUpdateService() {
  const { patch } = useAPIRequest();
  const queryClient = useQueryClient();
  return useMutation<Service, Error, Service>(
    (service) =>
      patch<Service>(apiRoutes.service(service.firebaseKey), service, {
        successMessage: 'Service updated.',
        errorMessage: 'Service not updated.',
      }),
    { onSuccess: () => invalidateServices(queryClient) },
  );
}

export function useSetServiceActive() {
  const { patch } = useAPIRequest();
  const queryClient = useQueryClient();
  return useMutation<Service, Error, { firebaseKey: string; active: boolean }>(
    ({ firebaseKey, active }) =>
      patch<Service>(apiRoutes.service(firebaseKey), { active }),
    { onSuccess: () => invalidateServices(queryClient) },
  );
}

export function useDeleteService() {
  const { del } = useAPIRequest();
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, string>(
    (firebaseKey) =>
      del(apiRoutes.service(firebaseKey), {
        successMessage: 'Service deleted.',
        errorMessage: 'Service not deleted.',
      }),
    { onSuccess: () => invalidateServices(queryClient) },
  );
}
