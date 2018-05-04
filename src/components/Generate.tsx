import * as React from 'react';
import { LastFmTrack } from 'src/services/lastfm';
import { LinearProgress } from 'material-ui';
import SongList from './SongList';

interface Props {
    generating: boolean;
    progress: number;

    generated: LastFmTrack[];
    
    removeSong: (song: LastFmTrack) => void;
}

export default class Generate extends React.Component<Props> {
    public render() {
        return <>
            <LinearProgress min={0} max={1} value={this.props.progress}/>
            <SongList songs={this.props.generated} removeSong={this.props.removeSong}/>
        </>;
    }
}