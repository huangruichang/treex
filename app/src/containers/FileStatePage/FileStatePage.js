
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { CommitFileList, DiffPanel } from '../../components'
import {
  loadUnstagedFiles,
  loadStagedFiles,
  loadDiffLines,
  RESET_DIFF_LINES,
} from '../../actions'

require('!style!css!sass!../common.scss')
const styles = require('./FileState.scss')

const mapStateToProps = (state) => {
  return {
    repo: state.repo.repo,
    unstagedPatches: state.repo.unstagedPatches,
    stagedPatches: state.repo.stagedPatches,
    diffPatches: state.repo.diffPatches,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCommitDiffFileClick: (patch) => {
      dispatch(loadDiffLines(patch))
    },
  }
}

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class FileStatePage extends Component {

  static propTypes = {
    store: PropTypes.object,
    repo: PropTypes.object,
    unstagedPatches: PropTypes.array,
    stagedPatches: PropTypes.array,
    diffPatches: PropTypes.array,
  }

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const { store, repo } = this.props
    if (store && repo) {
      store.dispatch(loadUnstagedFiles(repo))
      store.dispatch(loadStagedFiles(repo))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.repo && !!nextProps.repo) {
      const { repo, store } = nextProps
      store.dispatch(loadUnstagedFiles(repo))
      store.dispatch(loadStagedFiles(repo))
    }
  }

  componentWillUnmount() {
    const { store } = this.props
    store.dispatch({
      type: RESET_DIFF_LINES,
      diffPatches: [],
    })
  }

  render() {
    let unstagedFileList = this.props.unstagedPatches.length > 0 ?
      <CommitFileList
        commitDiffFiles={this.props.unstagedPatches}
        onItemClick={this.props.onCommitDiffFileClick}
        style={{
          height: 250,
        }}
      /> : ''
    let stagedFileList = this.props.stagedPatches.length > 0 ?
      <CommitFileList
        commitDiffFiles={this.props.stagedPatches}
        onItemClick={this.props.onCommitDiffFileClick}
        style={{
          height: 250,
        }}
      /> : ''
    return (
      <div className={styles.container}>
        <div className={styles.leftPart}>
          <div className={styles.upper}>
            {stagedFileList}
          </div>
          <div className={styles.lower}>
            {unstagedFileList}
          </div>
        </div>
        <div className={styles.rightPart}>
          <DiffPanel patches={this.props.diffPatches}/>
        </div>
      </div>
    )
  }
}
