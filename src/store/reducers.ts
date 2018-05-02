import { ActionType } from './actions';
import { ApplicationState } from '.';

type Reducer<T> = (state: T, action: { type: ActionType }) => T;

export const defaultReducer = <T>(defaultState: T) => (state, action) => state || defaultState;

export const actionReducer = <T>(actions: ActionType | ActionType[], reducer: (state: T, action: { type: ActionType }) => T) =>
    (state, action) => {
        actions = Array.isArray(actions) ? actions : [actions];

        if (!actions.some(a => action.type === a)) {
            return state;
        }

        return reducer(state, action);
    }

export const composeReducers = <T>(...reducers: Reducer<T>[]): Reducer<T> => (state, action) => reducers.reduce((lastState, reducer) => reducer(lastState, action), state);