import Card from '../../ui/Card';

export default function ConfirmCard() {
  return (
    <Card tone="blue" className="text-center">
      <p className="font-bold">Thank you for your order!</p>
      <p className="text-sm text-muted">Please be patient — your order is being processed.</p>
    </Card>
  );
}
