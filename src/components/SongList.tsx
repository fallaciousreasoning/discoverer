import { Avatar, IconButton, List, ListItem } from 'material-ui';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import * as React from 'react';
import { Track } from 'src/store/trackStore';

const Song = (props: { song: Track, remove: (song: Track) => void }) => <ListItem
    leftAvatar={<Avatar src={props.song.imageUrl} />}
    primaryText={props.song.name}
    secondaryText={`by ${props.song.artist}`}
    rightIconButton={<IconButton onClick={() => props.remove(props.song)}><ActionDelete /></IconButton>}
/>;

interface Props {
    songs: Track[];
    removeSong: (song: Track) => void;
}

export default (props: Props) => <List>
    {props.songs.map(song => <Song key={song.id} song={song} remove={props.removeSong} />)}
</List>;