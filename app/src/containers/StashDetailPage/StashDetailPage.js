
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DiffPanel } from '../../components'
import {
  initStashDetailPage,
  openModalStash,
} from '../../actions'

const styles = require('./StashDetailPage.scss')

const mapStateToProps = (state) => {
  return {
    repo: state.repo.repo,
    stashes: state.repo.stashes,
    stashPatches: state.repo.stashPatches,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onApplyClick: (projectName, index) => {
      dispatch(openModalStash(projectName, index, 'apply'))
    },
    onDeleteClick: (projectName, index) => {
      dispatch(openModalStash(projectName, index, 'drop'))
    },
  }
}

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class StashDetailPage extends Component {

  constructor(props) {
    super(props)
  }

  init() {
    const { params } = this.props
    if (this.pageInit) {
      return
    }
    const { repo, store, stashes } = this.props
    if (repo && store && stashes) {
      let stash
      for (let obj of stashes) {
        if (obj.index == params.index) {
          stash = obj
        }
      }
      if (stash) {
        this.pageInit = true
        this.index = params.index
        store.dispatch(initStashDetailPage(repo, stash))
      }
    }
  }

  componentWillMount() {
    this.init()
  }

  componentWillReceiveProps() {
    this.init()
  }

  handleApplyClick() {
    this.props.onApplyClick(this.props.params.project, this.props.params.index)
  }

  handleDeleteClick() {
    this.props.onDeleteClick(this.props.params.project, this.props.params.index)
  }

  render() {
    const { params } = this.props
    if (params.index != this.index) {
      this.pageInit = false
      this.init()
    }
    return (
      <div key={`stash-detail-page-${this.props.params.index}`} className={styles.stashDetailPage}>
        <div className={styles.buttonGroup}>
          <div className={styles.button} onClick={::this.handleApplyClick}>应用贮藏</div>
          <div className={`${styles.button} ${styles.deletion}`} onClick={::this.handleDeleteClick}>删除贮藏</div>
        </div>
        <DiffPanel patches={ this.props.stashPatches }/>
      </div>
    )
  }
}
