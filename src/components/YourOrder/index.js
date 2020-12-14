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
           {count} {task.name} <button onClick={() => this.props.removeFromOrder(key)}><strong>[x]</strong></button>
          </li></>);
    }

  render() {
    const orderIds = Object.keys(this.props.order);
    
    return (
      <>
       
            <div>Checkout:</div>
            
            <div className="d-flex flex-wrap container">
              <ul>{orderIds && orderIds.map(this.renderOrder)}</ul>
            </div>
            <div className="total">_____________________</div>
            <button onClick={() => this.props.submitOrder()} className="btn btn-danger">Submit order</button>
            { this.props.submitted && <div className="orderConfirm"><h3>Order Confirmed</h3><br/>(Please check dashboard for Progress)</div>}
      </>
    );
  }
}
