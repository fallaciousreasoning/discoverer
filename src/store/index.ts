import { Action } from 'redux';

export interface ApplicationState {

}

const defaultState: ApplicationState = {};

export const reducer = (state: ApplicationState, action: Action) => {
    return state || defaultState;
}