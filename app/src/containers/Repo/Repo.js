
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { HistoryList, SideBar, Graph } from '../../components'
import { loadRepo, initHistories, initSideBar } from '../../actions'

const styles = require('./Repo.scss')

const mapStateToProps = (state) => {
  return {
    repo: state.repo.repo,
    histories: state.repo.histories,
    headCommit: state.repo.historiesHeadCommit,
    currentCommit: state.repo.historiesCurrentCommit,
    fileModifiedCount: state.repo.fileModifiedCount,
  }
}

@connect(
  mapStateToProps,
)
export default class Repo extends Component {

  static propTypes = {
    store: PropTypes.object,
  }

  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.repo && !!nextProps.repo) {
      const { repo, store } = nextProps
      store.dispatch(initHistories(repo))
      store.dispatch(initSideBar(repo))
    }
    if (this.props.histories.length != nextProps.histories.length) {
      const { headCommit, currentCommit } = nextProps
    }
  }

  componentWillMount() {
    const { store, params } = this.props
    store.dispatch(loadRepo(params.project))
  }

  render() {
    return (
      <div>
        <div className={styles.panelLeft}>
          <SideBar fileModifiedCount={this.props.fileModifiedCount}/>
        </div>
        <div className={styles.panelRight}>
          <HistoryList histories={this.props.histories}/>
        </div>
      </div>
    )
  }

}
