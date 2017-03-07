import React from 'react';

export default class Track extends React.Component {
    render() {
        const track = this.props;
        const name = track.name;
        const icon = track.cover;
        const artist = track.artist;

        return (
            <span>
                <image title={name} src={icon}/>
                {name} by {artist}
            </span>
        );
    }
}