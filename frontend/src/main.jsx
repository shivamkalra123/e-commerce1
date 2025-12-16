import React, { useContext } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider, { ShopContext } from './context/ShopContext.jsx'
import {assets} from './assets/assets.js'

const Root = () => {
  const { loading } = useContext(ShopContext)

  if (loading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        

    
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '24px',
            fontWeight: '600',
            flexDirection:'column'
          }}
        >
          <img src={assets.logo} alt="Logo" style={{ height: '220px' }} />
          🛒 Loading...
        </div>
      </div>
    )
  }

  return <App />
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ShopContextProvider>
      <Root />
    </ShopContextProvider>
  </BrowserRouter>
)
