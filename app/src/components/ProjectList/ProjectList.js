
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { openRepo } from '../../actions'
import ProjectItem from './ProjectItem'

const mapStateToProps = (state) => {
  console.log(state.project)
  return {
    projects: state.project.list,
  }
}

const mapDispatchToProps = () => {
  return {
    onItemClick: (name) => {
      openRepo(name)
    },
  }
}


@connect(
  mapStateToProps,
  mapDispatchToProps
)
export default class ProjectList extends Component {

  static propTypes = {
    onItemClick: PropTypes.func.isRequired,
    projects: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    console.log('ProjectList')
    return (
      <div>
        {this.props.projects.map((obj, index) => {
          return <ProjectItem name={obj.name} key={index} onClick={() => { this.props.onItemClick(obj.name) }} />
        })}
      </div>
    )
  }
}
