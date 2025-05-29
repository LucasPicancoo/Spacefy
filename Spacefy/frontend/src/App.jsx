import React from 'react'
import Router from './Routes/Router'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FavoriteProvider } from './Contexts/FavoriteContext';

const App = () => {
  return (
    <FavoriteProvider>
      <Router />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </FavoriteProvider>
  )
}

export default App