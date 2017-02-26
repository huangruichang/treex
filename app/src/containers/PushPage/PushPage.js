
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CredModal } from '../../components'
import {
  initPushPage,
  push,
  closeFocuseWindow,
  endValidating,
} from '../../actions'
import utils from '../../helpers/utils'

require('!style!css!sass!../common.scss')
const styles = require('./PushPage.scss')

const mapStateToProps = (state) => {
  return {
    repo: state.repo.repo,
    branches: state.repo.branches,
    currentBranch: state.repo.currentBranch,
    currentOrigin: state.repo.currentOrigin,
    remotes: state.repo.remotes,
    validating: state.repo.validating,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCancelClick: () => {
      dispatch(closeFocuseWindow())
    },
    onSubmitClick: (repo, origin, branches, userName, password) => {
      dispatch(push(repo, origin, branches, userName, password))
    },
    endValidating: () => {
      dispatch(endValidating())
    },
  }
}

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class PushPage extends Component {

  constructor(props) {
    super(props)
    this.selectedOriginPath = ''
    this.selectedOrigin = ''
    this.selectedBranch = ''
    this.selectedBranches = []
    this.userName = ''
    this.password = ''
  }

  componentWillMount() {
    const { store } = this.props
    const { project } = this.props.params
    store.dispatch(initPushPage(project))
  }

  getSelectedDefaultBranch(branches = [], branch = 'master') {
    return utils.getSelectedDefaultBranch(branches, branch)
  }

  getSelectedDefaultOrigin(origins = [], origin = 'origin') {
    return utils.getSelectedDefaultOrigin(origins, origin)
  }

  handleLocalBranches(localBranches = [], remoteBranches = [], origin = 'origin') {
    localBranches.map((localBranch) => {
      remoteBranches.map((remoteBranch) => {
        if (remoteBranch.fullName.indexOf(localBranch.name) != -1 &&
            remoteBranch.fullName.indexOf(origin) != -1) {
          localBranch.remoteName = remoteBranch.name
        }
      })
    })
  }

  onSelectAllClick(e) {
    if (e.target.checked) {
      this.selectedBranches = utils.getLocalBranches(this.props.branches)
    } else {
      this.selectedBranches = []
    }
  }

  onSelectBranchClick(e, branch) {
    if (e.target.checked) {
      this.selectedBranches.push(branch)
    } else {
      this.selectedBranches = this.selectedBranches.filter((obj) => {
        return branch.path !== obj.path
      })
    }
  }

  onSubmitClick() {
    this.props.onSubmitClick(this.props.repo, this.selectedOrigin, this.selectedBranches, this.userName, this.password)
  }

  isSelected(branches, branch) {
    let flag = false
    branches.map((obj) => {
      if (obj.path === branch.path) {
        flag = true
      }
    })
    return flag
  }

  render() {

    let localBranches = utils.getLocalBranches(this.props.branches)
    let remoteBranches = utils.getRemoteBranches(this.props.branches)
    let origins = utils.getOrigins(remoteBranches)
    let defaultBranch = this.getSelectedDefaultBranch(localBranches, this.props.currentBranch && this.props.currentBranch.name())
    let defaultOrigin = this.getSelectedDefaultOrigin(origins, this.props.currentOrigin && this.props.currentOrigin.name())
    let $credModal = this.props.validating?<CredModal
      onConfirmCallback={() => {
        this.props.endValidating()
        this.onSubmitClick()
      }}
      userNameSetter={(userName) => {
        this.userName = userName
      }}
      passwordSetter={(password) => {
        this.password = password
      }}
      onCloseCallback={() => {
        this.props.endValidating()
      }}
    />:''

    if (!(this.selectedOrigin && this.selectedBranch)) {
      this.selectedOrigin = defaultOrigin.origin
      this.selectedBranch = defaultBranch.name
      this.props.remotes.map((remote) => {
        if (remote.name() == this.selectedOrigin) {
          this.selectedOriginPath = remote.url()
        }
      })
      if (this.props.currentBranch) {
        this.selectedBranches = [{
          name: this.props.currentBranch.name().replace(/refs\/heads\//g, ''),
          path: this.props.currentBranch.name(),
          isHead: this.props.currentBranch.isHead(),
          fullName: this.props.currentBranch.name(),
        }]
      }
    }

    this.handleLocalBranches(localBranches, remoteBranches, this.selectedOrigin)

    return (
      <form className={styles.form} onSubmit={() => { return false }}>
        <div className={styles.formGroupInline}>
          <span className={styles.originText}>推送到仓库:</span>
          <select className={styles.select} value={this.selectedOrigin} onChange={(e) => {
            this.selectedOrigin = e.target.value
            this.props.remotes.map((remote) => {
              if (remote.name() == this.selectedOrigin) {
                this.selectedOriginPath = remote.url()
              }
            })
            this.forceUpdate()
          }}>
            {
              origins.map((obj, index) => {
                return <option key={`push-page-origin-${index}`} value={obj.origin}>{obj.origin}</option>
              })
            }
          </select>
          <input type="text" disabled="disabled" className={styles.grayInput} value={this.selectedOriginPath}/>
        </div>
        <div className={styles.branchListTitle}>要推送的分支</div>
        <div className={styles.branchList}>
          <div className={styles.header}>
            <div className={styles.item}>推送</div>
            <div className={styles.item}>本地分支</div>
            <div className={styles.item}>远程分支</div>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <tbody>
              {
                localBranches.map((obj, index) => {
                  return <tr key={`push-page-local-branch-${index}`}>
                          <td><input key={`push-page-local-branch-option-${index}`} type="checkbox" checked={this.isSelected(this.selectedBranches, obj)?'checked':''} onChange={(e) => {
                            this.onSelectBranchClick(e, obj)
                            this.forceUpdate()
                          }}/></td>
                          <td>{obj.name}</td>
                          <td>{obj.remoteName}</td>
                        </tr>
                })
              }
              </tbody>
            </table>
          </div>
          <div>
            <input id="select-all" type="checkbox" onChange={(e) => {
              this.onSelectAllClick(e)
              this.forceUpdate()
            }}/>
            <label className={'f12'} for="select-all">全选</label>
          </div>
        </div>
        <div className={styles.buttonGroup}>
          <div className={`${styles.button} ${styles.cancel}`} onClick={this.props.onCancelClick}>取消</div>
          <div className={`${styles.button} ${styles.submit}`} onClick={::this.onSubmitClick}>确定</div>
        </div>
        {$credModal}
      </form>
    )
  }

}
