import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize,
  getConfig,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import { IntlProvider } from 'react-intl';
import ReactDOM from 'react-dom';

import Header, { messages as headerMessages } from '@edx/frontend-component-header';
import Footer, { messages as footerMessages } from '@edx/frontend-component-footer';

import Main from 'features/Main';
import { store } from './store';

import appMessages from './i18n';

import './index.scss';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <IntlProvider locale="en">
      <AppProvider store={store}>
        <BrowserRouter basename={getConfig().INSTRUCTOR_PORTAL_PATH}>
          <Header />
          <Switch>
            <Route path="/" exact>
              <Main />
            </Route>
          </Switch>
          <Footer />
        </BrowserRouter>
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
    headerMessages,
    footerMessages,
  ],
  requireAuthenticatedUser: true,
});
