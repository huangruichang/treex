
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { findProject, openRepo } from '../../actions'
import ProjectList from '../../components/ProjectList/ProjectList'


const styles = require('./App.scss')

const mapStateToProps = (state) => {
  return {
    projects: state.project.list,
  }
}
@connect(
  mapStateToProps
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

  onItemClick(name) {
    openRepo(name)
  }

  render() {
    return (
      <div className={styles.app}>
        <div className={styles.top}>
          <div className={styles.addProjectButton} onClick={::this.findProject}>+新仓库</div>
        </div>
        <ProjectList onItemClick={this.onItemClick} projects={this.props.projects}/>
      </div>
    )
  }
}
