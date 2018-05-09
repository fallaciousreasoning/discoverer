import { RaisedButton } from 'material-ui';
import * as React from 'react';
import { connect } from 'src/connect';
import Authorizer from 'src/services/authorizer';
import { AuthorizationToken } from 'src/store/authorizationStore';
import { ApplicationState } from '../store';
import { actionCreators } from '../store/actions';


interface Props {
    token: AuthorizationToken;
    onAuthorized: (token: AuthorizationToken) => void;
    linkStart: () => void;
}

class Save extends React.Component<Props> {
    authorizer: Authorizer = new Authorizer();

    componentDidMount() {
        this.updateValues();
    }

    componentDidUpdate() {
        this.updateValues();
    }

    updateValues = () => {
        this.authorizer.setToken(this.props.token);
        this.authorizer.setCallback(this.props.onAuthorized);

        if (this.authorizer.token.access_token) {
            this.props.linkStart();
        }
    }

    public render() {
        const connected = !!this.props.token.access_token;
        return <div>
            <RaisedButton primary disabled={connected} label={connected ? 'Connected to Spotify!' : 'Connect to Spotify'} onClick={this.authorizer.authorize} />
        </div>
    }
}

// TODO memoize
export default connect((state: ApplicationState) => ({ token: state.token }),
{
    onAuthorized: actionCreators.setToken,
    linkStart: actionCreators.linkStart
})(Save)