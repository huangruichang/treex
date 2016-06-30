
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
    return (
      <table className={styles.patch}>
        <tbody>
        {this.props.lines.map((line, index) => {
          return <DiffLine line={line} key={`diff-line-${index}`}/>
        })}
        </tbody>
      </table>
    )
  }
}
