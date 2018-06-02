import { Button, TextField } from '@material-ui/core';
import * as React from 'react';
import { createSelector } from 'reselect';
import { connect } from 'src/connect';
import Authorizer from 'src/services/authorizer';
import { getPlaylistName } from 'src/store';
import { actionCreators } from 'src/store/actions';
import { AuthorizationToken, getToken } from 'src/store/authorizationStore';

interface Props {
    token: AuthorizationToken;
    onAuthorized: (token: AuthorizationToken) => void;
    linkStart: () => void;

    playlistName: string;
    playlistSetName: (name: string) => void;
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
            <TextField fullWidth placeholder="Playlist Name" value={this.props.playlistName} onChange={(e: any) => this.props.playlistSetName(e.target.value)}/>
            <Button variant='raised' color='primary' disabled={connected} onClick={this.authorizer.authorize}>
                {connected ? 'Connected to Spotify!' : 'Connect to Spotify'}
            </Button>
        </>
    }
}

const mapStateToProps = createSelector([getToken, getPlaylistName], (token, playlistName) => ({ token, playlistName }));

// TODO memoize
export default connect(mapStateToProps,
    {
        onAuthorized: actionCreators.setToken,
        linkStart: actionCreators.linkStart,
        playlistSetName: actionCreators.playlistSetName
    })(Save)