```jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';

const PostReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState('');
  const [purchase, setPurchase] = useState('true');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [carMake, setCarMake] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [loading, setLoading] = useState(false);

  const submitReview = async (e) => {
    e.preventDefault();

    const username = sessionStorage.getItem('username');

    if (!username) {
      alert('Please log in before submitting a review.');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/djangoapp/add_review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: username,
          dealership: Number(id),
          review: review,
          purchase: purchase === 'true',
          purchase_date: purchaseDate,
          car_make: carMake,
          car_model: carModel,
          car_year: Number(carYear),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Review submitted successfully!');
        navigate(`/dealer/${id}`);
      } else {
        alert(data.error || 'Unable to submit review.');
      }
    } catch (error) {
      alert('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />

      <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px' }}>
        <h2>Write a Dealership Review</h2>
        <p>Dealership ID: {id}</p>

        <form onSubmit={submitReview}>
          <div style={{ marginBottom: '15px' }}>
            <label>Review</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
              rows="5"
              style={{ display: 'block', width: '100%', marginTop: '5px' }}
              placeholder="Write your review here"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Did you purchase a car?</label>
            <select
              value={purchase}
              onChange={(e) => setPurchase(e.target.value)}
              style={{ display: 'block', marginTop: '5px' }}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Purchase Date</label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              required
              style={{ display: 'block', marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Car Make</label>
            <input
              type="text"
              value={carMake}
              onChange={(e) => setCarMake(e.target.value)}
              required
              style={{ display: 'block', width: '100%', marginTop: '5px' }}
              placeholder="e.g. Toyota"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Car Model</label>
            <input
              type="text"
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              required
              style={{ display: 'block', width: '100%', marginTop: '5px' }}
              placeholder="e.g. Corolla"
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Car Year</label>
            <input
              type="number"
              min="1900"
              max="2100"
              value={carYear}
              onChange={(e) => setCarYear(e.target.value)}
              required
              style={{ display: 'block', width: '100%', marginTop: '5px' }}
              placeholder="e.g. 2025"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/dealer/${id}`)}
            style={{ marginLeft: '10px' }}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostReview;
```
