
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { findProject, openRepo, openClonePage } from '../../actions'
import ProjectList from '../../components/ProjectList/ProjectList'

require('!style!css!sass!../common.scss')
const styles = require('./App.scss')

const mapStateToProps = (state) => {
  return {
    projects: state.project.list,
  }
}
@connect(
  mapStateToProps,

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

  render() {
    return (
      <div className={styles.app}>
        <div className={styles.top}>
          <div className={styles.addProjectButton} style={{ marginRight: 5 }} onClick={::this.findProject}>+新仓库</div>
          <div className={styles.addProjectButton} onClick={::this.cloneProject}>+克隆仓库</div>
        </div>
        <ProjectList onItemClick={this.onItemClick} projects={this.props.projects}/>
      </div>
    )
  }
}
