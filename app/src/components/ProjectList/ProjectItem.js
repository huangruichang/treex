
import React, { Component, PropTypes } from 'react'
import { BucketIcon } from '../Icon'

const styles = require('./project.scss')

export default class ProjectItem extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={styles.projectItem} onClick={this.props.onClick}>
        <div className={styles.left}>
          <BucketIcon style={{
            border: '1px solid #999',
            height: 30,
            width: 30,
            borderRadius: 16,
            textAlign: 'center',
            lineHeight: '31px',
            marginRight: 10,
            color: '#999',
          }}/>
          <div>{ this.props.name }</div>
        </div>
      </div>
    )
  }
}
