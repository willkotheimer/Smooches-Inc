import React from 'react';

export default function CheckoutTable({ array }) {
  return (
    <table className="table table-hover table-striped table-dark">
    <thead>
      <tr>
        <th scope="col">Title</th>
        <th scope="col">Price</th>
      </tr>
    </thead>
    <tbody>

    {array}
         
      
    </tbody>
  </table>
  );
}

