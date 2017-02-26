
import React, { Component, PropTypes } from 'react'

const styles = require('./CredModal.scss')

export default class CredModal extends Component {

  static propTypes = {
    onConfirmCallback: PropTypes.func.isRequired,
    userNameSetter: PropTypes.func.isRequired,
    passwordSetter: PropTypes.func.isRequired,
    onCloseCallback: PropTypes.func,
  }

  constructor(props) {
    super(props)
  }

  handleClose() {
    this.props.onCloseCallback && this.props.onCloseCallback()
  }

  render() {
    return (
      <div className={styles.credModal}>
        <div className={styles.container}>
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>账号:</label>
              <input className={styles.input} type="text" onChange={(e) => {
                this.props.userNameSetter(e.target.value)
              }}/>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>密码:</label>
              <input className={styles.input} type="password" onChange={(e) => {
                this.props.passwordSetter(e.target.value)
              }}/>
            </div>
            <div className={styles.buttonGroup}>
              <div className={`${styles.button} ${styles.cancel}`} onClick={::this.handleClose}>取消</div>
              <div className={`${styles.button} ${styles.submit}`} onClick={this.props.onConfirmCallback}>确定</div>
            </div>
          </div>
          <div className={styles.closer} onClick={::this.handleClose}>
            <span>x</span>
          </div>
        </div>
      </div>
    )
  }

}
