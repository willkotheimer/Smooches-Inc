import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAPIRequest } from './useAPIRequest';
import { apiRoutes } from './apiRoutes';
import type { Service } from '../types';

export function useAllServices() {
  const { get } = useAPIRequest();
  return useQuery<Service[]>(['services'], async () => {
    const data = await get<Record<string, Service> | null>(apiRoutes.services);
    return data ? Object.values(data) : [];
  });
}

export function useUserServices(uid: string) {
  const { get } = useAPIRequest();
  return useQuery<Record<string, Service>>(
    ['userServices', uid],
    async () => (await get<Record<string, Service> | null>(apiRoutes.servicesByUid(uid))) ?? {},
    { enabled: Boolean(uid) },
  );
}

export function useServiceByKey(fbKey: string) {
  const { get } = useAPIRequest();
  return useQuery<Service | undefined>(
    ['serviceByKey', fbKey],
    async () => {
      const data = await get<Record<string, Service> | null>(apiRoutes.services);
      return data ? Object.values(data).find((s) => s.firebaseKey === fbKey) : undefined;
    },
    { enabled: Boolean(fbKey) },
  );
}

const invalidateServices = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries(['services']);
  queryClient.invalidateQueries(['userServices']);
};

export function useCreateService() {
  const { post, patch } = useAPIRequest();
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, Service>(
    async (service) => {
      const res = await post<{ name: string }>(apiRoutes.services, service, {
        successMessage: 'Service created.',
        errorMessage: 'Service not created.',
      });
      return patch(apiRoutes.service(res.name), { firebaseKey: res.name });
    },
    { onSuccess: () => invalidateServices(queryClient) },
  );
}

export function useUpdateService() {
  const { patch } = useAPIRequest();
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, Service>(
    (service) =>
      patch(apiRoutes.service(service.firebaseKey), service, {
        successMessage: 'Service updated.',
        errorMessage: 'Service not updated.',
      }),
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
