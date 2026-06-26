import React from 'react';

interface Props {
  array: React.ReactNode;
}

export default function CheckoutTable({ array }: Props) {
  return (
    <table className="table table-hover table-striped table-dark">
      <thead>
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
        </tr>
      </thead>
      <tbody>{array}</tbody>
    </table>
  );
}
