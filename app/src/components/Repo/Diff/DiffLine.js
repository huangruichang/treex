
import { Diff } from 'nodegit'
import React, { Component, PropTypes } from 'react'

const styles = require('./diff.scss')

export default class DiffLine extends Component {

  static propTypes = {
    line: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const stateMap = {
      [Diff.LINE.ADDITION]: styles.addition,
      [Diff.LINE.DELETION]: styles.deletion,
      [Diff.LINE.CONTEXT]: 'context',
    }
    return (
      <tr className={ stateMap[this.props.line.origin()] }>
        <td>
          {
            this.props.line.oldLineno() !== -1 ?
              this.props.line.oldLineno() : ' '
          }
        </td>
        <td>
          {
            this.props.line.newLineno() !== -1 ?
              this.props.line.newLineno() : ' '
          }
        </td>
        <td className={styles.content}>
          <div>{this.props.line.content()}</div>
        </td>
      </tr>
    )
  }

}
