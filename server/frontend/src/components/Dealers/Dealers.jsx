
import React, { useState, useEffect } from 'react';
import './Dealers.css';
import '../assets/style.css';
import Header from '../Header/Header';
import review_icon from '../assets/reviewicon.png';

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [allDealers, setAllDealers] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedState, setSelectedState] = useState('All');

  useEffect(() => {
    const getDealers = async () => {
      try {
        const response = await fetch('/djangoapp/dealers/');

        if (!response.ok) {
          throw new Error('Unable to load dealerships.');
        }

        const data = await response.json();
        const dealers = data.dealerships || [];

        setAllDealers(dealers);
        setDealersList(dealers);

        const uniqueStates = [
          ...new Set(dealers.map((dealer) => dealer.state)),
        ];

        setStates(uniqueStates);
      } catch (err) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    getDealers();
  }, []);

  const filterDealers = (state) => {
    setSelectedState(state);

    if (state === 'All') {
      setDealersList(allDealers);
    } else {
      setDealersList(
        allDealers.filter((dealer) => dealer.state === state)
      );
    }
  };

  const isLoggedIn = sessionStorage.getItem('username') !== null;

  return (
    <div>
      <Header />

      <h2>Dealerships</h2>

      {loading ? (
        <p>Loading dealerships...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Dealer Name</th>
              <th>City</th>
              <th>Address</th>
              <th>Zip</th>
              <th>
                <select
                  name="state"
                  id="state"
                  value={selectedState}
                  onChange={(e) => filterDealers(e.target.value)}
                >
                  <option value="All">All States</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </th>

              {isLoggedIn && <th>Review Dealer</th>}
            </tr>
          </thead>

          <tbody>
            {dealersList.map((dealer) => (
              <tr key={dealer.id}>
                <td>{dealer.id}</td>
                <td>
                  <a href={`/dealer/${dealer.id}`}>
                    {dealer.full_name}
                  </a>
                </td>
                <td>{dealer.city}</td>
                <td>{dealer.address}</td>
                <td>{dealer.zip}</td>
                <td>{dealer.state}</td>

                {isLoggedIn && (
                  <td>
                    <a href={`/postreview/${dealer.id}`}>
                      <img
                        src={review_icon}
                        className="review_icon"
                        alt="Post Review"
                      />
                    </a>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!loading && !error && dealersList.length === 0 && (
        <p>No dealerships found.</p>
      )}
    </div>
  );
};

export default Dealers;
