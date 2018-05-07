import * as React from 'react';

import { Step, StepLabel, Stepper, Paper, Toolbar, ToolbarTitle, FlatButton, RaisedButton } from 'material-ui';

import { RouteComponentProps } from 'react-router';

import Seed from './Seed';
import Configure from './Configure';
import Generate from './Generate';
import Save from './Save';
import { ApplicationState } from '../store';
import { store } from 'src';
import { connect } from 'src/connect';

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
    complete: (state: ApplicationState) => boolean;
}

const steps: { [step: string]: DiscoveryStep } = {
    seed: {
        title: "Seed Tracks",
        complete: (state) => !!state.seedTracks.length,
        component: <Seed />
    },
    configure: {
        title: "Configure Options",
        complete: (state) => true,
        component: <Configure />
    },
    generate: {
        title: "Generating Playlist",
        complete: (state) => !state.generation.generating,
        component: <Generate/>
    },
    save: {
        title: "Saving",
        complete: (state) => false,
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
        const currentStep = this.currentStep();

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
                        disabled={!currentStep.complete(store.getState())}
                        style={nextButtonStyle}
                    />
                </div>
            </Paper>
        </div>;
    }
}

export default connect(state => state)(DiscoverStepper);