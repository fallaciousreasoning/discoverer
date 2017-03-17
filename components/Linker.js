import React from 'react';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';

import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';

import TextField from 'material-ui/TextField';

export default class Linker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlistName: "Discover Playlist",
            playlistUrl: "http://play.spotify.com",
            saved: false,
            token: null,
            progress: 0,
        }

        if (!this.props.tracks) {
            throw new Error("Tracks must be set!");
        }

        this.onNameChanged = this.onNameChanged.bind(this);
        this.tokenReceived = this.tokenReceived.bind(this);
        this.progress = this.progress.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.linkTracks = this.linkTracks.bind(this);
        this.onChanged = this.props.onChanged || (() => {});
        this.onChanged([], false);
        this.done = false;
    }

    onNameChanged(event, value) {
        this.setState({playlistName: value})
    }

    tokenReceived(token) {
        this.setState({token: token});
        this.linkTracks();
    }

    progress(progress) {
        this.setState({progress: progress});
    }

    componentWillMount() {
        this.props.comms.listenFor('token', this.tokenReceived);
        this.props.comms.listenFor('link-progress', this.progress);
    }

    componentWillUnmount() {
        // Destroy the event handler.
        this.onChanged = () => {};
        
        // Stop listening for socket events.
        this.props.comms.stopListeningFor('link-progress', this.progress);
        this.props.comms.stopListeningFor('token', this.progress);

        // TODO cancel link.
    }

    linkTracks() {
        this.props.lock(true);
        fetchAuth('/link', {
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
                this.setState({saved: true, playlistUrl: json.response.external_urls.spotify});
            })
            .then(() => {this.props.lock(false); this.done = true;});
    }

    login() {
        window.open('/login/spotify?token=' + this.props.token);
    }

    render() {
        const style = {
            padding: "28px 16px"
        };

        return (
            <div className="generated-tracks">
                <Paper zDepth={1}>                    
                    <Toolbar>
                        <ToolbarTitle text={this.state.token === null ? "Save on Spotify" : (!this.state.saved ? "Linking..." : "Saved!")}/>
                    </Toolbar>
                    {
                        this.state.token !== null
                            ? (!this.state.saved ? <LinearProgress mode="determinate" value={this.state.progress}/> : <p style={style}>Playlist saved to Spotify! Click <a href={this.state.playlistUrl}>here</a> to open it.</p>)
                            : <TextField style={style} floatingLabelText="Playlist Name" onChange={this.onNameChanged} value={this.state.playlistName}/>
                    }       
                </Paper>
            </div>
        );
    }
}