
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  initCheckoutRemoteBranchPage,
  closeFocuseWindow,
  checkoutRemoteBranch,
} from '../../actions'

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
  }

  componentWillMount() {
    const { store } = this.props
    const { project, branch } = this.props.params
    store.dispatch(initCheckoutRemoteBranchPage(project, branch))
  }

  getRemoteBranches(branches) {
    let remoteBranches = branches.filter((branch) => {
      return branch.name().indexOf('refs/remotes') != -1
    })
    remoteBranches = remoteBranches.map((branch) => {
      return {
        name: branch.name().replace(/refs\/remotes\//g, ''),
        path: branch.name(),
        isHead: branch.isHead(),
        fullName: branch.name(),
      }
    })
    return remoteBranches
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
              this.getSelectDefaultValue(
              this.getRemoteBranches(this.props.branches),
              this.props.params.branch
              ).name
            }>
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
          <input className={styles.input} id="new_local_branch" type="text" defaultValue={this.props.params.branch}/>
        </div>
        <div className={styles.buttonGroup}>
          <div className={`${styles.button} ${styles.cancel}`} onClick={this.props.onCancelClick}>取消</div>
          <div className={`${styles.button} ${styles.submit}`} onClick={() => {
            this.props.onSubmitClick(
              this.props.repo,
              this.props.params.branch,
              this.getSelectDefaultValue(
                this.getRemoteBranches(this.props.branches),
                this.props.params.branch
              ).fullName
            )
          }}>提交</div>
        </div>
      </form>
    )
  }
}
