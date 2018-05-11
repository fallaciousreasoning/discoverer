/**
 * This file is a modified version of the one found at https://github.com/rt2zz/redux-persist/blob/c9ae1903c3c5dea8604dd79ceea50c8a0a64f8fd/src/integration/react.js
 * because they use babel style imports for react so it wasn't compiling.
 */
import * as React from 'react';
import { Persistor } from 'redux-persist';

interface Props {
  onBeforeLift?: Function,
  children?: React.ReactNode | ((bootstrapped: boolean) => React.ReactNode),
  loading?: Node,
  persistor: Persistor,
}

interface State {
  bootstrapped: boolean,
}

export class PersistGate extends React.PureComponent<Props, State> {
  static defaultProps = {
    loading: null,
  }

  state = {
    bootstrapped: false,
  }

  unsubscribe?: () => any;

  componentDidMount() {
    this.unsubscribe = this.props.persistor.subscribe(this.handlePersistorState);
    this.handlePersistorState()
  }

  handlePersistorState = () => {
    const { persistor } = this.props
    let { bootstrapped } = persistor.getState()
    if (bootstrapped) {
      if (this.props.onBeforeLift) {
        Promise.resolve(this.props.onBeforeLift())
          .then(() => this.setState({ bootstrapped: true }))
          .catch(() => this.setState({ bootstrapped: true }))
      } else {
        this.setState({ bootstrapped: true })
      }
      this.unsubscribe && this.unsubscribe()
    }
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  render() {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof this.props.children === 'function' && this.props.loading)
        console.error('redux-persist: PersistGate expects either a function child or loading prop, but not both. The loading prop will be ignored.')
    }
    if (typeof this.props.children === 'function') {
      return this.props.children(this.state.bootstrapped)
    }

    return this.state.bootstrapped ? this.props.children : this.props.loading
  }
}