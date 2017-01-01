
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  initPullPage,
  closeFocuseWindow,
  pull,
} from '../../actions'
import utils from '../../helpers/utils'

require('!style!css!sass!../common.scss')
const styles = require('./PullPage.scss')

const mapStateToProps = (state) => {
  return {
    repo: state.repo.repo,
    branches: state.repo.branches,
    currentBranch: state.repo.currentBranch,
    currentOrigin: state.repo.currentOrigin,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCancelClick: () => {
      dispatch(closeFocuseWindow())
    },
    onSubmitClick: (repo, origin, branch) => {
      dispatch(pull(repo, origin, branch))
    },
  }
}

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class PullPage extends Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { store } = this.props
    const { project } = this.props.params
    store.dispatch(initPullPage(project))
  }

  getSelectedDefaultBranch(branches = [], branch = 'master') {
    let result = {}
    for (let obj of branches) {
      if (obj.fullName.indexOf(branch) != -1) {
        result = obj
      }
    }
    return result
  }

  getSelectedDefaultOrigin(origins = [], origin = 'origin') {
    let result = {}
    for (let obj of origins) {
      if (origin.indexOf(obj.origin) != -1) {
        result = obj
      }
    }
    return result
  }

  onSubmitClick() {
    this.props.onSubmitClick(this.props.repo, this.selectedOrigin, this.selectedBranch)
  }

  render() {

    let localBranches = utils.getLocalBranches(this.props.branches)
    let remoteBranches = utils.getRemoteBranches(this.props.branches)
    let origins = utils.getOrigins(remoteBranches)
    let defaultBranch = this.getSelectedDefaultBranch(localBranches, this.props.currentBranch && this.props.currentBranch.name())
    let defaultOrigin = this.getSelectedDefaultOrigin(origins, this.props.currentOrigin && this.props.currentOrigin.name())

    if (!(this.selectedOrigin && this.selectedBranch)) {
      this.selectedOrigin = defaultOrigin.origin
      this.selectedBranch = defaultBranch.name
    }

    return (
      <form className={styles.form} onSubmit={() => { return false }}>
        <div className={styles.formGroup}>
          <label className={styles.label} for="remote_branches">从仓库拉取:</label>
          <select className={styles.input} value={this.selectedOrigin} onChange={(e) => {
            this.selectedOrigin = e.target.value
            this.forceUpdate()
          }}>
            {
              origins.map((obj, index) => {
                return <option key={`pull-page-origin-${index}`} value={obj.origin}>{obj.origin}</option>
              })
            }
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>要拉取的远程分支:</label>
          <select className={styles.input} value={this.selectedBranch} onChange={(e) => {
            this.selectedBranch = e.target.value
            this.forceUpdate()
          }}>
            {
              localBranches.map((obj, index) => {
                return <option key={`pull-page-local-branch-${index}`} value={obj.name}>{obj.name}</option>
              })
            }
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>拉取到本地分支:</label>
          <div className={styles.input}>{this.props.currentBranch && this.props.currentBranch.name().split('\/').reverse()[0]}</div>
        </div>
        <div className={styles.buttonGroup}>
          <div className={`${styles.button} ${styles.cancel}`} onClick={this.props.onCancelClick}>取消</div>
          <div className={`${styles.button} ${styles.submit}`} onClick={::this.onSubmitClick}>确定</div>
        </div>
      </form>
    )
  }
}
