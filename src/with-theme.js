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
      let initialState = { theme: {} }

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
      } else {
        initialState = { theme: context[CHANNEL].getState() }
      }

      if (context[CHANNEL]) {
        this.unsubscribe = context[CHANNEL].subscribe(this.setTheme)
      }

      this.state = initialState;
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
