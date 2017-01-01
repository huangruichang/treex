
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  initCheckoutRemoteBranchPage,
  closeFocuseWindow,
  checkoutRemoteBranch,
} from '../../actions'
import utils from '../../helpers/utils'

require('!style!css!sass!../common.scss')
const styles = require('./CheckoutRemotePage.scss')

const mapStateToProps = (state) => {
  return {
    repo: state.repo.repo,
    branches: state.repo.branches,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onCancelClick: () => {
      dispatch(closeFocuseWindow())
    },
    onSubmitClick: (repo, branchName, branchFullName) => {
      dispatch(checkoutRemoteBranch(repo, branchName, branchFullName.replace(/refs\/remotes\//, '')))
    },
  }
}

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class CheckoutRemotePage extends Component {

  constructor(props) {
    super(props)
    this.branchName = props.params.branch
  }

  componentWillMount() {
    const { store } = this.props
    const { project, branch } = this.props.params
    store.dispatch(initCheckoutRemoteBranchPage(project, branch))
  }

  componentWillReceiveProps(nextProps) {
    if (!this.selectedBranch) {
      this.selectedBranch = this.getSelectDefaultValue(
        this.getRemoteBranches(nextProps.branches),
        this.props.params.branch
      ).fullName.replace(/refs\/remotes\//g, '')
    }
  }

  getRemoteBranches(branches) {
    return utils.getRemoteBranches(branches)
  }

  getSelectDefaultValue(branches = [], branch) {
    let result = {}
    for (let obj of branches) {
      if (obj.name.indexOf(branch) != -1) {
        result = obj
      }
    }
    return result
  }

  render() {
    return (
      <form className={styles.form} onSubmit={() => { return false }}>
        <div className={styles.formGroup}>
          <label className={styles.label} for="remote_branches">检出远程分支:</label>
          {
            <select className={styles.input} value={
              this.selectedBranch
            } onChange={(e) => {
              this.selectedBranch = e.target.value
              this.forceUpdate()
            }}>
              {
                this.getRemoteBranches(this.props.branches).map((obj, index) => {
                  return <option key={`checkout-remote-branch-${index}`} value={obj.name}
                        >{obj.name}</option>
                })
              }
            </select>
          }
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} for="new_local_branch">新的本地分支名称:</label>
          <input className={styles.input} id="new_local_branch" type="text" defaultValue={this.branchName} onChange={(e) => {
            this.branchName = e.target.value
          }}/>
        </div>
        <div className={styles.buttonGroup}>
          <div className={`${styles.button} ${styles.cancel}`} onClick={this.props.onCancelClick}>取消</div>
          <div className={`${styles.button} ${styles.submit}`} onClick={() => {
            this.props.onSubmitClick(
              this.props.repo,
              this.branchName,
              this.selectedBranch,
            )
          }}>提交</div>
        </div>
      </form>
    )
  }
}
