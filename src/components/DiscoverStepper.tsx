import { FlatButton, LinearProgress, Paper, RaisedButton, Toolbar, ToolbarTitle } from 'material-ui';
import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { createSelector } from 'reselect';
import { store } from '..';
import { connect } from '../connect';
import { getLinkProgress, getSeedProgress } from '../store';
import { getGenerationProgress } from '../store/generationStore';
import Configure from './Configure';
import Generate from './Generate';
import Save from './Save';
import Seed from './Seed';
import { Step, Stepper, StepProps } from './Stepper';

interface RouteProps {
    step: string;
}

enum Steps {
    seed = 0,
    configure = 1,
    generate = 2,
    save = 3
}

const stepperContentStyle = { padding: "28px 16px 0px 16px" };
const controlBoxStyle = { marginTop: '12px' };
const nextButtonStyle = { margin: '12px' };
const discovererStyle = { width: '100%', maxWidth: '700px', margin: 'auto' };

function StepContainer(props: StepProps & { children }) {
    return <Paper>
        <Toolbar>
            <ToolbarTitle text={props.name} />
        </Toolbar>
        <LinearProgress mode="determinate" value={props.progress || 1} min={0} max={1} />
        <div style={stepperContentStyle}>
            {props.children}
        </div>
    </Paper>
}

interface Props {
    seedProgress: number;
    generationProgress: number;
    linkProgress: number;
}

class DiscoverStepper extends React.Component<Props & RouteComponentProps<RouteProps>> {
    currentStepName = () => this.props.match.params.step || 'seed';

    nextStep = () => this.props.history.push(Steps[Steps[this.currentStepName()] + 1]);
    previousStep = () => this.props.history.push(Steps[Steps[this.currentStepName()] - 1]);

    public render() {
        const step = this.currentStepName();
        const stepNumber = Steps[step];
        const state = store.getState();

        // If we aren't ready, for this step, send us back to the first.
        if (this.props.seedProgress !== 1 && stepNumber !== 0) {
            return <Redirect to='/seed' />
        }

        return <div style={discovererStyle}>
            <Stepper activeStep={Steps[step]}
                renderHorizontalContentAs={StepContainer}>
                <Step name='Seed' progress={this.props.seedProgress}>
                    <Seed />
                </Step>
                <Step name='Configure'>
                    <Configure />
                </Step>
                <Step name="Generate" progress={this.props.generationProgress}>
                    <Generate />
                </Step>
                <Step name="Save" progress={this.props.linkProgress}>
                    <Save />
                </Step>
                {props => <div style={controlBoxStyle}>
                    <FlatButton
                        label="Back"
                        disabled={props.firstStep}
                        onClick={this.previousStep}
                    />
                    <RaisedButton
                        label="Next"
                        primary={true}
                        onClick={this.nextStep}
                        disabled={!props.complete}
                        style={nextButtonStyle}
                    />
                </div>}
            </Stepper>
        </div>;
    }
}

const mapStateToProps = createSelector([getSeedProgress,
    getGenerationProgress,
    getLinkProgress], (
        seedProgress,
        generationProgress,
        linkProgress
    ) => ({
        seedProgress,
        generationProgress,
        linkProgress
    }))

export default connect(mapStateToProps)(DiscoverStepper);