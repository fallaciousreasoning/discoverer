import { History } from 'history';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import { Store, StoreEnhancer, applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import SagaManager from 'src/sagas';
import { ApplicationState, reducer } from 'src/store';

export default function configureStore(history: History, initialState?: ApplicationState) {
    // Build middleware. These are functions that can process the actions before they reach the store.
    // If devTools is installed, connect to it
    const devToolsExtension = (window as any).devToolsExtension as () => StoreEnhancer;
    const sagaMiddleware = createSagaMiddleware();

    const createStoreWithMiddleware = compose(
        applyMiddleware(sagaMiddleware),
        applyMiddleware(routerMiddleware(history)),
        devToolsExtension ? devToolsExtension() : (f: any) => f
    )(createStore);

    // Combine all reducers and instantiate the app-wide store instance
    const allReducers = buildRootReducer(reducer);
    const store = createStoreWithMiddleware(allReducers, initialState) as Store<ApplicationState>;

    let sagaManager = new SagaManager(sagaMiddleware, store);
    sagaManager.startSagas();
    
    // Enable Webpack hot module replacement for reducers
    if (module.hot) {
        module.hot.accept('src/store', () => {
            const nextRootReducer = require('.');
            store.replaceReducer(buildRootReducer(nextRootReducer.reducers));
        });

        module.hot.accept('src/sagas', () => {
            sagaManager.cancelSagas();
            let s = (require('src/sagas') as any).default;
            sagaManager = new s(sagaMiddleware, store);
            sagaManager.startSagas();
        })
    }
    
    return store;
};

function buildRootReducer(allReducers: any) {
    return combineReducers<ApplicationState>({ ...allReducers, outing: routerReducer });
}
