
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
    const symbolMap = {
      [Diff.LINE.ADDITION]: '+',
      [Diff.LINE.DELETION]: '-',
    }
    return (
      <tr className={ stateMap[this.props.line.origin()] }>
        <td className={styles.lineWrapper}>
          <div className={ styles.lineNo }>
            {
              this.props.line.oldLineno() !== -1 ?
                this.props.line.oldLineno() : ' '
            }
          </div>
        </td>
        <td className={styles.lineWrapper}>
          <div className={ styles.lineNo }>
            {
              this.props.line.newLineno() !== -1 ?
                this.props.line.newLineno() : ' '
            }
          </div>
        </td>
        <td className={ styles.symbol }>
          <span>{symbolMap[this.props.line.origin()] || ''}</span>
        </td>
        <td className={styles.content}>
          <div>
            <span>{this.props.line.content()}</span>
          </div>
        </td>
      </tr>
    )
  }

}
