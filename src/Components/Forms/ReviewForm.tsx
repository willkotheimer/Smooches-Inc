import { useFormik } from 'formik';
import * as Yup from 'yup';
import getUser from '../../helpers/data/authData';
import Button from '../../ui/Button';
import { useCreateReview } from '../../data/useReviewData';
import type { Review, ToDo } from '../../types';

interface Props {
  toDoId?: string;
  taskid?: string;
  toDo?: ToDo;
  review?: Review;
  firebaseKey?: string;
  onUpdate: () => void;
  toggle?: () => void; // injected by AppModal
}

const validationSchema = Yup.object({
  reviewText: Yup.string().required('Please write a review'),
  reviewStars: Yup.string().required('Please choose a rating'),
});

const starOptions = ['1', '2', '3', '4', '5'];

export default function ReviewForm({ toDoId, taskid, toDo, review, onUpdate, toggle }: Props) {
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
    validationSchema,
    onSubmit: (values) => {
      createReview.mutate(values, {
        onSuccess: () => {
          onUpdate();
          toggle?.();
        },
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="reviewText" className="field-label">
          Your review
        </label>
        <textarea
          id="reviewText"
          name="reviewText"
          rows={4}
          className="field"
          value={formik.values.reviewText}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.reviewText && formik.errors.reviewText && (
          <p className="field-error">{formik.errors.reviewText}</p>
        )}
      </div>
      <div>
        <label htmlFor="reviewStars" className="field-label">
          Rating
        </label>
        <select
          id="reviewStars"
          name="reviewStars"
          className="field"
          value={formik.values.reviewStars}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="">Choose…</option>
          {starOptions.map((s) => (
            <option key={s} value={s}>
              {s} ♥
            </option>
          ))}
        </select>
        {formik.touched.reviewStars && formik.errors.reviewStars && (
          <p className="field-error">{formik.errors.reviewStars}</p>
        )}
      </div>
      <Button type="submit">Submit Review</Button>
    </form>
  );
}
