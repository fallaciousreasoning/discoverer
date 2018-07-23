import { TextField } from '@material-ui/core';
import * as React from 'react';
import { Track } from 'src/model';
import { setTrack } from 'src/services/dataContext';
import { trackSearch } from 'src/services/lastfm';

interface Props {
    onSelect: (track: Track) => void;
}

interface State {
    query: string;

    results: Track[];
    suggestions: string[];
}

export default class SongFinder extends React.Component<Props, State> {
    state = {
        query: '',

        results: [],
        suggestions: []
    }

    onSearch = async (query: string) => {
        this.setState({ query });

        if (!query) {
            // Otherwise lastfm errors
            return;
        }

        const tracks = await trackSearch(query);
        tracks.forEach(setTrack);
        this.setState({
            results: tracks,
            suggestions: tracks.map(t => `${t.name} ${t.artist}`)
        });
    }

    onNewRequest = (selected: string, index: number) => {
        if (index === -1) {
            return;
        }

        this.props.onSelect(this.state.results[index]);
        this.setState({ query: '' });
    }

    public render() {
        return <TextField/>
        // return <AutoComplete
        //     onUpdateInput={this.onSearch}
        //     hintText="Search for a track"
        //     value={this.state.query}
        //     dataSource={this.state.suggestions}
        //     filter={AutoComplete.caseInsensitiveFilter}
        //     onNewRequest={this.onNewRequest}
        //     fullWidth
        // />
    }
}