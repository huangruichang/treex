
import React, { Component, PropTypes } from 'react'
import DiffLine from './DiffLine'

const styles = require('./diff.scss')

export default class DiffPatch extends Component {

  static propTypes = {
    lines: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    const lines = this.props.lines
    const firstLine = lines[0]
    const lastLine = lines[lines.length - 1]
    let lineRange = <tr className={styles.lineRange}>
                      <td className={styles.lineNo}></td>
                      <td className={styles.lineNo}></td>
                      <td className={styles.symbol}></td>
                      <td>行{firstLine.newLineno()}-{lastLine.newLineno()}</td>
                    </tr>

    return (
      <pre className={styles.pathWrapper}>
        <table className={styles.patch} style={{ borderCollapse: 'collapse' }} cellpadding="0" cellspacing="0">
          <tbody>
          {lineRange}
          {this.props.lines.map((line, index) => {
            return <DiffLine line={line} key={`diff-line-${index}`}/>
          })}
          </tbody>
        </table>
      </pre>
    )
  }
}
