import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);
  const review_icon = "https://cdn.pixabay.com/photo/2016/09/16/09/20/feedback-1673550_1280.png";

  // Base configurations pointing to your Django server local port
  const base_url = "http://127.0.0.1:8000";
  const dealer_url = `${base_url}/djangoapp/get_dealers`;
  
  // The state filtering function builds a clean, non-accumulating URL path 
  const filterDealers = async (state) => {
    let dealer_url_by_state = state === "All" ? dealer_url : `${base_url}/djangoapp/get_dealers/${state}`;
    
    try {
      const res = await fetch(dealer_url_by_state, {
        method: "GET"
      });
      const retobj = await res.json();
      if(retobj.status === 200) {
        let state_dealers = Array.from(retobj.dealers || []);
        setDealersList(state_dealers);
      }
    } catch (err) {
      console.error("Error filtering dealers:", err);
    }
  }

  // Fetch all dealerships on initial mount loading pipeline
  const get_dealers = async () => {
    try {
      const res = await fetch(dealer_url, {
        method: "GET"
      });
      const retobj = await res.json();
      if(retobj.status === 200) {
        let all_dealers = Array.from(retobj.dealers || []);
        let extracted_states = [];
        
        all_dealers.forEach((dealer) => {
          if (dealer.state) {
            extracted_states.push(dealer.state);
          }
        });

        setStates(Array.from(new Set(extracted_states)));
        setDealersList(all_dealers);
      }
    } catch (err) {
      console.error("Error fetching dealers:", err);
    }
  }

  useEffect(() => {
    get_dealers();
  }, []);  

  let isLoggedIn = sessionStorage.getItem("username") != null;

  return (
    <div>
      <Header/>
      <table className='table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dealer Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Zip</th>
            <th>
              <select name="state" id="state" onChange={(e) => filterDealers(e.target.value)}>
                <option value="" selected disabled hidden>State</option>
                <option value="All">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>        
            </th>
            {isLoggedIn && <th>Review Dealer</th>}
          </tr>
        </thead>
        <tbody>
          {dealersList.map(dealer => (
            <tr key={dealer['id'] || dealer['_id']}>
              <td>{dealer['id']}</td>
              <td><a href={'/dealer/' + dealer['id']}>{dealer['full_name']}</a></td>
              <td>{dealer['city']}</td>
              <td>{dealer['address']}</td>
              <td>{dealer['zip']}</td>
              <td>{dealer['state']}</td>
              
              {/* 🟢 Render image tracker link if user is logged in */}
              {isLoggedIn && (
                <td>
                  <a href={`/postreview/${dealer['id']}`}>
                    <img 
                      src={review_icon} 
                      className="review_icon" 
                      alt="Post Review" 
                      style={{ width: '36px', height: 'auto', display: 'block', margin: '0 auto' }} 
                    />
                  </a>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dealers;