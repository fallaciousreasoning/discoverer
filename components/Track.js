import React from 'react';
import Avatar from 'material-ui/Avatar';

export default class Track extends React.Component {
    render() {
        const track = this.props;
        const name = track.name;
        const icon = track.cover;
        const artist = track.artist;

        return (
            <span>
                <Avatar src={icon} size="5rem"/>
                {name} by {artist}
            </span>
        );
    }
}