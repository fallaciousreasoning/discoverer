import * as React from 'react';

import { List, ListItem, Avatar, IconButton } from 'material-ui';
import ActionDelete from 'material-ui/svg-icons/action/delete';

import { LastFmTrack, getArtistName } from 'src/services/lastfm';
import { actionCreators } from 'src/store/actions';

// If we have more than one image, take the second (medium size), otherwise take the one and only.
const artistUrl = (song: LastFmTrack) => song.image[Math.min(song.image.length - 1, 1)]['#text'];

const Song = (props: { song: LastFmTrack, remove: (song: LastFmTrack) => void }) => <ListItem
    leftAvatar={<Avatar src={artistUrl(props.song)} />}
    primaryText={props.song.name}
    secondaryText={`by ${getArtistName(props.song)}`}
    rightIconButton={<IconButton onClick={() => props.remove(props.song)}><ActionDelete /></IconButton>}
/>;

interface Props {
    songs: LastFmTrack[];
    removeSong: (song: LastFmTrack) => void;
}

export default (props: Props) => <List>
    {props.songs.map(song => <Song key={`${song.name} ${song.artist} ${song.url}`} song={song} remove={props.removeSong} />)}
</List>;