import React from 'react';
import { Link } from 'react-router';

import Track from './Track';

export default class PlaylistPage extends React.Component {
    render() {
        return (
            <div className="playlist-page">
                <div className="playlist-title">
                    Playlist: <span>Hmm...</span>
                </div>
                <div className="playlist-tracks"></div>
                <button type="submit">Save to Spotify</button> 
            </div>
        );
    }
}