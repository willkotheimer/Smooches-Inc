import React from 'react';

export default class YourOrder extends React.Component {
    state = {
        services: this.props.services,
        order: this.props.order
    }

  renderOrder = key => {
    const task = this.props.services[key];
    const count = this.props.order[key];
    return (<><li key={key}>
           {count} {task.name}
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
          
      </>
    );
  }
}
