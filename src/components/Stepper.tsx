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

type StepChildType = { props: { name: string } };
type ButtonChildType = (props: StepButtonProps) => JSX.Element;
type ChildType = StepChildType | (StepChildType | ButtonChildType)[] | ButtonChildType;

interface StepButtonProps {
    currentStepProps: StepProps;
}

interface Props {
    activeStep: number;
    vertical?: boolean;
    children: ChildType;

    renderHorizontalContentAs?: string | React.ComponentType<StepProps> | React.ComponentType;
}

export class Stepper extends React.Component<Props> {
    public static defaultProps: Partial<Props> = {
        renderHorizontalContentAs: React.Fragment
    };

    public render() {
        const children = (Array.isArray(this.props.children) ? this.props.children : [this.props.children]) as (StepChildType | ButtonChildType)[];
        const buttons: ButtonChildType[] = [];
        const steps: StepChildType[] = [];

        // TODO reduce rerendering
        children.forEach(child => {
            if (typeof child === "function") {
                buttons.push(child);
            } else {
                steps.push(child);
            }
        });

        const activeStep = steps[this.props.activeStep];

        return <>
            <MUIStepper activeStep={this.props.activeStep} orientation={this.props.vertical ? 'vertical' : 'horizontal'}>
                {steps.map(step => step && <MUIStep key={step.props.name}>
                    <MUIStepLabel>{step.props.name}</MUIStepLabel>
                    {this.props.vertical ? <MUIStepContent>{step}</MUIStepContent> : <React.Fragment />}
                </MUIStep>)}
            </MUIStepper>
            {!this.props.vertical && <this.props.renderHorizontalContentAs {...activeStep.props}>
                {activeStep}
                {buttons.map((button, i) => <React.Fragment key={i}>
                    {button({ currentStepProps: activeStep.props })}
                </React.Fragment>)}
            </this.props.renderHorizontalContentAs>}
        </>;
    }
}