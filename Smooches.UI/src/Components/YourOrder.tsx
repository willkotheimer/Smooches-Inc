import type { Service } from '../types';

interface Props {
  services: Record<string, Service>;
  order: Record<string, number>;
  removeFromOrder: (key: string) => void;
  submitOrder: () => void;
  submitted?: boolean;
}

export default function YourOrder({
  services,
  order,
  removeFromOrder,
  submitOrder,
  submitted,
}: Props) {
  const orderIds = Object.keys(order);

  const renderOrder = (key: string) => {
    const task = services[key];
    const count = order[key];
    const myKey = `${key}-${Date.now()}`;
    return (
      <>
        <li key={myKey}>
          {count} {task.name}{' '}
          <button className="removeItemButton" onClick={() => removeFromOrder(key)}>
            <strong>-</strong>
          </button>
        </li>
      </>
    );
  };

  return (
    <>
      <h3 className="checkoutHeader">&nbsp;My Checkout</h3>
      <div className="d-flex flex-wrap container">
        <ul className="cart">{orderIds && orderIds.map(renderOrder)}</ul>
      </div>
      <div className="total">
        <div className="fullLine"></div>
      </div>
      <button onClick={() => submitOrder()} className="requestCheckoutButton">
        Place Order
      </button>
      {submitted && (
        <div className="orderConfirm">
          <h3>Order Confirmed</h3>
          <br />
          (Please check dashboard for Progress)
        </div>
      )}
    </>
  );
}
