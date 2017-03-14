import React from 'react';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';

import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';

export default class Linker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tracks: [],
            saved: false,

        }

        if (!this.props.tracks) {
            throw new Error("Tracks must be set!");
        }

        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.linkTracks = this.linkTracks.bind(this);
        this.onChanged = this.props.onChanged || (() => {});
        this.onChanged([], false);
    }

    componentWillUnmount() {
        // Destroy the event handler.
        this.onChanged = () => {};
    }

    linkTracks() {
    }

    render() {
        return (
            <div className="generated-tracks">
                <Paper zDepth={1}>                    
                    <Toolbar>
                        <ToolbarTitle text="Linker"/>
                    </Toolbar>

                    <RaisedButton label="Link Spotify" onClick={() => window.open("/login/spotify")}/>                
                </Paper>
            </div>
        );
    }
}