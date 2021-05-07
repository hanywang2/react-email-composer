import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6LeqTrIaAAAAAAr51wh4PSSWu8PQrLSBm_wprLe8">
      <Component {...pageProps} />
    </GoogleReCaptchaProvider>
  );
}

export default MyApp;
