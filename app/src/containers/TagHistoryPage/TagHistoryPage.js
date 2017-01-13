
import React, { Component } from 'react'
import TagHistory from './TagHisotry'

export default class TagHistoryPage extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div key={`tag-history-page-${this.props.params.tag}`}>
        <TagHistory {...this.props}/>
      </div>
    )
  }
}
