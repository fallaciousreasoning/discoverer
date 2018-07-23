import { Input, ListItemText, MenuItem, Paper, withStyles } from "@material-ui/core";
import Downshift from 'downshift';
import * as React from "react";
import { Track } from "../model";
import { trackSearch } from "../services/lastfm";

const styles = theme => ({
    root: {
        flexGrow: 1,
        height: 250,
    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    paper: {
        zIndex: 1,
        marginTop: theme.spacing.unit,
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    inputRoot: {
        flexWrap: 'wrap',
    },
});

interface Props {
    onSelect?: (song: Track) => void;
    classes;
}

interface State {
    tracks: Track[];

    query: string;
}

const SongEntry = (props: { song: Track, selected: boolean, onClick: (song: Track) => void }) => <MenuItem
selected={props.selected}
onClick={() => props.onClick(props.song)}>
    <ListItemText primary={`${props.song.name} (${props.song.artist})`}/>
</MenuItem>;

class SongSearcher extends React.Component<Props, State> {
    state: State = {
        tracks: [],
        query: ''
    };

    onSelect = (selection: Track) => {
        this.setState({ query: '' });
        this.props.onSelect && this.props.onSelect(selection);
    }

    onChange = async (query) => {

        this.setState({ query });

        const tracks = await trackSearch(query)

        this.setState({ tracks })
    }

    filterTracks = (query: string) => this.state.tracks.filter(t => `${t.name} ${t.artist}`.includes(query));

    public render() {
        return <Downshift onSelect={this.onSelect} onInputValueChange={this.onChange}>
            {props => <div>
                <Input {...props.getInputProps()} fullWidth />
                {props.isOpen && this.state.tracks.length &&
                    <Paper square className={this.props.classes.paper}>
                        {this.filterTracks(props.inputValue)
                            .map((t, i) => <SongEntry key={t.id} song={t} selected={props.highlightedIndex === i} onClick={this.onSelect} />)}
                    </Paper>}
            </div>}
        </Downshift>
    }
}

export default withStyles(styles as any)(SongSearcher);