import { Fragment } from 'react';
import { globalStyles } from '../styles/GlobalStyles';

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      {globalStyles}
      <Component {...pageProps} />
    </Fragment>
  );
}

export default MyApp;
