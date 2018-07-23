import createHistory from 'history/createBrowserHistory';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import * as Routes from './Routes';
import configureStore from './store/configureStore';

const config = require('config.json');

let routes = Routes.default;

export const history = createHistory({ basename: config.basename });
export const store = configureStore(history, {} as any);

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

// Allow Hot Module Replacement
if (module.hot) {
    module.hot.accept('./Routes', () => {
        routes = require('./Routes').default;
        renderApp();
    });
}