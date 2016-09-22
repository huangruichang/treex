
import React, { Component } from 'react'
import HistoryPage from '../HisotryPage/HistoryPage'

export default class BranchHistoryPage extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div key={`branch-history-page-${this.props.params.branch}`}>
        <HistoryPage {...this.props}/>
      </div>
    )
  }
}
