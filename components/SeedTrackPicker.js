import React from 'react';
import TrackSearch from './TrackSearch';
import DiscovererSettings from './DiscovererSettings';

import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';

export default class SeedTrackPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            tracks: this.props.defaultTracks || [],
            suggestions: [],
            selectedSuggestion: undefined
        }

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.onSearchChanged = this.onSearchChanged.bind(this);
        this.nextTrackId = this.state.tracks.length == 0 ? 0 : this.state.tracks[this.state.tracks.length - 1].key + 1;

        this.onChanged = this.props.onChanged || (() => {});
    }

    addTrack(track) {
        var items = this.state.tracks.slice();

        track = track || {
            name: "We will fall together",
            artist: "Streetlight Manifesto",
            cover: "https://lastfm-img2.akamaized.net/i/u/ar0/3f21f4b58f844afab3bbccc450a4e0bf"    
        };

        track.key = this.nextTrackId++;

        items.push(track);

        this.setState({
            tracks: items
        });

        this.onChanged(items);
    }

    removeTrack(track) {
        var items = this.state.tracks.slice(),
            index = items.indexOf(track);

        items.splice(index, 1);
        this.setState({tracks:items});
        this.onChanged(items);
    }

    onSearchChanged(e) {
        this.setState({query: e.target.value });
    }

    render() {
        return (
            <div className="seed-track-picker">
                <Paper>
                    <Toolbar><ToolbarTitle text="Seed Tracks"/></Toolbar>
                    <div style={{padding: "28px 16px"}}>
                        Search for a track
                        <TrackSearch onSelect={this.addTrack}/>
                        <div className="tracks">
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
                        </div>
                    </div>
                </Paper>
            </div>
        );
    }
}