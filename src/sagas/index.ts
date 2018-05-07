import { takeEvery, takeLatest, put, all, fork, cancel, take } from 'redux-saga/effects';

import generation from './generation';
import { actionCreators, ActionType } from 'src/store/actions';
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
