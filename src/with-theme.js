import React from 'react'
import {CHANNEL} from './constants'
import PropTypes from './react-compat'

function generateWarningMessage(componentName) {
  // eslint-disable-next-line max-len
  return `glamorous warning: Expected component called "${componentName}" which uses withTheme to be within a ThemeProvider but none was found.`
}

export default function withTheme(ComponentToTheme) {
  class ThemedComponent extends React.Component {
    setTheme = theme => this.setState({theme})

    constructor(props, context) {
      super(props, context)
      let initialState;

      if (!context[CHANNEL]) {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.warn(
            generateWarningMessage(
              ComponentToTheme.displayName ||
                ComponentToTheme.name ||
                'Stateless Function',
            ),
          )
        }

        initialState = { theme: {} }
      } else {
        initialState = { theme: context[CHANNEL].getState() }
      }

      this.state = initialState;
    }

    componentDidMount() {
      if (this.context[CHANNEL]) {
        this.unsubscribe = this.context[CHANNEL].subscribe(this.setTheme)
      }
    }

    componentWillUnmount() {
      // cleanup subscription
      this.unsubscribe && this.unsubscribe()
    }

    render() {
      return <ComponentToTheme {...this.props} {...this.state} />
    }
  }

  ThemedComponent.contextTypes = {
    [CHANNEL]: PropTypes.object,
  }

  return ThemedComponent
}
