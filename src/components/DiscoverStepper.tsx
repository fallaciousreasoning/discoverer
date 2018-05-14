import { LinearProgress, Paper, Toolbar, ToolbarTitle } from 'material-ui';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { store } from 'src';
import { Step, StepProps, Stepper } from 'src/components/Stepper';
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

const stepperContentStyle = { padding: "28px 16px" };
const controlBoxStyle = { margin: '12px' };
const nextButtonStyle = { margin: '12px' };
const discovererStyle = { width: '100%', maxWidth: '700px', margin: 'auto' };

function StepContainer(props: StepProps & { children }) {
    return <Paper>
        <Toolbar>
            <ToolbarTitle text={props.name} />
        </Toolbar>
        <LinearProgress mode="determinate" value={0} min={0} max={1} />
        <div style={stepperContentStyle}>
            {props.children}
        </div>
    </Paper>
}

class DiscoverStepper extends React.Component<ApplicationState & RouteComponentProps<RouteProps>> {
    currentStepName = () => this.props.match.params.step || 'seed';

    nextStep = () => this.props.history.push(Steps[Steps[this.currentStepName()] + 1]);
    previousStep = () => this.props.history.push(Steps[Steps[this.currentStepName()] - 1]);

    public render() {
        const step = this.currentStepName();
        const state = store.getState();

        // If we aren't ready, for this step, send us back to the first.
        // if (!steps.seed.progress(state) && step !== 'seed') {
        //     return <Redirect to='/seed' />
        // }

        return <div style={discovererStyle}>
            <Stepper activeStep={Steps[step]}
                renderHorizontalContentAs={StepContainer}>
                <Step name='Seed'>
                    <Seed />
                </Step>
                <Step name='Configure'>
                    <Configure />
                </Step>
                <Step name="Generate">
                    <Generate />
                </Step>
                <Step name="Save">
                    <Save />
                </Step>
            </Stepper>
            {/* <Stepper activeStep={Steps[step]}>
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
            </Paper> */}
        </div>;
    }
}

export default connect(state => state)(DiscoverStepper);