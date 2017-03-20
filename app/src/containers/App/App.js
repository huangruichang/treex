
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { findProject, openRepo, removeProject, openClonePage } from '../../actions'
import ProjectList from '../../components/ProjectList/ProjectList'

require('!style!css!sass!../common.scss')
const styles = require('./App.scss')

const mapStateToProps = (state) => {
  return {
    projects: state.project.list,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCloseClick: (projectName) => {
      dispatch(removeProject(projectName))
    },
  }
}
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class App extends Component {

  constructor(props) {
    super(props)
  }

  findProject() {
    const { store } = this.props
    if (store) {
      store.dispatch(findProject())
    }
  }

  cloneProject() {
    const { store } = this.props
    if (store) {
      store.dispatch(openClonePage())
    }
  }

  onItemClick(name) {
    openRepo(name)
  }

  onCloseClick(e, name) {
    e.stopPropagation()
    e.preventDefault()
    this.props.onCloseClick(name)
  }

  render() {
    return (
      <div className={styles.app}>
        <div className={styles.top}>
          <div className={styles.addProjectButton} style={{ marginRight: 5 }} onClick={::this.findProject}>+新仓库</div>
          <div className={styles.addProjectButton} onClick={::this.cloneProject}>+克隆仓库</div>
        </div>
        <ProjectList
          onItemClick={this.onItemClick}
          onCloseClick={this::this.onCloseClick}
          projects={this.props.projects}
        />
      </div>
    )
  }
}
