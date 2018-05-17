import React from 'react'
import brcast from 'brcast'
import {CHANNEL} from './constants'
import PropTypes from './react-compat'

export default class ThemeProvider extends React.Component {
  static childContextTypes = {
    [CHANNEL]: PropTypes.object.isRequired,
  }

  static contextTypes = {
    [CHANNEL]: PropTypes.object,
  }

  static propTypes = {
    theme: PropTypes.object.isRequired,
    children: PropTypes.node,
  }

  constructor(props, context) {
    super(props, context)

    this.broadcast = brcast(props.theme)

    if (context[CHANNEL]) {
      this.setOuterTheme(context[CHANNEL].getState())
      this.broadcast.setState(this.getTheme())
    }
  }

  getTheme(passedTheme) {
    const theme = passedTheme || this.props.theme
    return {...this.outerTheme, ...theme}
  }

  getChildContext() {
    return {
      [CHANNEL]: this.broadcast,
    }
  }

  setOuterTheme = theme => {
    this.outerTheme = theme
  }

  componentDidMount() {
    if (this.context[CHANNEL]) {
      this.unsubscribe = this.context[CHANNEL].subscribe(this.setOuterTheme)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.theme !== this.props.theme) {
      this.broadcast.setState(this.getTheme(this.props.theme))
    }
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  render() {
    return this.props.children ?
      React.Children.only(this.props.children) :
      null
  }
}
