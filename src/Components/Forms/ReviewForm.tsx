import { useFormik } from 'formik';
import getUser from '../../helpers/data/authData';
import { useCreateReview } from '../../data/useReviewData';
import type { Review, ToDo } from '../../types';

interface Props {
  toDoId?: string;
  taskid?: string;
  toDo?: ToDo;
  review?: Review;
  firebaseKey?: string;
  onUpdate: () => void;
}

const starOptions = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
];

export default function ReviewForm({ toDoId, taskid, toDo, review, onUpdate }: Props) {
  const createReview = useCreateReview();

  const formik = useFormik<Review>({
    enableReinitialize: true,
    initialValues: {
      dateTime: new Date().toDateString(),
      toDoid: toDoId || '',
      serviceid: taskid || '',
      firebaseKey: toDo?.firebaseKey || '',
      reviewText: review?.reviewText || '',
      reviewStars: review?.reviewStars || '',
      uid: getUser(),
    },
    onSubmit: (values) => {
      createReview.mutate(values, { onSuccess: () => onUpdate() });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="form-group">
        <textarea
          name="reviewText"
          value={formik.values.reviewText}
          onChange={formik.handleChange}
          className="form-control"
          id="leaveReview"
          rows={4}
          required
        ></textarea>
      </div>
      <label htmlFor="leaveRating">Leave a Rating</label>
      <select
        name="reviewStars"
        id="reviewStars"
        className="selectpicker"
        value={formik.values.reviewStars}
        onChange={formik.handleChange}
      >
        {starOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button type="submit">Submit</button>
    </form>
  );
}
