import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Kitchen from './pages/Kitchen';
import { Toaster } from './components/ui/toaster';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Kitchen />
      <Toaster />
    </BrowserRouter>
  </React.StrictMode>,
); 