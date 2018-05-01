import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { AppContainer } from 'react-hot-loader'

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';

console.log(ConnectedRouter);

import createHistory from 'history/createBrowserHistory';
import configureStore from './store/configureStore';

import routes from './Routes';

const history = createHistory();
const store = configureStore(history, {});

(window as any).store = store;
(window as any).rHistory = history;

class Discoverer extends AppContainer {

}

function renderApp() {
    ReactDOM.render(
        <Discoverer>
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    {routes}
                </ConnectedRouter>
            </Provider>
        </Discoverer>,
        document.getElementById('react-app')
    );
}

renderApp();