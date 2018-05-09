import { LinearProgress, RaisedButton } from 'material-ui';
import * as React from 'react';
import { createSelector } from 'reselect';
import { connect } from 'src/connect';
import Authorizer from 'src/services/authorizer';
import { getLinkProgress } from 'src/store';
import { actionCreators } from 'src/store/actions';
import { AuthorizationToken, getToken } from 'src/store/authorizationStore';

interface Props {
    token: AuthorizationToken;
    onAuthorized: (token: AuthorizationToken) => void;
    progress: number;
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
        const previousToken = this.authorizer.token;

        this.authorizer.setToken(this.props.token);
        this.authorizer.setCallback(this.props.onAuthorized);

        if (previousToken !== this.authorizer.token && this.authorizer.token.access_token) {
            this.props.linkStart();
        }
    }

    public render() {
        const connected = !!this.props.token.access_token;
        return <>
            <LinearProgress mode="determinate" value={this.props.progress} min={0} max={1} />
            <RaisedButton primary disabled={connected} label={connected ? 'Connected to Spotify!' : 'Connect to Spotify'} onClick={this.authorizer.authorize} />
        </>
    }
}

const mapStateToProps = createSelector([getLinkProgress, getToken], (progress, token) => ({ progress, token }));

// TODO memoize
export default connect(mapStateToProps,
    {
        onAuthorized: actionCreators.setToken,
        linkStart: actionCreators.linkStart
    })(Save)