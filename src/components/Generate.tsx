import { RaisedButton } from 'material-ui';
import * as React from 'react';
import { createSelector } from 'reselect';
import { Track } from 'src/model';
import { connect } from '../connect';
import { actionCreators } from '../store/actions';
import { getGeneratedTracks, getGenerationProgress } from '../store/generationStore';
import { settingsHash } from '../store/settingsStore';
import SongList from './SongList';

interface Props {
    generated: Track[];

    progress: number;

    removeSong: (song: Track) => void;
    generationStart: () => void;

    settingsHash: string;
}

let prevSettingsHash: string;

class Generate extends React.Component<Props> {
    componentDidMount() {
        if (prevSettingsHash !== this.props.settingsHash) {
            this.props.generationStart();
            prevSettingsHash = this.props.settingsHash;
        }
    }

    public render() {
        return <>
            <SongList songs={this.props.generated} removeSong={this.props.removeSong} />
            <RaisedButton onClick={this.props.generationStart} disabled={this.props.progress !== 1} label="Regenerate" />
        </>;
    }
}

const mapStateToProps = createSelector([getGeneratedTracks, getGenerationProgress, settingsHash], (generated, progress, settingsHash) => ({
    generated,
    progress,
    settingsHash
}));

const mapDispatchToProps = { removeSong: actionCreators.generationRemoveSong, generationStart: actionCreators.generationStart };

export default connect(mapStateToProps, mapDispatchToProps)(Generate);