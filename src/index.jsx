import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import { IntlProvider } from 'react-intl';
import {createRoot} from 'react-dom/client';

import Main from 'features/Main';
import { store } from './store';

import appMessages from './i18n';

import './index.scss';

const container = document.getElementById('root');
const root = createRoot(container);

subscribe(APP_READY, () => {
  root.render(
    <IntlProvider locale="en">
      <AppProvider store={store}>
        <Main />
      </AppProvider>
    </IntlProvider>
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  root.render(<ErrorPage message={error.message} />);
});

initialize({
  messages: [
    appMessages,
  ],
  requireAuthenticatedUser: true,
});
