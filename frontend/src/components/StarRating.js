import { useState } from 'react';

// Interactive 1-5 star picker used by normal users to submit / edit a rating.
export default function StarRating({ value, onChange, disabled }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-picker">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          disabled={disabled}
          className={`star-btn${n <= (hover || value) ? ' filled' : ''}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          aria-label={`Rate ${n} out of 5`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
