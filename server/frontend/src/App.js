import React from 'react';
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./components/Login/Login"; 
import Register from "./components/Register/Register";
import Dealers from './components/Dealers/Dealers';
import Dealer from "./components/Dealers/Dealer";
import PostReview from "./components/Dealers/PostReview";
// 🌐 COMMON NAVBAR LAYOUT COMPONENT
const Layout = ({ children }) => {
  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 40px',
    backgroundColor: '#74dbef',
    fontFamily: 'sans-serif'
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#333',
    marginRight: '20px',
    fontSize: '1.1rem',
    fontWeight: '500'
  };

  return (
    <div>
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={{ margin: 0, marginRight: '40px', fontSize: '2rem', color: '#111' }}>Dealerships</h1>
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/about" style={linkStyle}>About Us</Link>
          <Link to="/contact" style={linkStyle}>Contact Us</Link>
          <Link to="/dealers" className="btn btn-primary">View Dealerships</Link>
        </div>
        <div>
          <Link to="/login" style={linkStyle}>Login</Link>
          <Link to="/register" style={{ ...linkStyle, marginRight: 0 }}>Register</Link>
        </div>
      </nav>
      <div>{children}</div>
    </div>
  );
};

// 🚗 1. MAIN HOME PAGE COMPONENT
const Home = () => {
  return (
    <Layout>
      <div style={{ fontFamily: 'sans-serif', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ maxWidth: '800px', border: '1px solid #e0e0e0', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          <img 
            src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=900&q=80" 
            alt="Car Dealership Lot" 
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
          <div style={{ padding: '30px 20px', backgroundColor: '#fff' }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '1.8rem', fontWeight: 'normal' }}>Welcome to our Dealerships!</h2>
            <Link 
              to="/dealers" 
              style={{ 
                display: 'inline-block',
                textDecoration: 'none',
                backgroundColor: '#3ae3f2', 
                color: '#111', 
                border: 'none', 
                padding: '12px 24px', 
                fontSize: '1.1rem', 
                borderRadius: '4px', 
                cursor: 'pointer', 
                fontWeight: '500' 
              }}
            >
              View Dealerships
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// 👥 2. ABOUT US COMPONENT
const AboutUs = () => {
  const cards = [
    { 
      id: 1, 
      name: "Person1", 
      title: "Person1 Title", 
      desc: "Some text that explains the person1 in about 2 short sentences.",
      image: "https://cdn.corenexis.com/f/FCFCc3P8bcP.jpg" 
    },
    { 
      id: 2, 
      name: "Person2", 
      title: "Person2 Title", 
      desc: "Some text that explains the person2 in about 2 short sentences.",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    { 
      id: 3, 
      name: "Person3", 
      title: "Person3 Title", 
      desc: "Some text that explains the person3 in about 2 short sentences.",
      image: "https://randomuser.me/api/portraits/men/46.jpg"
    }
  ];

  return (
    <Layout>
      <div style={{ fontFamily: 'sans-serif', padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '10px' }}>About Us</h1>
        <p style={{ textAlign: 'center', color: '#333', marginBottom: '40px', fontSize: '1.1rem' }}>
          Welcome to Best Cars dealership, home to the best cars in North America. We deal in sale of domestic and imported cars at reasonable prices.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {cards.map(c => (
            <div key={c.id} style={{ border: '1px solid #e0e0e0', borderRadius: '4px', width: '300px', padding: '20px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <img 
                src={c.image} 
                alt={c.name} 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  objectFit: 'cover', 
                  margin: '0 auto 20px', 
                  display: 'block',
                  border: '2px solid #e0e0e0'
                }} 
              />
              <div style={{ backgroundColor: '#4b3b72', color: 'white', padding: '8px', fontWeight: 'bold', marginBottom: '15px', borderRadius: '2px' }}>
                {c.name}
              </div>
              <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{c.title}</h4>
              <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.4' }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

// 📞 3. CONTACT US COMPONENT
const ContactUs = () => {
  return (
    <Layout>
      <div style={{ fontFamily: 'sans-serif', padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ border: '1px solid #e0e0e0', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          <div style={{ height: '250px', backgroundColor: '#e0e0e0', overflow: 'hidden' }}>
            <img 
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80" 
              alt="Car Interior" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ display: 'flex', padding: '40px 20px', alignItems: 'center' }}>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" style={{ width: '120px', height: '120px', fill: '#4cd137' }}>
                <path d="M12 2C6.48 2 2 6.48 2 12v5c0 1.1.9 2 2 2h3v-8H4v-1c0-4.41 3.59-8 8-8s8 3.59 8 8v1h-3v8h3c1.1 0 2-.9 2-2v-5c0-5.52-4.48-10-10-10z"/>
              </svg>
            </div>
            <div style={{ width: '1px', backgroundColor: '#ccc', height: '180px', margin: '0 20px' }}></div>
            <div style={{ flex: 1, paddingLeft: '20px', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '12px' }}><strong style={{ color: '#4a69bd' }}>Contact Customer Service</strong><br /><span style={{ color: '#555' }}>support@bestcars.com</span></div>
              <div style={{ marginBottom: '12px' }}><strong style={{ color: '#4a69bd' }}>Contact our National Advertising team</strong><br /><span style={{ color: '#555' }}>NationalSales@bestcars.com</span></div>
              <div style={{ marginBottom: '12px' }}><strong style={{ color: '#4a69bd' }}>Contact our Public Relations team</strong><br /><span style={{ color: '#555' }}>PR@bestcars.com</span></div>
              <div style={{ marginBottom: '12px' }}><strong style={{ color: '#4a69bd' }}>Contact the bestcars.com offices</strong><br /><span style={{ color: '#555' }}>312-611-1111</span></div>
              <div><strong style={{ color: '#4a69bd' }}>Become a bestcars.com car dealer</strong><br /><span style={{ color: '#555' }}>Visit growwithbestcars.com</span></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// ⚙️ ROUTING ENGINE CONTAINER
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/dealers" element={<Dealers />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/dealers" element={<Dealers />} />
{/* 🟢 Add the individual dealer view route here: */}
<Route path="/dealer/:id" element={<Dealer />} />
<Route path="/postreview/:id" element={<PostReview />} />
    </Routes>
  );
}

export default App;