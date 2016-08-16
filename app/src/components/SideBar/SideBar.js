
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

const styles = require('./sidebar.scss')

export default class SideBar extends Component {

  static propTypes = {
    params: PropTypes.object,
    fileModifiedCount: PropTypes.number.isRequired,
    localBranches: PropTypes.array.isRequired,
    remoteBranches: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)
    this.isShowLocalBranches = false
    this.isShowRemoteBranches = false
  }

  showLocalBranches() {
    this.isShowLocalBranches = true
    this.forceUpdate()
  }

  hideLocalBranches() {
    this.isShowLocalBranches = false
    this.forceUpdate()
  }

  showRemoteBranches() {
    this.isShowRemoteBranches = true
    this.forceUpdate()
  }

  hideRemoteBranches() {
    this.isShowRemoteBranches = false
    this.forceUpdate()
  }

  render() {
    return (
      <div className={styles.sidebar}>
        <div className={styles.item}>
          <div className={styles.title}>
            <div className={styles.icon}>

            </div>
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
        <div className={`${styles.item} ${!this.isShowLocalBranches? styles.hideSubTitle : ''}`}>
          <div className={styles.title}>
            <div className={styles.icon}>
              <i className={'txtIcon codeFork big'}></i>
            </div>
            <span className={styles.text}>分支</span>
            <span></span>
            <span
              className={this.isShowLocalBranches? styles.hoverShow : styles.hidden}
              onClick={::this.hideLocalBranches}
            >隐藏</span>
            <span
              className={!this.isShowLocalBranches? styles.hoverShow : styles.hidden}
              onClick={::this.showLocalBranches}
            >显示</span>
          </div>
          {
            // this.props.localBranches.map((obj, index) => {
            //   return <div key={`local-branch-name-${index}`} className={styles.subTitle}>
            //     <div className={styles.headMark} style={{ display: obj.isHead? 'inline-block': 'none' }}></div>
            //     {obj.name}
            //   </div>
            // })
            this.props.localBranches.map((obj, index) => {
              return <Link key={`local-branch-name-${index}`}
                           className={styles.subTitle}
                           activeClassName={styles.active}
                           to={`/repo/${this.props.params.project}/branches/${obj.name}`}>
                <div className={styles.headMark} style={{ display: obj.isHead? 'inline-block': 'none' }}></div>
                {obj.name}
              </Link>
            })
          }
        </div>
        <div className={styles.item}>
          <div className={styles.title}>
            <div className={styles.icon}></div>
            <span className={styles.text}>标签</span>
          </div>
        </div>
        <div className={`${styles.item} ${!this.isShowRemoteBranches? styles.hideSubTitle : ''}`}>
          <div className={styles.title}>
            <div className={styles.icon}>
              <i className={'txtIcon cloud big'}></i>
            </div>
            <span className={styles.text}>远端</span>
            <span
              className={this.isShowRemoteBranches? styles.hoverShow : styles.hidden}
              onClick={::this.hideRemoteBranches}
            >隐藏</span>
            <span
              className={!this.isShowRemoteBranches? styles.hoverShow : styles.hidden}
              onClick={::this.showRemoteBranches}
            >显示</span>
          </div>
          {
            this.props.remoteBranches.map((obj, index) => {
              return <div key={`remote-branch-name-${index}`} className={styles.subTitle}>{obj.name}</div>
            })
          }
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
