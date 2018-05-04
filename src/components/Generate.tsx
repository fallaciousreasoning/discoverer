import * as React from 'react';
import { LastFmTrack } from 'src/services/lastfm';
import { LinearProgress } from 'material-ui';
import SongList from './SongList';
import { connect } from 'src/connect';
import { ApplicationState } from '../store';
import { actionCreators } from '../store/actions';
import { GenerationState } from '../store/generationStore';

interface Props extends GenerationState {
    removeSong: (song: LastFmTrack) => void;
}

class Generate extends React.Component<Props> {
    public render() {
        return <>
            <LinearProgress min={0} max={1} value={this.props.progress} mode="determinate"/>
            <SongList songs={this.props.generated} removeSong={this.props.removeSong}/>
        </>;
    }
}

const mapStateToProps = (state: ApplicationState) => state.generation;
const mapDispatchToProps = { removeSong: actionCreators.generationRemoveSong };

export default connect(mapStateToProps, mapDispatchToProps)(Generate);