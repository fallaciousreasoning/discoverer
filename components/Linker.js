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
        // TODO remove comms event listeners
    }

    linkTracks() {
        fetch('/link', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({tracks: this.props.tracks, token: this.state.token, playlistName: this.state.playlistName}),
        }).then(() => this.setState({saved: true}));
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
                            ? (!this.state.saved ? <LinearProgress mode="determinate" value={this.state.progress}/> : "Success!")
                            : <RaisedButton label="Connect Spotify" onClick={() => window.open("/login/spotify")}/>  
                    }              
                </Paper>
            </div>
        );
    }
}