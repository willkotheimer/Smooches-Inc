import React from 'react';
import type { Service } from '../../types';

interface Props {
  services: Record<string, Service>;
  order: Record<string, number>;
  removeFromOrder: (key: string) => void;
  submitOrder: () => void;
  submitted?: boolean;
}

interface State {
  services: Record<string, Service>;
  order: Record<string, number>;
}

export default class YourOrder extends React.Component<Props, State> {
  state: State = {
    services: this.props.services,
    order: this.props.order,
  };

  renderOrder = (key: string) => {
    const task = this.props.services[key];
    const count = this.props.order[key];
    const myKey = `${key}-${Date.now()}`;
    return (
      <>
        <li key={myKey}>
          {count} {task.name}{' '}
          <button className="removeItemButton" onClick={() => this.props.removeFromOrder(key)}>
            <strong>-</strong>
          </button>
        </li>
      </>
    );
  };

  render() {
    const orderIds = Object.keys(this.props.order);

    return (
      <>
        <h3 className="checkoutHeader">&nbsp;My Checkout</h3>
        <div className="d-flex flex-wrap container">
          <ul className="cart">{orderIds && orderIds.map(this.renderOrder)}</ul>
        </div>
        <div className="total">
          <div className="fullLine"></div>
        </div>
        <button onClick={() => this.props.submitOrder()} className="requestCheckoutButton">
          Place Order
        </button>
        {this.props.submitted && (
          <div className="orderConfirm">
            <h3>Order Confirmed</h3>
            <br />
            (Please check dashboard for Progress)
          </div>
        )}
      </>
    );
  }
}
