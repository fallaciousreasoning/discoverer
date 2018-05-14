import { Step as MUIStep, StepContent as MUIStepContent, StepLabel as MUIStepLabel, Stepper as MUIStepper } from 'material-ui';
import * as React from 'react';

export interface StepProps {
    name: string;
}

export class Step extends React.Component<StepProps> {
    public render() {
        return this.props.children;
    }
}

type StepType = { props: { name: string } };

interface Props {
    activeStep: number;
    vertical?: boolean;
    children: StepType[] | StepType;

    renderHorizontalContentAs?: string | React.ComponentType<StepProps> | React.ComponentType;
}

export class Stepper extends React.Component<Props> {
    public static defaultProps: Partial<Props> = {
        renderHorizontalContentAs: React.Fragment
    };

    public render() {
        const children = (Array.isArray(this.props.children) ? this.props.children : [this.props.children]) as { props: { name: string } }[];
        const activeStep = children[this.props.activeStep];
        
        return <>
            <MUIStepper activeStep={this.props.activeStep} orientation={this.props.vertical ? 'vertical' : 'horizontal'}>
                {children.map(child => child && <MUIStep key={child.props.name}>
                    <MUIStepLabel>{child.props.name}</MUIStepLabel>
                    {this.props.vertical ? <MUIStepContent>{child}</MUIStepContent> : <React.Fragment />}
                </MUIStep>)}
            </MUIStepper>
            {!this.props.vertical && <this.props.renderHorizontalContentAs {...activeStep.props}>
                {activeStep}
            </this.props.renderHorizontalContentAs>}
        </>;
    }
}