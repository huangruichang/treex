
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { initBranchPage, createBranch, deleteBranch, closeFocuseWindow } from '../../actions'

const styles = require('./BranchPage.scss')

const mapStateToProps = (state) => {
  return {
    repo: state.repo.repo,
    currentBranch: state.repo.currentBranch,
    branches: state.repo.branches,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCreateBranchClick: (repo, branch, checkout = false) => {
      dispatch(createBranch(repo, branch, checkout))
    },
    onDeleteBranchClick: (repo, branches) => {
      dispatch(deleteBranch(repo, branches))
    },
    onCancelClick: () => {
      dispatch(closeFocuseWindow())
    },
  }
}

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class BranchPage extends Component {

  constructor(props) {
    super(props)
    this.currentBranch = ''
    this.checkoutNewBranch = false
    this.newBranchName = ''
    this.selectedBranchesMap = {}
  }

  componentWillMount() {
    const { store } = this.props
    const { project } = this.props.params
    store.dispatch(initBranchPage(project))
  }

  onCreateBranchClick() {
    this.props.onCreateBranchClick(this.props.repo, this.newBranchName, this.checkoutNewBranch)
  }

  onDeleteBranchClick() {
    let selectedBranches = Object.keys(this.selectedBranchesMap).map((key) => {
      return this.selectedBranchesMap[key]
    })
    this.props.onDeleteBranchClick(this.props.repo, selectedBranches)
  }

  render() {
    this.currentBranch = this.props.currentBranch
    let $newBranchPage = (
      <div>
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>当前分支:</label>
            <input className={styles.input} value={this.currentBranch || ''} onChange={(e) => {
              this.currentBranch = e.target.value
            }}/>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>新分支:</label>
            <input className={styles.input} onChange={(e) => {
              this.newBranchName = e.target.value
            }}/>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}></label>
            <input type="checkbox" id="checkout-new-branch-checkbox" onChange={(e) => {
              this.checkoutNewBranch = e.target.checked
            }}/>
            <label className={styles.label} style={{
              fontSize: 12,
              width: 'auto',
              marginTop: 10,
            }} htmlFor={"checkout-new-branch-checkbox"}>检出新分支</label>
          </div>
          <div className={styles.buttonGroup}>
            <div className={`${styles.button} ${styles.cancel}`} onClick={this.props.onCancelClick}>取消</div>
            <div className={`${styles.button} ${styles.submit}`} onClick={::this.onCreateBranchClick}>创建分支</div>
          </div>
        </div>
      </div>
    )
    let $deleteBranchPage = (
      <div>
        <div className={styles.title}>选择您想删除的分支:</div>
        <div className={styles.branchList}>
          <div className={styles.header}>
            <div style={{ width: '10%' }}></div>
            <div style={{ width: '60%', paddingLeft: 4 }}>分支名称</div>
            <div style={{ width: '30%', textAlign: 'right', paddingRight: 50 }}>类型</div>
          </div>
          <div className={styles.tableWrapper}>
            <table>
              <tbody>
              {
                this.props.branches.map((obj, index) => {
                  return <tr key={`branch-page-delete-branch-${index}`}>
                    <td style={{ width: '10%', padding: 0, paddingLeft: 10 }}>
                      <input type="checkbox" key={`branch-page-delete-option-${obj.name()}-${index}`} data-branch={obj.name()} onChange={(e) => {
                        let branch = e.target.dataset.branch
                        if (e.target.checked) {
                          this.selectedBranchesMap[branch] = branch
                        } else {
                          delete this.selectedBranchesMap[branch]
                        }
                      }}/>
                    </td>
                    <td style={{ width: '60%', padding: 0 }}>{obj.name()}</td>
                    <td style={{ width: '30%', padding: 0, textAlign: 'right', paddingRight: 50 }}>{obj.isRemote() === 1 ? '远端':'本地'}</td>
                  </tr>
                })
              }
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.form}>
          <div className={styles.buttonGroup}>
            <div className={`${styles.button} ${styles.cancel}`} onClick={this.props.onCancelClick}>取消</div>
            <div className={`${styles.button} ${styles.submit}`} onClick={::this.onDeleteBranchClick}>删除分支</div>
          </div>
        </div>
      </div>
    )
    let $Page = $newBranchPage
    if (this.props.params.action === 'delete') {
      $Page = $deleteBranchPage
    }

    return (
      <div className={styles.branchPage}>
        <div className={styles.navigator}>
          <Link className={styles.item} to={`/branch/${this.props.params.project}`} activeClassName={styles.active}>新建分支</Link>
          <Link className={styles.item} to={`/branch/${this.props.params.project}/delete`} activeClassName={styles.active}>删除分支</Link>
        </div>
        {$Page}
      </div>
    )
  }

}
