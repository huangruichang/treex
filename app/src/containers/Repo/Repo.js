
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { SideBar } from '../../components'
import { loadRepo, initSideBar } from '../../actions'
import HisotryPage from '../HisotryPage/HistoryPage'
import { checkoutBranch } from '../../actions'

require('!style!css!sass!../common.scss')
const styles = require('./Repo.scss')

const mapStateToProps = (state) => {
  return {
    repo: state.repo.repo,
    fileModifiedCount: state.repo.fileModifiedCount,
    branches: state.repo.branches,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCheckoutBranchClick: (repo, branchName) => {
      dispatch(checkoutBranch(repo, branchName))
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

  componentWillMount() {
    const { store, params } = this.props
    store.dispatch(loadRepo(params.project))
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.repo && !!nextProps.repo) {
      const { repo, store } = nextProps
      store.dispatch(initSideBar(repo))
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
    return (
      <div className={styles.repo}>
        <div className={styles.panelLeft}>
          <SideBar
            fileModifiedCount={this.props.fileModifiedCount}
            localBranches={this.getLocalBranches(this.props.branches)}
            remoteBranches={this.getRemoteBranches(this.props.branches)}
            params={this.props.params}
            repo={this.props.repo}
            onCheckoutBranchClick={this.props.onCheckoutBranchClick}
          />
        </div>
        <div className={styles.panelRight}>
          {(Page)}
        </div>
      </div>
    )
  }

}
