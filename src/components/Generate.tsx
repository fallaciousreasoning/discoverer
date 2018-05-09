import { LinearProgress } from 'material-ui';
import * as React from 'react';
import { createSelector } from 'reselect';
import { connect } from 'src/connect';
import { ApplicationState } from '../store';
import { actionCreators } from '../store/actions';
import { getGeneratedTracks, getProgress } from '../store/generationStore';
import { Track } from '../store/trackStore';
import SongList from './SongList';


interface Props {
    progress: number;
    generated: Track[];

    removeSong: (song: Track) => void;
    generationStart: () => void;
}

class Generate extends React.Component<Props> {
    componentDidMount() {
        // TODO do this more intelligently
        this.props.generationStart();
    }

    public render() {
        return <>
            <LinearProgress min={0} max={1} value={this.props.progress} mode="determinate"/>
            <SongList songs={this.props.generated} removeSong={this.props.removeSong}/>
        </>;
    }
}

const getGenerationState = (state: ApplicationState) => state.generation;
const getTracks = (state: ApplicationState) => state.tracks;

const mapStateToProps = createSelector([getGeneratedTracks, getProgress], (generated, progress) => ({
    progress,
    generated
}));

const mapDispatchToProps = { removeSong: actionCreators.generationRemoveSong, generationStart: actionCreators.generationStart };

export default connect(mapStateToProps, mapDispatchToProps)(Generate);