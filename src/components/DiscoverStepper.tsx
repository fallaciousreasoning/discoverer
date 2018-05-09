import { FlatButton, Paper, RaisedButton, Step, StepLabel, Stepper, Toolbar, ToolbarTitle } from 'material-ui';
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
    complete: (state: ApplicationState) => boolean;
}

const steps: { [step: string]: DiscoveryStep } = {
    seed: {
        title: "Seed Tracks",
        complete: (state) => !!state.seeds.length,
        component: <Seed />
    },
    configure: {
        title: "Configure Options",
        complete: (state) => true,
        component: <Configure />
    },
    generate: {
        title: "Generating Playlist",
        complete: (state) => state.generationProgress === 1,
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

        // If we aren't ready, for this step, send us back to the first.
        if (!steps.seed.complete(store.getState()) && step !== 'seed' ) {
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