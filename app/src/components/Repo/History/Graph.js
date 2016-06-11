
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

const styles = require('./history.scss')

const mapStateToProps = (state) => {
  return {
    headCommit: state.repo.historiesHeadCommit,
    currentCommit: state.repo.historiesCurrentCommit,
  }
}

@connect(
  mapStateToProps
)
export default class Graph extends Component {

  static propTypes = {
    headCommit: PropTypes.object,
    currentCommit: PropTypes.object,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={styles.graph}>
        Graph
      </div>
    )

  }

}
