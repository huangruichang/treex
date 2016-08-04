
import React, { Component, PropTypes } from 'react'

const styles = require('./commitForm.scss')

export default class CommitForm extends Component {

  static propTypes = {
    onSubmitClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func,
    style: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.commitMessage = ''
  }

  handleChange(event) {
    this.commitMessage = event.target.value
  }

  onSubmitClick() {
    this.props.onSubmitClick(this.commitMessage)
  }

  onCancelClick() {
    this.props.onCancelClick && this.props.onCancelClick()
  }

  render() {
    return (
      <div className={styles.commitForm}>
        <textarea ref="textarea" onChange={::this.handleChange} className={styles.commitTextarea}/>
        <div className={styles.buttonGroup}>
          <div className={`${styles.button} ${styles.cancel}`} onClick={::this.onCancelClick}>取消</div>
          <div className={`${styles.button} ${styles.submit}`} onClick={::this.onSubmitClick}>提交</div>
        </div>
      </div>
    )
  }
}
