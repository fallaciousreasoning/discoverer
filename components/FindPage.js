import React from 'react';
import Track from './Track';
import TrackSearch from './TrackSearch';

import RaisedButton from 'material-ui/RaisedButton';

import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

export default class FindPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            tracks: [],
            suggestions: [],
            selectedSuggestion: undefined
        }

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.onSearchChanged = this.onSearchChanged.bind(this);
        this.nextTrackId = 0;
    }

    addTrack() {
        var items = this.state.tracks.slice();
        items.push({
            name: "We will fall together",
            artist: "Streetlight Manifesto",
            cover: "https://lastfm-img2.akamaized.net/i/u/ar0/3f21f4b58f844afab3bbccc450a4e0bf",
            id: this.nextTrackId,
            key: this.nextTrackId++,            
        });

        this.setState({
            tracks: items
        });
    }

    removeTrack(track) {
        var items = this.state.tracks.slice(),
            index = items.indexOf(track);

        items.splice(index, 1);
        this.setState({tracks:items});
    }

    onSearchChanged(e) {
        this.setState({query: e.target.value });
    }

    render() {
        return (
            <div className="find-page">
                Search for a track
                <TrackSearch/>
                <RaisedButton type="button" onClick={this.addTrack} label="Add"/>

                <div className="tracks">
                    <List width="500" height="500">
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
        );
    }
}