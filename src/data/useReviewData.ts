import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAPIRequest } from './useAPIRequest';
import { apiRoutes } from './apiRoutes';
import type { Review } from '../types';

export function useAllReviews() {
  const { get } = useAPIRequest();
  return useQuery<Record<string, Review>>(
    ['reviews'],
    async () => (await get<Record<string, Review> | null>(apiRoutes.reviews)) ?? {},
  );
}

export function useCreateReview() {
  const { post, patch } = useAPIRequest();
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, Review>(
    async (review) => {
      const res = await post<{ name: string }>(apiRoutes.reviews, review, {
        successMessage: 'Review submitted.',
        errorMessage: 'Review not submitted.',
      });
      await patch(apiRoutes.review(res.name), { firebaseKey: res.name });
      // mark the related todo reviewed
      return patch(apiRoutes.todo(review.toDoid), { reviewId: res.name });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reviews']);
        queryClient.invalidateQueries(['todos']);
        queryClient.invalidateQueries(['completedUnreviewed']);
      },
    },
  );
}
