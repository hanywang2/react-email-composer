import React from 'react';
import ReactDOM from 'react-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <GoogleReCaptchaProvider reCaptchaKey="6LeqTrIaAAAAAAr51wh4PSSWu8PQrLSBm_wprLe8">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleReCaptchaProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
