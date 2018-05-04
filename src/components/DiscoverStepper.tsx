import * as React from 'react';

import { Step, StepLabel, Stepper, Paper, Toolbar, ToolbarTitle, FlatButton, RaisedButton } from 'material-ui';

import { RouteComponentProps } from 'react-router';

import Seed from './Seed';
import Configure from './Configure';

interface RouteProps {
    step: string;
}

enum Steps {
    seed = 0,
    configure = 1,
    generate = 2,
    save = 3
}

const steps = {
    seed: {
        title: "Seed Tracks",
        component: <Seed />
    },
    configure: {
        title: "Configure Options",
        component: <Configure />
    },
    generate: {
        title: "Generating Playlist",
        component: null
    },
    save: {
        title: "Saving",
        component: null
    },
};

const stepperContentStyle = { padding: "28px 16px" };
const controlBoxStyle = { margin: '12px' };
const nextButtonStyle = { margin: '12px' };

export default class DiscoverStepper extends React.Component<RouteComponentProps<RouteProps>> {
    currentStepName = () => this.props.match.params.step;
    currentStep = () => steps[this.currentStepName()];

    nextStep = () => this.props.history.push(Steps[Steps[this.currentStepName()] + 1]);
    previousStep = () => this.props.history.push(Steps[Steps[this.currentStepName()] - 1]);

    public render() {
        const step = this.currentStepName();
        const currentStep = this.currentStep();

        return <div>
            <Stepper activeStep={Steps[step] || 0}>
                <Step>
                    <StepLabel>Seed</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Configure</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Generate</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Save</StepLabel>
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
                        disabled={step === 'save'}
                        style={nextButtonStyle}
                    />
                </div>
            </Paper>
        </div>;
    }
}