import Card from '../ui/Card';
import { useServiceByKey } from '../data/useServiceData';
import type { Review } from '../types';

interface Props {
  service: string;
  previousReview: Review;
  otherName: string;
}

export default function YourPreviousReviews({ service, previousReview, otherName }: Props) {
  const { data: serviceInfo } = useServiceByKey(service);
  const stars = parseInt(previousReview.reviewStars, 10) || 5;

  return (
    <Card tone="blue">
      <p className="text-sm">&ldquo;{previousReview.reviewText}&rdquo;</p>
      <div className="my-1.5 text-accent">
        {[...Array(stars)].map((_, i) => (
          <i key={i} className="fa-solid fa-heart mr-0.5" aria-hidden />
        ))}
      </div>
      <p className="text-xs text-muted">
        to <strong className="text-foreground">{otherName.split(' ')[0]}</strong> ·{' '}
        {serviceInfo && serviceInfo.name}
      </p>
    </Card>
  );
}
