
import React, { Component, PropTypes } from 'react'
import DiffPatch from './DiffPatch'

export default class DiffPanel extends Component {

  static propTypes = {
    patches: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <table style={{ minWidth: '100%' }}>
        <tbody>
        <tr>
          <td>
            {this.props.patches.map((patch, index) => {
              return <DiffPatch lines={patch} key={`diff-patch-${index}`}/>
            })}
          </td>
        </tr>
        </tbody>
        </table>
      </div>
    )
  }
}
