import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

const cursor = <span className="Terminal-cursor" />
const prompt = <span className="Terminal-prompt">$ </span>

// Each line's text can span several rows (separated by newlines), which are
// rendered one at a time so that renderLine can style each row separately
const renderRow = (line, rowText, row, renderLine) =>
  renderLine ? renderLine({ ...line, text: rowText }, row) : rowText

const renderLines = (lines, renderLine) => {
  return lines.map((line) => {
    const rows = line.text.split('\n')

    return (
      <React.Fragment key={line.id}>
        {line.cmd ? prompt : ''}
        {rows.map((rowText, row) => (
          <React.Fragment key={row}>
            {row > 0 ? '\n' : ''}
            {renderRow(line, rowText, row, renderLine)}
          </React.Fragment>
        ))}
        {line.current ? cursor : ''}
        <br />
      </React.Fragment>
    )
  })
}

// Like an editor: commands are numbered rows of code, and output rows have an
// empty gutter
const renderNumberedLines = (lines, renderLine) => {
  let lineNumber = 0

  return lines.map((line) => {
    const rows = line.text.split('\n')

    return (
      <React.Fragment key={line.id}>
        {rows.map((rowText, row) => (
          <div
            key={row}
            className={classNames({
              'Terminal-row': true,
              'Terminal-row-output': !line.cmd,
            })}
          >
            <span className="Terminal-line-number">
              {line.cmd ? ++lineNumber : ''}
            </span>
            <span className="Terminal-row-content">
              {renderRow(line, rowText, row, renderLine)}
              {line.current && row === rows.length - 1 ? cursor : ''}
            </span>
          </div>
        ))}
      </React.Fragment>
    )
  })
}

const getWindowStyle = (white) => {
  return classNames({
    'Terminal-window': true,
    'Terminal-window-white': white,
  })
}

const getTerminalStyle = (code) => {
  return classNames({
    'Terminal-term': true,
    'Terminal-term-code': code,
  })
}

const getButtonStyle = (type) => {
  return classNames({
    'Terminal-btn': true,
    'Terminal-btn-close': type === 'close',
    'Terminal-btn-minimize': type === 'minimize',
    'Terminal-btn-maximize': type === 'maximize',
  })
}

const getBodyStyle = (code) => {
  return classNames({
    'Terminal-body': true,
    'Terminal-body-animated': !code,
  })
}

const getConsoleStyle = (code, white) => {
  return classNames({
    'Terminal-console': true,
    'Terminal-console-code': code,
    'Terminal-console-white': white,
  })
}

const Terminal = ({
  children,
  white,
  height,
  code,
  lineNumbers,
  renderLine,
  consoleRef,
  onReplay,
  completed,
}) => {
  const btnClassName = white
    ? 'Terminal-control-btn Terminal-control-btn-white'
    : 'Terminal-control-btn'

  return (
    <div className={getWindowStyle(white)}>
      <div
        className={getTerminalStyle(code)}
        style={height ? { height } : null}
      >
        <div className="Terminal-header">
          <span className={getButtonStyle('close')} />
          <span className={getButtonStyle('minimize')} />
          <span className={getButtonStyle('maximize')} />
        </div>
        <div className={getBodyStyle(code)}>
          <div className={getConsoleStyle(code, white)} ref={consoleRef}>
            {code ? (
              <code className="Terminal-code">{children}</code>
            ) : (
              <div>
                <div
                  className={classNames({
                    'Terminal-code': true,
                    'Terminal-code-numbered': lineNumbers,
                  })}
                >
                  {lineNumbers
                    ? renderNumberedLines(children, renderLine)
                    : renderLines(children, renderLine)}
                </div>
                {completed ? (
                  <a className={btnClassName} onClick={() => onReplay()}>
                    Replay
                  </a>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

Terminal.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  white: PropTypes.bool,
  height: PropTypes.number,
  code: PropTypes.bool,
  lineNumbers: PropTypes.bool,
  renderLine: PropTypes.func,
  consoleRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  onReplay: PropTypes.func,
  completed: PropTypes.bool,
}

export default Terminal
