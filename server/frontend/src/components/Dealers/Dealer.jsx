
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import './Dealers.css';
import '../assets/style.css';

import positive_icon from '../assets/positive.png';
import neutral_icon from '../assets/neutral.png';
import negative_icon from '../assets/negative.png';
import review_icon from '../assets/reviewbutton.png';

import Header from '../Header/Header';

const Dealer = () => {
  const { id } = useParams();

  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDealerData = async () => {
      try {
        const dealerResponse = await fetch(
          `/djangoapp/dealer/${id}/`
        );

        if (!dealerResponse.ok) {
          throw new Error('Unable to load dealership details.');
        }

        const dealerData = await dealerResponse.json();
        setDealer(dealerData.dealer);

        const reviewsResponse = await fetch(
          `/djangoapp/dealer/${id}/reviews/`
        );

        if (!reviewsResponse.ok) {
          throw new Error('Unable to load dealership reviews.');
        }

        const reviewsData = await reviewsResponse.json();
        const dealerReviews = reviewsData.reviews || [];

        setReviews(dealerReviews);
        setUnreviewed(dealerReviews.length === 0);
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    fetchDealerData();
  }, [id]);

  const senti_icon = (sentiment) => {
    if (sentiment === 'positive') return positive_icon;
    if (sentiment === 'negative') return negative_icon;
    return neutral_icon;
  };

  return (
    <div style={{ margin: '20px' }}>
      <Header />

      {loading ? (
        <p>Loading dealership details...</p>
      ) : error ? (
        <p>{error}</p>
      ) : dealer ? (
        <>
          <div style={{ marginTop: '10px' }}>
            <h1 style={{ color: 'grey' }}>
              {dealer.full_name}

              {sessionStorage.getItem('username') && (
                <Link to={`/postreview/${id}`}>
                  <img
                    src={review_icon}
                    style={{
                      width: '10%',
                      marginLeft: '10px',
                      marginTop: '10px',
                    }}
                    alt="Post Review"
                  />
                </Link>
              )}
            </h1>

            <h4 style={{ color: 'grey' }}>
              {dealer.city}, {dealer.address}, Zip - {dealer.zip},{' '}
              {dealer.state}
            </h4>
          </div>

          <div className="reviews_panel">
            {unreviewed ? (
              <div>No reviews yet!</div>
            ) : (
              reviews.map((review) => (
                <div className="review_panel" key={review.id}>
                  <img
                    src={senti_icon(review.sentiment)}
                    className="emotion_icon"
                    alt={`${review.sentiment || 'neutral'} sentiment`}
                  />

                  <div className="review">{review.review}</div>

                  <div className="reviewer">
                    {review.name} {review.car_make} {review.car_model}{' '}
                    {review.car_year}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <p>Dealership not found.</p>
      )}
    </div>
  );
};

export default Dealer;
