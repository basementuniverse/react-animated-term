import React from 'react'
import PropTypes from 'prop-types'
import Terminal from './Terminal'
import termContent from './contentHandler'

const deepEqual = require('deep-equal')

class Renderer extends React.Component {
  constructor(props) {
    super(props)
    this.consoleRef = React.createRef()
    this.content = termContent(props.lines)
    this.state = {
      lines: this.content.next().value,
      completed: false,
    }
  }

  componentDidMount() {
    const props = this.props
    this.timer = setInterval(() => {
      const { value, done } = this.content.next()
      this.setState({
        lines: value,
      })
      if (done) {
        clearInterval(this.timer)
        this.setState({
          completed: true,
        })

        if (props.onComplete) {
          props.onComplete()
        }
      }
    }, this.props.interval)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  componentDidUpdate(prevProps) {
    // Keep the newest line in view as the content grows past the window
    if (this.props.autoScroll && this.consoleRef.current) {
      this.consoleRef.current.scrollTop = this.consoleRef.current.scrollHeight
    }

    if (!deepEqual(prevProps.lines, this.props.lines)) {
      clearInterval(this.timer)
      this.replay()
    }
  }

  replay() {
    const props = this.props
    this.content = termContent(props.lines)
    this.setState({
      completed: false,
    })
    this.timer = setInterval(() => {
      const { value, done } = this.content.next()
      this.setState({
        lines: value,
      })
      if (done) {
        clearInterval(this.timer)
        this.setState({
          completed: true,
        })

        if (props.onComplete) {
          props.onComplete()
        }
      }
    }, this.props.interval)
  }

  render() {
    return (
      <Terminal
        {...this.props}
        consoleRef={this.consoleRef}
        onReplay={() => this.replay()}
        completed={this.state.completed}
      >
        {this.state.lines}
      </Terminal>
    )
  }
}

Renderer.defaultProps = {
  interval: 100,
  lines: [],
  lineNumbers: false,
  renderLine: undefined,
  autoScroll: false,
  onComplete: undefined,
}

Renderer.propTypes = {
  interval: PropTypes.number,
  lines: PropTypes.array,
  lineNumbers: PropTypes.bool,
  renderLine: PropTypes.func,
  autoScroll: PropTypes.bool,
  onComplete: PropTypes.func,
}

export default Renderer
