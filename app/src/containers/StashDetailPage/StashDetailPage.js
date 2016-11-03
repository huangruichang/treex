
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DiffPanel } from '../../components'
import { initStashDetailPage } from '../../actions'

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

  render() {
    const { params } = this.props
    if (params.index != this.index) {
      this.pageInit = false
      this.init()
    }
    return (
      <div key={`stash-detail-page-${this.props.params.index}`}>
        <div className={styles.buttonGroup}>
          <div className={styles.button}>应用贮藏</div>
          <div className={`${styles.button} ${styles.deletion}`}>删除贮藏</div>
        </div>
        <DiffPanel patches={ this.props.stashPatches }/>
      </div>
    )
  }
}
