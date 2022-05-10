/* eslint-disable class-methods-use-this */
import React from 'react';
// import SimpleLoader from '../loader/SimpleLoader';


export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  componentDidCatch(error, info) {
    console.log(error, info);
    const logRecord = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      info
    };
    this.setState({ error: logRecord });
  }

  render() {
    if (this.state.error) {
      return (
        this.state.error.message
      );
    }
    return this.props.children;
  }
}
