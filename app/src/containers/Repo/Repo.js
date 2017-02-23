
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import { SideBar } from '../../components'
import { loadRepo, loadSubRepo, initSideBar } from '../../actions'
import HisotryPage from '../HisotryPage/HistoryPage'
import {
  checkoutBranch,
  openCheckoutRemoteBranch,
  openPullPage,
  openPushPage,
  openModalStash,
  openTerminal,
  openModalBranch,
  openSubmodule,
} from '../../actions'

require('!style!css!sass!../common.scss')
const styles = require('./Repo.scss')

const mapStateToProps = (state) => {
  return {
    repo: state.repo.repo,
    fileModifiedCount: state.repo.fileModifiedCount,
    branches: state.repo.branches,
    checkoutWindow: state.repo.checkoutWindow,
    projectName: state.repo.projectName,
    stashes: state.repo.stashes,
    tags: state.repo.tags,
    submodules: state.repo.submodules,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCheckoutBranchClick: (repo, branchName) => {
      dispatch(checkoutBranch(repo, branchName))
    },
    onCheckoutRemoteBranchClick: (projectName, branchName) => {
      dispatch(openCheckoutRemoteBranch(projectName, branchName))
    },
    onPullPageClick: (projectName) => {
      dispatch(openPullPage(projectName))
    },
    onPushPageClick: (projectName) => {
      dispatch(openPushPage(projectName))
    },
    onStashClick: (projectName) => {
      dispatch(openModalStash(projectName, -1, 'save'))
    },
    onTerminalClick: (projectName) => {
      dispatch(openTerminal(projectName))
    },
    onBranchClick: (projectName) => {
      dispatch(openModalBranch(projectName))
    },
    onSubmoduleClick: (projectName, subName) => {
      dispatch(openSubmodule(projectName, subName))
    },
  }
}

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class Repo extends Component {

  static propTypes = {
    store: PropTypes.object,
    page: PropTypes.object,
  }

  constructor(props) {
    super(props)
  }

  refreshBranches() {
    const { store } = this.props
    store.dispatch()
  }

  componentWillMount() {
    const { store, params } = this.props
    if (params.sub) {
      store.dispatch(loadSubRepo(params.project, params.sub))
      document.title = params.sub
    } else {
      store.dispatch(loadRepo(params.project))
      document.title = params.project
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.repo && !!nextProps.repo) {
      const { repo, store } = nextProps
      setTimeout(() => {
        store.dispatch(initSideBar(repo))
      }, 200)
    }
  }

  getLocalBranches(branches) {
    let localBranches = branches.filter((branch) => {
      return branch.name().indexOf('refs/heads') != -1
    })
    localBranches = localBranches.map((branch) => {
      return {
        name: branch.name().replace(/refs\/heads\//g, ''),
        path: branch.name(),
        isHead: branch.isHead(),
      }
    })
    return localBranches
  }

  getRemoteBranches(branches) {
    let _branchNames = []

    let remoteBranches = branches.filter((branch) => {
      for (let _branchName of _branchNames) {
        if (_branchName === branch.name()) {
          return false
        }
      }
      _branchNames.push(branch.name())
      return branch.name().indexOf('refs/remotes') != -1
    })
    remoteBranches = remoteBranches.map((branch) => {
      return {
        name: branch.name().replace(/refs\/remotes\//g, '').split('\/')[1],
        path: branch.name(),
        isHead: branch.isHead(),
      }
    })
    return remoteBranches
  }

  onCommitClick() {
    hashHistory.push(`/repo/${this.props.projectName}/fileState/commit`)
  }

  onPullPageClick() {
    this.props.onPullPageClick(this.props.projectName)
  }

  onPushPageClick() {
    this.props.onPushPageClick(this.props.projectName)
  }

  onStashClick() {
    this.props.onStashClick(this.props.projectName)
  }

  onTerminalClick() {
    this.props.onTerminalClick(this.props.projectName)
  }

  onBranchClick() {
    this.props.onBranchClick(this.props.projectName)
  }

  render() {
    let Page = this.props.page || <HisotryPage {...this.props}/>
    let $sidebar = this.props.repo?
      <SideBar
        fileModifiedCount={this.props.fileModifiedCount}
        localBranches={this.getLocalBranches(this.props.branches)}
        remoteBranches={this.getRemoteBranches(this.props.branches)}
        params={this.props.params}
        repo={this.props.repo}
        projectName={this.props.projectName}
        stashes={this.props.stashes}
        tags={this.props.tags}
        submodules={this.props.submodules}
        onCheckoutBranchClick={this.props.onCheckoutBranchClick}
        onCheckoutRemoteBranchClick={this.props.onCheckoutRemoteBranchClick}
        onSubmoduleClick={this.props.onSubmoduleClick}
      />
    :''
    return (
      <div className={styles.repo}>
        <div className={styles.topMenu}>
          <div className={styles.group} style={{
            margin: '0 60px 0 10px',
          }}>
            <div className={styles.button} onClick={::this.onCommitClick}>
              <i className={'add big'}></i>
              <div>提交</div>
            </div>
          </div>
          <div className={styles.group}>
            <div className={styles.button} onClick={::this.onPullPageClick}>
              <i className={'pull big'}></i>
              <div>拉取</div>
            </div>
            <div className={styles.button} onClick={::this.onPushPageClick}>
              <i className={'push big'}></i>
              <div>推送</div>
            </div>
          </div>
          <div className={styles.group}>
            <div className={styles.button} onClick={::this.onBranchClick}>
              <i className={'branch big'}></i>
              <div>分支</div>
            </div>
            {/*<div className={styles.button}>
              <i className={'merge big'}></i>
              <div>合并</div>
            </div>*/}
          </div>
          <div className={styles.group}>
            <div className={styles.button} onClick={::this.onStashClick}>
              <i className={'boxDot big'}></i>
              <div>暂存</div>
            </div>
          </div>
          <div className={styles.group} style={{
            float: 'right',
            marginRight: 10,
          }}>
            <div className={styles.button} onClick={::this.onTerminalClick}>
              <i className={'terminal big'}></i>
              <div>终端</div>
            </div>
            <div className={styles.button}>
              <i className={'setting big'}></i>
              <div>设置</div>
            </div>
          </div>
        </div>
        <div className={styles.main}>
          <div className={styles.panelLeft}>
            {($sidebar)}
          </div>
          <div className={styles.panelRight}>
            {(Page)}
          </div>
        </div>
      </div>
    )
  }

}
