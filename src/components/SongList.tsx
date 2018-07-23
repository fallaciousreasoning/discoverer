import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import * as React from 'react';
import { Track } from 'src/model';

const Song = (props: { song: Track, remove: (song: Track) => void }) => <ListItem>
    <ListItemAvatar>
        <Avatar src={props.song.imageUrl} />
    </ListItemAvatar>
    <ListItemText primary={props.song.name} secondary={`by ${props.song.artist}`} />
    <ListItemSecondaryAction>
        <IconButton onClick={() => props.remove(props.song)}><DeleteIcon /></IconButton>
    </ListItemSecondaryAction>
</ListItem>;

interface Props {
    songs: Track[];
    removeSong: (song: Track) => void;
}

export default (props: Props) => <List>
    {props.songs.map(song => <Song key={song.id} song={song} remove={props.removeSong} />)}
</List>;