import { composeReducers, defaultReducer, actionReducer } from "./reducers";
import { ActionType, SetToken } from "./actions";

export interface AuthorizationToken {
    authorization_token?: string;
    expires_in?: number;
    token_type?: string;
}

const defaultState = {};

export const reducer = composeReducers(
    defaultReducer(defaultState),
    actionReducer(ActionType.SET_TOKEN, (token: AuthorizationToken, action: SetToken) => action.token)
);