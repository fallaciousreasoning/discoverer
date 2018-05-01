import { createStore, applyMiddleware, compose, combineReducers, Store, StoreEnhancer } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';

import { ApplicationState, reducer } from './';
import { History } from 'history';

export default function configureStore(history: History, initialState?: ApplicationState) {
    // Build middleware. These are functions that can process the actions before they reach the store.
    // If devTools is installed, connect to it
    const devToolsExtension = (window as any).devToolsExtension as () => StoreEnhancer;

    const createStoreWithMiddleware = compose(
        applyMiddleware(routerMiddleware(history)),
        devToolsExtension ? devToolsExtension() : (f: any) => f
    )(createStore);

    // Combine all reducers and instantiate the app-wide store instance
    const allReducers = buildRootReducer(reducer);
    const store = createStoreWithMiddleware(allReducers, initialState) as Store<ApplicationState>;
    
    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
        module.hot.accept('./', () => {
            const nextRootReducer = require('.');
            store.replaceReducer(buildRootReducer(nextRootReducer.reducers));
        });
    }
    
    return store;
};

function buildRootReducer(allReducers: any) {
    return combineReducers<ApplicationState>({ ...allReducers, outing: routerReducer });
}
