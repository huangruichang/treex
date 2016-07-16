
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { HistoryList, SideBar, CommitFileList, CommitInfo, DiffPanel } from '../../components'
import { loadRepo } from '../../actions'
import HisotryPage from '../HisotryPage/HistoryPage'

require('!style!css!sass!../common.scss')
const styles = require('./Repo.scss')

const mapStateToProps = (state) => {
  return {
    repo: state.repo.repo,
    fileModifiedCount: state.repo.fileModifiedCount,
  }
}

@connect(
  mapStateToProps,
)
export default class Repo extends Component {

  static propTypes = {
    store: PropTypes.object,
    page: PropTypes.object,
  }

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { store, params } = this.props
    store.dispatch(loadRepo(params.project))
  }

  render() {
    let Page = this.props.page || <HisotryPage {...this.props}/>
    return (
      <div className={styles.repo}>
        <div className={styles.panelLeft}>
          <SideBar fileModifiedCount={this.props.fileModifiedCount} params={this.props.params}/>
        </div>
        <div className={styles.panelRight}>
          {(Page)}
        </div>
      </div>
    )
  }

}
