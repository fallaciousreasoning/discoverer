import * as React from 'react';

import { Step, StepLabel, Stepper, Paper, Toolbar, ToolbarTitle } from 'material-ui';

import { RouteComponentProps } from 'react-router';

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

const components = {
    seed: <Seed />,
    configure: <div> configure </div>,
    generate: <div> generate </div>,
    save: <div> save </div>
};

const stepperContentStyle = { padding: "28px 16px" };

export default class DiscoverStepper extends React.Component<RouteComponentProps<RouteProps>> {
    public render() {
        const step = this.props.match.params.step;
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
                <Toolbar><ToolbarTitle text="Seed Tracks" /></Toolbar>
                <div style={stepperContentStyle}>
                    {components[step]}
                </div>
            </Paper>
        </div>;
    }
}