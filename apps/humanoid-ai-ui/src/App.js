import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './authentication/msal-config';
import { MsalProvider } from '@azure/msal-react';

const pca = new PublicClientApplication(msalConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MsalProvider instance={pca}>
      <BrowserRouter> {/* Router should be here only */}
        <App />
      </BrowserRouter>
    </MsalProvider>
  </React.StrictMode>
);

reportWebVitals();
