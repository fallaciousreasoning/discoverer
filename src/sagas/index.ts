import { all, cancel, fork, take } from 'redux-saga/effects';
import { actionCreators, ActionType } from '../store/actions';
import generation from './generation';
import link from './link';


function* rootSaga() {
    yield all([
        generation(),
        link(),
    ]);
}

function createAbortableSaga(saga) {
    return function* () {
        const sagaTask = yield fork(saga);

        yield take(ActionType.CANCEL_SAGAS_HMR);
        yield cancel(sagaTask);
    };
}

class SagaManager {
    sagaMiddleware;
    store;
    constructor(sagaMiddleware, store) {
        this.sagaMiddleware = sagaMiddleware;
        this.store = store;
    }

    startSagas() {
        this.sagaMiddleware.run(createAbortableSaga(rootSaga));
    }

    cancelSagas() {
        this.store.dispatch(actionCreators.cancelSagasHMR());
    }
}

export default SagaManager;
