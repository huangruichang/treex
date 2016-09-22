
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

const styles = require('./sidebar.scss')

export default class SideBar extends Component {

  static propTypes = {
    params: PropTypes.object,
    fileModifiedCount: PropTypes.number.isRequired,
    localBranches: PropTypes.array.isRequired,
    remoteBranches: PropTypes.array.isRequired,
    onCheckoutBranchClick: PropTypes.func.isRequired,
    repo: PropTypes.object.isRequired,
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

  handleRemoteBranches(remoteBranches) {
    let origins = []
    remoteBranches.map((branch) => {
      let remoteOrigin = branch.path.split('\/')[2]
      if (origins.length == 0) {
        origins.push({
          origin: remoteOrigin,
          branches: [branch],
        })
      } else {
        origins.map((origin) => {
          let remoteOrigin = branch.path.split('\/')[2]
          if (remoteOrigin === origin.origin) {
            origin.branches.push(branch)
          }
        })
      }
    })
    return origins
  }

  onCheckoutBranchClick(branch) {
    return () => {
      this.props.onCheckoutBranchClick(this.props.repo, branch)
    }
  }

  render() {
    const origins = this.handleRemoteBranches(this.props.remoteBranches)
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
            this.props.localBranches.map((obj, index) => {
              return <Link key={`local-branch-name-${index}`}
                           className={styles.subTitle}
                           activeClassName={styles.active}
                           to={`/repo/${this.props.params.project}/branches/${obj.name}`}>
                <div className={styles.headMark} style={{ display: obj.isHead? 'inline-block': 'none' }}></div>
                <span className={`ellipsis ${styles.branchName}`} title={obj.name}>{obj.name}</span>
                <span className={styles.hoverText}
                      onClick={::this.onCheckoutBranchClick(obj.name)}
                      style={{
                        display: obj.isHead? 'none':'inline',
                      }}
                >切换</span>
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
            origins.map((origin, index) => {
              return <div className={styles.subTitle} style={{
                paddingLeft: 0,
              }} key={`remote-origin-${index}`}><Origin
                     origin={origin.origin}
                     branches={origin.branches}
                     onBranchClick={() => {
                       console.log('onBranchClick')
                     }}
              >{origin.origin}</Origin></div>
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

class Origin extends Component {

  static propTypes = {
    onOriginClick: PropTypes.func,
    onBranchClick: PropTypes.func,
    style: PropTypes.object,
    origin: PropTypes.string.isRequired,
    branches: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props)
    this.showed = false
  }

  handleOriginClick() {
    this.showed = !this.showed
    this.props.onOriginClick && this.props.onOriginClick()
    this.forceUpdate()
  }

  handleBranchClick(e) {
    e.stopPropagation()
    e.preventDefault()
    this.props.onBranchClick && this.props.onBranchClick()
  }

  render() {
    const branches = this.showed? (
      this.props.branches.map((branch) => {
        return <div key={`remote-${this.props.origin}-branch-${branch.name}`}
          title={branch.name}
          onClick={::this.handleBranchClick}
          style={{
            padding: '4px 0 4px 10px',
          }}
        >{branch.name}</div>
      })
    ) : ''
    return (
      <div onClick={::this.handleOriginClick} style={{
        paddingLeft: 20,
      }}>
        <div>
          {this.props.origin}
          <div className={`${styles.triangle} ${!this.showed?styles.up:''}`}></div>
        </div>
        <div>
          {branches}
        </div>
      </div>
    )
  }
}
