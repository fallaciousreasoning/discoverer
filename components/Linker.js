import React from 'react';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';

import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';

export default class Linker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlistName: "test",
            playlistUrl: "http://play.spotify.com",
            saved: false,
            token: null,
            progress: 0,
        }

        if (!this.props.tracks) {
            throw new Error("Tracks must be set!");
        }

        this.tokenReceived = this.tokenReceived.bind(this);
        this.progress = this.progress.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.linkTracks = this.linkTracks.bind(this);
        this.onChanged = this.props.onChanged || (() => {});
        this.onChanged([], false);
    }

    tokenReceived(token) {
        this.setState({token: token});
        this.linkTracks();
    }

    progress(progress) {
        this.setState({progress: progress});
    }

    componentWillMount() {
        window.comms.listenFor('token', this.tokenReceived);
        window.comms.listenFor('link-progress', this.progress);
    }

    componentWillUnmount() {
        // Destroy the event handler.
        this.onChanged = () => {};
        
        // Stop listening for socket events.
        window.comms.stopListeningFor('link-progress', this.progress);
        window.comms.stopListeningFor('token', this.progress);

        // TODO cancel link.
    }

    linkTracks() {
        this.props.lock(true);
        fetch('/link', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({tracks: this.props.tracks, token: this.state.token, playlistName: this.state.playlistName}),
        })
            .then((result) => result.json())
            .then(json => {
                console.log(json);
                this.setState({saved: true, playlistUrl: json.response.external_urls.spotify});
            })
            .then(() => this.props.lock(false));
    }

    render() {
        return (
            <div className="generated-tracks">
                <Paper zDepth={1}>                    
                    <Toolbar>
                        <ToolbarTitle text="Linker"/>
                    </Toolbar>
                    {
                        this.state.token !== null
                            ? (!this.state.saved ? <LinearProgress mode="determinate" value={this.state.progress}/> : <p>Playlist saved to Spotify! Click <a href={this.state.playlistUrl}>here</a> to open it.</p>)
                            : <RaisedButton label="Connect Spotify" onClick={() => window.open("/login/spotify")}/>  
                    }              
                </Paper>
            </div>
        );
    }
}