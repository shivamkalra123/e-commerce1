import React, { useContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import ShopContextProvider, { ShopContext } from './context/ShopContext.jsx';
import { assets } from './assets/assets.js';

const Root = () => {
  const { products } = useContext(ShopContext);

  // ⛔ Block entire site until products load
  if (products === null) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <img src={assets.logo} alt="Logo" style={{ height: '220px' }} />
        <div style={{ marginTop: '16px', fontSize: '22px', fontWeight: 600 }}>
          🛒 Loading...
        </div>
      </div>
    );
  }

  return <App />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ShopContextProvider>
      <Root />
    </ShopContextProvider>
  </BrowserRouter>
);
