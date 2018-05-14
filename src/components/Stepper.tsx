import { Step as MUIStep, StepContent as MUIStepContent, StepLabel as MUIStepLabel, Stepper as MUIStepper } from 'material-ui';
import * as React from 'react';

interface StepProps {
    stepName: string;
}

export class Step extends React.Component<StepProps> {
    public render() {
        return this.props.children;
    }
}

interface Props {
    activeStep: number;
    vertical?: boolean;
    children: (Step) [];
}

export default class Stepper extends React.Component<Props> {
    public render() {
        const activeStep = this.props.children[this.props.activeStep];
        return <>
            <MUIStepper activeStep={this.props.activeStep} orientation={this.props.vertical ? 'vertical' : 'horizontal'}>
                {this.props.children.map(child => <MUIStep>
                    <MUIStepLabel>{child.props.stepName}</MUIStepLabel>
                    {this.props.vertical && <MUIStepContent>{child}</MUIStepContent>}
                </MUIStep>)}
            </MUIStepper>
            {!this.props.vertical && activeStep}
        </>;
    }
}