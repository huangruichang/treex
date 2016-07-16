
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

const styles = require('./sidebar.scss')

export default class SideBar extends Component {

  static propTypes = {
    params: PropTypes.object,
    fileModifiedCount: PropTypes.number.isRequired,
  }

  render() {
    return (
      <div className={styles.sidebar}>
        <div className={styles.item}>
          <div className={styles.title}>
            <div className={styles.icon}></div>
            <span className={styles.text}>WORKSPACE</span>
          </div>
          <Link className={styles.subTitle} to={`/repo/${this.props.params.project}/fileState`}
                activeClassName={styles.active}>
            文件状态{this.props.fileModifiedCount}
          </Link>
          <Link className={styles.subTitle} to={`/repo/${this.props.params.project}/history`}
                activeClassName={styles.active}>
            历史
          </Link>
          <div className={styles.subTitle}>搜索</div>
        </div>
        <div className={styles.item}>
          <div className={styles.title}>
            <div className={styles.icon}></div>
            <span className={styles.text}>分支</span>
          </div>
          <div className={styles.subTitle}>master</div>
        </div>
        <div className={styles.item}>
          <div className={styles.title}>
            <div className={styles.icon}></div>
            <span className={styles.text}>标签</span>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.title}>
            <div className={styles.icon}></div>
            <span className={styles.text}>远端</span>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.title}>
            <div className={styles.icon}></div>
            <span className={styles.text}>已贮藏</span>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.title}>
            <div className={styles.icon}></div>
            <span className={styles.text}>子模块</span>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.title}>
            <div className={styles.icon}></div>
            <span className={styles.text}>子树</span>
          </div>
        </div>
      </div>
    )
  }
}
