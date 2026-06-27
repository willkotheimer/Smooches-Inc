import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAPIRequest } from './useAPIRequest';
import { apiRoutes } from './apiRoutes';
import type { Review } from '../types';

export function useAllReviews() {
  const { get } = useAPIRequest();
  // Keyed by firebaseKey to match the existing consumers (they Object.values it).
  return useQuery<Record<string, Review>>(['reviews'], async () => {
    const list = await get<Review[]>(apiRoutes.reviews);
    return Object.fromEntries(list.map((r) => [r.firebaseKey, r]));
  });
}

export function useCreateReview() {
  const { post, patch } = useAPIRequest();
  const queryClient = useQueryClient();
  return useMutation<Review, Error, Review>(
    async (review) => {
      const created = await post<Review>(apiRoutes.reviews, review, {
        successMessage: 'Review submitted.',
        errorMessage: 'Review not submitted.',
      });
      // Mark the related todo reviewed (links it to this review).
      await patch(apiRoutes.todo(review.toDoid), { reviewId: created.firebaseKey });
      return created;
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
