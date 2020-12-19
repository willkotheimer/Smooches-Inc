import React from 'react';

export default class YourOrder extends React.Component {
    state = {
        services: this.props.services,
        order: this.props.order
    }

  renderOrder = key => {
    const task = this.props.services[key];
    const count = this.props.order[key];
    const myKey = `${key}-${Date.now()}`
    return (<><li key={myKey}>
           {count} {task.name} <button className="removeItemButton" onClick={() => this.props.removeFromOrder(key)}><strong>-</strong></button>
          </li></>);
    }

  render() {
    const orderIds = Object.keys(this.props.order);
    
    return (
      <>
            <div className="d-flex flex-wrap container">
              <ul className="cart">{orderIds && orderIds.map(this.renderOrder)}</ul>
            </div>
            <div className="total"><div className="fullLine"></div></div>
            <button onClick={() => this.props.submitOrder()} className="requestCheckoutButton">Place Order</button>
            { this.props.submitted && <div className="orderConfirm"><h3>Order Confirmed</h3><br/>(Please check dashboard for Progress)</div>}
      </>
    );
  }
}
