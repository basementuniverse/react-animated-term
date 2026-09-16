'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cursor = _react2.default.createElement('span', { className: 'Terminal-cursor' });
var prompt = _react2.default.createElement(
  'span',
  { className: 'Terminal-prompt' },
  '$ '
);

// Each line's text can span several rows (separated by newlines), which are
// rendered one at a time so that renderLine can style each row separately
var renderRow = function renderRow(line, rowText, row, renderLine) {
  return renderLine ? renderLine((0, _extends3.default)({}, line, { text: rowText }), row) : rowText;
};

var renderLines = function renderLines(lines, renderLine) {
  return lines.map(function (line) {
    var rows = line.text.split('\n');

    return _react2.default.createElement(
      _react2.default.Fragment,
      { key: line.id },
      line.cmd ? prompt : '',
      rows.map(function (rowText, row) {
        return _react2.default.createElement(
          _react2.default.Fragment,
          { key: row },
          row > 0 ? '\n' : '',
          renderRow(line, rowText, row, renderLine)
        );
      }),
      line.current ? cursor : '',
      _react2.default.createElement('br', null)
    );
  });
};

// Like an editor: commands are numbered rows of code, and output rows have an
// empty gutter
var renderNumberedLines = function renderNumberedLines(lines, renderLine) {
  var lineNumber = 0;

  return lines.map(function (line) {
    var rows = line.text.split('\n');

    return _react2.default.createElement(
      _react2.default.Fragment,
      { key: line.id },
      rows.map(function (rowText, row) {
        return _react2.default.createElement(
          'div',
          {
            key: row,
            className: (0, _classnames2.default)({
              'Terminal-row': true,
              'Terminal-row-output': !line.cmd
            })
          },
          _react2.default.createElement(
            'span',
            { className: 'Terminal-line-number' },
            line.cmd ? ++lineNumber : ''
          ),
          _react2.default.createElement(
            'span',
            { className: 'Terminal-row-content' },
            renderRow(line, rowText, row, renderLine),
            line.current && row === rows.length - 1 ? cursor : ''
          )
        );
      })
    );
  });
};

var getWindowStyle = function getWindowStyle(white) {
  return (0, _classnames2.default)({
    'Terminal-window': true,
    'Terminal-window-white': white
  });
};

var getTerminalStyle = function getTerminalStyle(code) {
  return (0, _classnames2.default)({
    'Terminal-term': true,
    'Terminal-term-code': code
  });
};

var getButtonStyle = function getButtonStyle(type) {
  return (0, _classnames2.default)({
    'Terminal-btn': true,
    'Terminal-btn-close': type === 'close',
    'Terminal-btn-minimize': type === 'minimize',
    'Terminal-btn-maximize': type === 'maximize'
  });
};

var getBodyStyle = function getBodyStyle(code) {
  return (0, _classnames2.default)({
    'Terminal-body': true,
    'Terminal-body-animated': !code
  });
};

var getConsoleStyle = function getConsoleStyle(code, white) {
  return (0, _classnames2.default)({
    'Terminal-console': true,
    'Terminal-console-code': code,
    'Terminal-console-white': white
  });
};

var Terminal = function Terminal(_ref) {
  var children = _ref.children,
      white = _ref.white,
      height = _ref.height,
      code = _ref.code,
      lineNumbers = _ref.lineNumbers,
      renderLine = _ref.renderLine,
      consoleRef = _ref.consoleRef,
      onReplay = _ref.onReplay,
      completed = _ref.completed;

  var btnClassName = white ? 'Terminal-control-btn Terminal-control-btn-white' : 'Terminal-control-btn';

  return _react2.default.createElement(
    'div',
    { className: getWindowStyle(white) },
    _react2.default.createElement(
      'div',
      {
        className: getTerminalStyle(code),
        style: height ? { height: height } : null
      },
      _react2.default.createElement(
        'div',
        { className: 'Terminal-header' },
        _react2.default.createElement('span', { className: getButtonStyle('close') }),
        _react2.default.createElement('span', { className: getButtonStyle('minimize') }),
        _react2.default.createElement('span', { className: getButtonStyle('maximize') })
      ),
      _react2.default.createElement(
        'div',
        { className: getBodyStyle(code) },
        _react2.default.createElement(
          'div',
          { className: getConsoleStyle(code, white), ref: consoleRef },
          code ? _react2.default.createElement(
            'code',
            { className: 'Terminal-code' },
            children
          ) : _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              'div',
              {
                className: (0, _classnames2.default)({
                  'Terminal-code': true,
                  'Terminal-code-numbered': lineNumbers
                })
              },
              lineNumbers ? renderNumberedLines(children, renderLine) : renderLines(children, renderLine)
            ),
            completed ? _react2.default.createElement(
              'a',
              { className: btnClassName, onClick: function onClick() {
                  return onReplay();
                } },
              'Replay'
            ) : null
          )
        )
      )
    )
  );
};

Terminal.propTypes = {
  children: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.string]),
  white: _propTypes2.default.bool,
  height: _propTypes2.default.number,
  code: _propTypes2.default.bool,
  lineNumbers: _propTypes2.default.bool,
  renderLine: _propTypes2.default.func,
  consoleRef: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.object]),
  onReplay: _propTypes2.default.func,
  completed: _propTypes2.default.bool
};

exports.default = Terminal;