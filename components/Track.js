import React from 'react';

export default class Track extends React.Component {
    render() {
        const track = this.props;
        const name = track.name;
        const icon = track.cover;
        const artist = track.artist;

        return (
            <span>
                <img title={name} src={icon} width="100" height="100"/>
                {name} by {artist}
            </span>
        );
    }
}