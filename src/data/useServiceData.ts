import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ServiceData from '../helpers/data/serviceData';
import type { Service } from '../types';

export function useAllServices() {
  return useQuery<Service[]>(['services'], () => ServiceData.getAllServices());
}

export function useUserServices(uid: string) {
  return useQuery<Record<string, Service>>(
    ['userServices', uid],
    () => ServiceData.getUserServices(uid),
    { enabled: Boolean(uid) },
  );
}

export function useServiceByKey(fbKey: string) {
  return useQuery<Service | undefined>(
    ['serviceByKey', fbKey],
    () => ServiceData.getTaskByFBKey(fbKey),
    { enabled: Boolean(fbKey) },
  );
}

const invalidateServices = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries(['services']);
  queryClient.invalidateQueries(['userServices']);
};

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation((service: Service) => ServiceData.createService(service), {
    onSuccess: () => invalidateServices(queryClient),
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation((service: Service) => ServiceData.updateService(service), {
    onSuccess: () => invalidateServices(queryClient),
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation((firebaseKey: string) => ServiceData.deleteService(firebaseKey), {
    onSuccess: () => invalidateServices(queryClient),
  });
}
