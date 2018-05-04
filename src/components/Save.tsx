import * as React from 'react';
import Authorizer, { AuthorizationToken } from 'src/services/linker';
import { RaisedButton } from 'material-ui';


interface Props {
    token: AuthorizationToken;
    onAuthorized: (token: AuthorizationToken) => void;
}

export default class Save extends React.Component<Props> {
    authorizer: Authorizer = new Authorizer();

    componentDidUpdate() {
        this.authorizer.setToken(this.props.token);
        this.authorizer.setCallback(this.props.onAuthorized);
    }

    public render() {
        return <div>
            <RaisedButton primary label="Connect to Spotify" onClick={this.authorizer.authorize}/>
        </div>
    }
}