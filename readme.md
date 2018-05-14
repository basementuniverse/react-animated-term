# React-Animated-Term

> Animated terminal component for [React](https://reactjs.org/)

<p align="center">
	<br>
	<img width="400" src="media/demo.gif">
	<br>
	<br>
</p>

## Installation

```
npm install --save react-animated-term
```

## Usage

The terminal commands and output lines are specified as an array of objects. The `text` field specifies the content of the line and `cmd` is used to specify whether the line is a command or an output. The `interval` prop specifies how often the terminal should be updated.

```js
import React from 'react'
import Terminal from 'react-animated-term'

class App extends React.Component {
  const termLines = [
    {
      'text': 'ls',
      'cmd': true
    },
    {
      'text': 'index.js    node_modules    README.md    package.json',
      'cmd': false
    },
    {
      'text': '',
      'cmd': true
    }
  ]
  return (
    <Terminal
      lines={termLines}
      interval={80}
    />
  )
}
```

### Framed Animation

<p align="center">
	<br>
	<img width="400" src="media/demo-frames.gif">
	<br>
	<br>
</p>

You can also render output that consists of frames by specifying the individual frames. With a framed output, the `text` field specifies the final output that should be rendered after all the frames have been rendered. Delays can also be specified for individual frames.

```js
import React from 'react'
import Terminal from 'react-animated-term'

class App extends React.Component {
  const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  const termLines = [
    {
      text: 'node example.js',
      cmd: true
    },
    {
      text: '✔ Loaded app',
      cmd: false,
      repeat: true,
      repeatCount: 2,
      frames: spinner.map(function (spinner) {
        return {
          text: spinner + ' Loading app',
          delay: 80
        }
      })
    },
    {
      text: '',
      cmd: true
    }
  ]
  return (
    <Terminal
      lines={termLines}
      interval={80}
    />
  )
}
```

### Props
| Property | Type | Default | Description |
|:---|:---|:---|:---|
| lines | array| [] | array of terminal lines |
| interval | number | 100 | interval at which terminal output is updated in milliseconds |

## Credits

The styling for the terminal was adapted from the [Hyper](https://hyper.is/) terminal.