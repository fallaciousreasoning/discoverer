import React from 'react';
import DiscovererSettings from './DiscovererSettings';

import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';

import LinearProgress from 'material-ui/LinearProgress';

export default class GeneratedTracks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
            tracks: [],
            fetched: false
        }

        if (!this.props.options) {
            throw new Error("Options must be set!");
        }

        this.progress = this.progress.bind(this);
        this.componentWillMount = this.componentWillMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.getTracks = this.getTracks.bind(this);
    }

    progress(progress) {
        this.setState({progress: progress});
    }

    componentWillMount() {
        this.onChanged = this.props.onChanged || (() => {});
        this.onChanged([]);

        this.getTracks(this.props.options);

        window.comms.listenFor('generate-progress', this.progress);
    }

    componentWillUnmount() {
        // Destroy the event handler.
        this.onChanged = () => {};

        // Stop listening for progress events.
        window.comms.stopListeningFor('generate-progress', this.progress);

        // TODO cancel playlist generation.
    }

    getTracks(options) {
        options = options || this.props.options;

        this.props.lock(true);
        fetch('/generate', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify(options)
        })
        .then(response => {return response.json();})
        .then(json => {
            const tracks = json.response;
            for (let i = 0; i < tracks.length; ++i)
                tracks[i].key = i;

            this.setState({tracks: tracks, fetched: true});
            this.onChanged(tracks);
            this.props.lock(false);
        });
    }

    removeTrack(track) {
        var items = this.state.tracks.slice(),
            index = items.indexOf(track);

        items.splice(index, 1);
        this.setState({tracks:items});
        this.onChanged(items);
    }

    render() {
        return (
            <div className="generated-tracks">
                <Paper>
                    <Toolbar><ToolbarTitle text={this.state.fetched ? "Generated Tracks" : "Generating..."}/></Toolbar>
                    {this.state.fetched ? 
                    (<div style={{padding: "28px 16px"}} className="tracks">
                        <List height="500">
                            {this.state.tracks.map(track => {
                                return (<ListItem
                                    leftAvatar={<Avatar src={track.cover}/>}
                                    primaryText={track.name}
                                    secondaryText={"by " + track.artist}
                                    rightIconButton={<IconButton onClick={() => this.removeTrack(track)}><ActionDelete/></IconButton>}
                                    key={track.key}/>);
                            })}
                        </List>
                    </div>) : <LinearProgress mode="determinate" value={this.state.progress}/>}                 
                </Paper>
            </div>
        );
    }
}