import React from 'react';
import Track from './Track';

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
            name: this.state.query,//"We will fall together",
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
                <input type="text" value={this.state.query} onChange={this.onSearchChanged}></input>
                <button type="button" onClick={this.addTrack}>Add</button>

                <div className="tracks">
                    <ul>
                        {this.state.tracks.map(track => {
                            return (
                               <li key={track.key}>
                                    <Track {...track}></Track>
                                    <button onClick={() => this.removeTrack(track)}> X </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}