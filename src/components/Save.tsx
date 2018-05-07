import * as React from 'react';
import Authorizer from 'src/services/linker';
import { RaisedButton } from 'material-ui';
import { AuthorizationToken } from 'src/store/authorizationStore';
import { ApplicationState } from '../store';
import { connect } from 'src/connect';
import { actionCreators } from '../store/actions';


interface Props {
    token: AuthorizationToken;
    onAuthorized: (token: AuthorizationToken) => void;
}

class Save extends React.Component<Props> {
    authorizer: Authorizer = new Authorizer();

    componentDidMount() {
        this.authorizer.setToken(this.props.token);
        this.authorizer.setCallback(this.props.onAuthorized);
        this.updateValues();
    }

    componentDidUpdate() {
        this.authorizer.setToken(this.props.token);
        this.authorizer.setCallback(this.props.onAuthorized);
        this.updateValues();
    }

    updateValues = () => {
    }

    public render() {
        const connected = !!this.props.token.access_token;
        return <div>
            <RaisedButton primary disabled={connected} label={connected ? 'Connected to Spotify!' : 'Connect to Spotify'} onClick={this.authorizer.authorize} />
        </div>
    }
}

// TODO memoize
export default connect((state: ApplicationState) => ({ token: state.token }), { onAuthorized: actionCreators.setToken })(Save)