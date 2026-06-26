import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ReviewData from '../helpers/data/reviewData';
import type { Review } from '../types';

export function useAllReviews() {
  return useQuery<Record<string, Review>>(['reviews'], () => ReviewData.getAllReviews());
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation((review: Review) => ReviewData.createReview(review), {
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews']);
      queryClient.invalidateQueries(['todos']);
      queryClient.invalidateQueries(['completedUnreviewed']);
    },
  });
}
