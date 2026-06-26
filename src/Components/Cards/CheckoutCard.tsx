import type { Service } from '../../types';

interface Props {
  service: Service;
  addToOrder: (index: number | string) => void;
  index: number | string;
}

export default function ServiceCard({ service, addToOrder, index }: Props) {
  return (
    <div key={index} className="d-flex">
      {/* FIXME: `fireBaseKey` is a typo for `firebaseKey`; preserved from original. */}
      <div className="card-body" id={(service as any).fireBaseKey}>
        <h5 className="card-title">
          <i>{service.name}</i>
        </h5>
        <p className="card-text">{service.description}</p>
      </div>
      <button className="checkoutButton" onClick={() => addToOrder(index)}>
        <i className="far fa-heart">+</i>
      </button>
    </div>
  );
}
