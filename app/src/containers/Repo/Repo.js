
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { SideBar } from '../../components'
import { loadRepo, initSideBar } from '../../actions'
import HisotryPage from '../HisotryPage/HistoryPage'
import { checkoutBranch, openCheckoutRemoteBranch } from '../../actions'

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
    store.dispatch(loadRepo(params.project))
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
        onCheckoutBranchClick={this.props.onCheckoutBranchClick}
        onCheckoutRemoteBranchClick={this.props.onCheckoutRemoteBranchClick}
      />
    :''
    return (
      <div className={styles.repo}>s
        <div className={styles.panelLeft}>
          {($sidebar)}
        </div>
        <div className={styles.panelRight}>
          {(Page)}
        </div>
      </div>
    )
  }

}
