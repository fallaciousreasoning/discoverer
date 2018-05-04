import * as React from 'react';

import { List, Avatar, ListItem, IconButton } from 'material-ui';
import { ActionDelete } from 'material-ui/svg-icons/action/delete';

import { LastFmTrack } from 'src/services/lastfm';
import { actionCreators } from '../store/actions';

// If we have more than one image, take the second (medium size), otherwise take the one and only.
const artistUrl = (song: LastFmTrack) => song.image[Math.min(song.image.length - 1, 1)]['#text'];

const SeedTrack = (props: { track: LastFmTrack, remove: (track: LastFmTrack) => void }) => <ListItem
    leftAvatar={<Avatar src={artistUrl(props.track)} />}
    primaryText={props.track.name}
    secondaryText={`by ${props.track.artist}`}
    rightIconButton={<IconButton onClick={() => props.remove(props.track)}><ActionDelete /></IconButton>}
/>;

interface Props {
    songs: LastFmTrack[];
    removeSong: (song: LastFmTrack) => void;
}

export default (props: Props) => <List>
    {props.songs.map(song => <SeedTrack key={`${song.name} ${song.artist} ${song.url}`} track={song} remove={props.removeSong} />)}
</List>