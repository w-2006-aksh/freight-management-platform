import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Provider} from 'react-redux'
import App from './App.jsx'
import store from './redux/store.js'
import {BrowserRouter} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     <Provider store={store}>
      <App />
       <ToastContainer />
     </Provider>
   
    
    </BrowserRouter>
  </StrictMode>
)
