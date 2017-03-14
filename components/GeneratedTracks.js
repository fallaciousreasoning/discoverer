import React from 'react';
import Track from './Track';
import TrackSearch from './TrackSearch';
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
            tracks: [],
            fetched: false
        }

        if (!this.props.options) {
            throw new Error("Options must be set!");
        }

        this.removeTrack = this.removeTrack.bind(this);
        this.getTracks = this.getTracks.bind(this);
        this.onChanged = this.props.onChanged || (() => {});
        this.onChanged([]);

        this.getTracks(this.props.options);
    }

    getTracks(options) {
        options = options || this.props.options;

        fetch('/generate', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(options)
        })
        .then(response => {return response.json();})
        .then(json => {
            const tracks = json.response;
            for (let i = 0; i < tracks.length; ++i)
                tracks[i].key = i;

            this.setState({tracks: tracks, fetched: true});
            this.onChanged(tracks);
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
                    </div>) : <LinearProgress mode="indeterminate"/>}                 
                </Paper>
            </div>
        );
    }
}