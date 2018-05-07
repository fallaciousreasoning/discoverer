import * as React from 'react';

import { AutoComplete }  from 'material-ui';
import { LastFmTrack, trackSearch } from 'src/services/lastfm';

interface Props {
    onSelect: (track: LastFmTrack) => void;
}

interface State {
    query: string;

    results: LastFmTrack[];
    suggestions: string[];
}

export default class SongFinder extends React.Component<Props, State> {
    state = {
        query: '',

        results: [],
        suggestions: []
    }

    onSearch = (query: string) => {
        this.setState({ query });

        if (!query) {
            // Otherwise lastfm errors
            return;
        }

        trackSearch(query)
            .then(tracks => {
                this.setState({
                    results: tracks,
                    suggestions: tracks.map(t => `${t.name} (${t.artist})`)
                });
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
        return <AutoComplete
            onUpdateInput={this.onSearch}
            hintText="Search for a track"
            value={this.state.query}
            dataSource={this.state.suggestions}
            filter={AutoComplete.caseInsensitiveFilter}
            onNewRequest={this.onNewRequest}
            fullWidth
        />
    }
}