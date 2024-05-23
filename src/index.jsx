import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import { IntlProvider } from 'react-intl';
import ReactDOM from 'react-dom';

import Main from 'features/Main';
import { store } from './store';

import appMessages from './i18n';

import './index.scss';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <IntlProvider locale="en">
      <AppProvider store={store}>
        <Main />
      </AppProvider>
    </IntlProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  messages: [
    appMessages,
  ],
  requireAuthenticatedUser: true,
});
