import { Button, LinearProgress, Paper, Toolbar } from '@material-ui/core';
import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { createSelector } from 'reselect';
import { Step, StepProps, Stepper } from 'src/components/Stepper';
import { connect } from 'src/connect';
import { getLinkProgress, getSeedProgress } from '../store';
import { getGenerationProgress } from '../store/generationStore';
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

const stepperContentStyle = { padding: "28px 16px 0px 16px" };
const controlBoxStyle = { marginTop: '12px' };
const nextButtonStyle = { margin: '12px' };
const discovererStyle = { width: '100%', maxWidth: '700px', margin: 'auto' };

function StepContainer(props: StepProps & { children }) {
    return <Paper>
        <Toolbar title={props.name}/>
        <LinearProgress variant="determinate" value={props.progress * 100 || 100} />
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
                    <Button
                        variant="raised"
                        disabled={props.firstStep}
                        onClick={this.previousStep}
                    >
                        Back
                    </Button>
                    <Button
                        color="primary"
                        onClick={this.nextStep}
                        disabled={!props.complete}
                        style={nextButtonStyle}
                    >
                        Next
                    </Button>
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