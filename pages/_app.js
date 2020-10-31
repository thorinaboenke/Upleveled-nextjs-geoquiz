import { Fragment } from 'react';
import { globalStyles } from '../styles/globalstyles';

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      {globalStyles}
      <Component {...pageProps} />
    </Fragment>
  );
}

export default MyApp;
