import * as React from 'react';

import { connect as reduxConnect } from 'react-redux';

type Diff<T extends string, U extends string> = ({[P in T]: P } & {[P in U]: never } & { [x: string]: never })[T];

/**
 * Type T without any of the properties on U.
 */
export type Minus<T, U> = Pick<T, Diff<keyof T, keyof U>>;


export type Component<PropsType> = { new(props: any): React.Component<PropsType>; } | ((props: PropsType) => JSX.Element | string | boolean | null | undefined);
type MapStateToProps<ReduxState, ComponentProps, ReduxProps> = (state?: ReduxState, props?: ComponentProps) => ReduxProps;
type ResultPropsType<ComponentProps, ReduxProps, ReduxActions> = Minus<Minus<ComponentProps, ReduxProps>, ReduxActions>;

export const connect = <ReduxState, ComponentProps extends ReduxProps | ReduxActions, ReduxProps = {}, ReduxActions = {}>(
    mapStateToProps: MapStateToProps<ReduxState, ComponentProps, ReduxProps>,
    mapDispatchToProps?: ReduxActions) =>
    <PropsType>(WrappedComponent: Component<PropsType>) =>
        reduxConnect(mapStateToProps, mapDispatchToProps)(WrappedComponent) as React.ComponentClass<ResultPropsType<PropsType, ReduxProps, ReduxActions>>;