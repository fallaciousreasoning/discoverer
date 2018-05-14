import { RaisedButton } from 'material-ui';
import * as React from 'react';
import { createSelector } from 'reselect';
import { connect } from 'src/connect';
import { actionCreators } from 'src/store/actions';
import { Track } from 'src/store/trackStore';
import { getGeneratedTracks } from '../store/generationStore';
import SongList from './SongList';

interface Props {
    generated: Track[];

    removeSong: (song: Track) => void;
    generationStart: () => void;
}

class Generate extends React.Component<Props> {
    componentDidMount() {
        if (!this.props.generated.length) {
            this.props.generationStart();
        }
    }

    public render() {
        return <>
            <SongList songs={this.props.generated} removeSong={this.props.removeSong} />
            <RaisedButton onClick={this.props.generationStart} label="Regenerate" />
        </>;
    }
}

const mapStateToProps = createSelector([getGeneratedTracks], (generated) => ({
    generated
}));

const mapDispatchToProps = { removeSong: actionCreators.generationRemoveSong, generationStart: actionCreators.generationStart };

export default connect(mapStateToProps, mapDispatchToProps)(Generate);