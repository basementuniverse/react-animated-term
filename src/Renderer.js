import React from 'react'
import PropTypes from 'prop-types'
import Terminal from './Terminal'
import termContent from './contentHandler'

const deepEqual = require('deep-equal')

class Renderer extends React.Component {
  constructor(props) {
    super(props)
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
  onComplete: undefined,
}

Renderer.propTypes = {
  interval: PropTypes.number,
  lines: PropTypes.array,
  onComplete: PropTypes.func,
}

export default Renderer
