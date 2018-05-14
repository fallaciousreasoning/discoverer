import { FlatButton, LinearProgress, Paper, RaisedButton, Step, StepLabel, Stepper, Toolbar, ToolbarTitle } from 'material-ui';
import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { store } from 'src';
import { connect } from 'src/connect';
import { ApplicationState } from '../store';
import Configure from './Configure';
import Generate from './Generate';
import Save from './Save';
import Seed from './Seed';

interface RouteProps {
    step: string;
}

enum Steps {
    seed = 0,
    configure = 1,
    generate = 2,
    save = 3
}

interface DiscoveryStep {
    title: string;
    component: JSX.Element;
    progress: (state: ApplicationState) => number;
}

const steps: { [step: string]: DiscoveryStep } = {
    seed: {
        title: "Seed Tracks",
        progress: (state) => state.seeds.length === 0 ? 0 : 1,
        component: <Seed />
    },
    configure: {
        title: "Configure Options",
        progress: () => 1,
        component: <Configure />
    },
    generate: {
        title: "Generating Playlist",
        progress: (state) => state.generationProgress,
        component: <Generate/>
    },
    save: {
        title: "Saving",
        progress: (state) => state.linkProgress,
        component: <Save/>
    },
};

const stepperContentStyle = { padding: "28px 16px" };
const controlBoxStyle = { margin: '12px' };
const nextButtonStyle = { margin: '12px' };

class DiscoverStepper extends React.Component<ApplicationState & RouteComponentProps<RouteProps>> {
    currentStepName = () => this.props.match.params.step || 'seed';
    currentStep = () => steps[this.currentStepName()];

    nextStep = () => this.props.history.push(Steps[Steps[this.currentStepName()] + 1]);
    previousStep = () => this.props.history.push(Steps[Steps[this.currentStepName()] - 1]);

    public render() {
        const step = this.currentStepName();
        const currentStep = this.currentStep() || steps.seed;
        const state = store.getState();

        const progress = currentStep.progress(state);
        // If we aren't ready, for this step, send us back to the first.
        if (!steps.seed.progress(state) && step !== 'seed' ) {
            return <Redirect to='/seed'/>
        }

        return <div>
            <Stepper activeStep={Steps[step]}>
                <Step>
                    <StepLabel>{steps.seed.title}</StepLabel>
                </Step>
                <Step>
                    <StepLabel>{steps.configure.title}</StepLabel>
                </Step>
                <Step>
                    <StepLabel>{steps.generate.title}</StepLabel>
                </Step>
                <Step>
                    <StepLabel>{steps.save.title}</StepLabel>
                </Step>
            </Stepper>
            <Paper>
                <Toolbar><ToolbarTitle text={currentStep.title} /></Toolbar>
            <LinearProgress mode="determinate" value={progress} min={0} max={1} />
                <div style={stepperContentStyle}>
                    {currentStep.component}
                </div>
                <div style={controlBoxStyle}>
                    <FlatButton
                        label="Back"
                        disabled={step === 'seed'}
                        onClick={this.previousStep}
                    />
                    <RaisedButton
                        label="Next"
                        primary={true}
                        onClick={this.nextStep}
                        disabled={progress !== 1}
                        style={nextButtonStyle}
                    />
                </div>
            </Paper>
        </div>;
    }
}

export default connect(state => state)(DiscoverStepper);