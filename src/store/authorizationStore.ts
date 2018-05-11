import { ApplicationState } from ".";
import { ActionType, SetToken } from "./actions";
import { actionReducer, composeReducers, defaultReducer } from "./reducers";

export interface AuthorizationToken {
    access_token?: string;
    expires_in?: number;
    token_type?: string;
    issue_date?: Date;
}

const defaultState = {};

export const reducer = composeReducers(
    defaultReducer(defaultState),
    actionReducer(ActionType.SET_TOKEN, (token: AuthorizationToken, action: SetToken) => ({ ...action.token }))
);

export const getToken = (state: ApplicationState) => state.token;