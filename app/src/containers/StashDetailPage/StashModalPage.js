
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  initModalStashPage,
  closeFocuseWindow,
  dropStash,
  applyStash,
  popStash,
} from '../../actions'

const styles = require('./StashDetailPage.scss')

const mapStateToProps = (state) => {
  return {
    repo: state.repo.repo,
    stashes: state.repo.stashes,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmitClick: (repo, index, action) => {
      if (action === 'apply') {
        dispatch(applyStash(repo, index))
      } else if (action === 'pop') {
        dispatch(popStash(repo, index))
      } else {
        dispatch(dropStash(repo, index))
      }
    },
    onCancelClick: () => {
      dispatch(closeFocuseWindow())
    },
  }
}

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
export default class StashModalPage extends Component {

  constructor(props) {
    super(props)
    this.isApplying = false
  }

  init() {
    const { params } = this.props
    if (params.action == 'apply') {
      this.isApplying = true
      this.applyAndDropChecked = false
    }
    if (this.pageInit) {
      return
    }
    const { store } = this.props
    if (store) {
      this.pageInit = true
      store.dispatch(initModalStashPage(params.project))
    }
  }

  componentWillMount() {
    this.init()
  }

  componentWillReceiveProps() {
    this.init()
  }

  getStash(stashes = [], index) {
    for (let stash of stashes) {
      if (stash.index == index) {
        return stash
      }
    }
    return ''
  }

  handleSubmitClick() {
    if (this.isApplying) {
      if (this.applyAndDropChecked) {
        this.props.onSubmitClick(this.props.repo, this.props.params.index, 'pop')
      } else {
        this.props.onSubmitClick(this.props.repo, this.props.params.index, 'apply')
      }
    } else {
      this.props.onSubmitClick(this.props.repo, this.props.params.index)
    }
  }

  render() {
    let stash = this.getStash(this.props.stashes, this.props.params.index)
    let $dropModal = <div>
                      <div className={styles.tip}>
                        <div>确定删除?</div>
                        <div className={styles.text}>您确定要删除暂存的变更'{stash.stash}'</div>
                      </div>
                      <div className={styles.buttonGroup}>
                        <div className={`${styles.button} ${styles.cancel}`} onClick={this.props.onCancelClick}>取消</div>
                        <div className={`${styles.button} ${styles.submit}`} onClick={::this.handleSubmitClick}>确定</div>
                      </div>
                    </div>
    let $applyModal = <div>
                        <div className={styles.tip}>
                          <div>应用 Stash?</div>
                          <div className={styles.text}>确定要将 stash '{stash.stash}' 到您的工作副本吗?</div>
                          <div style={{ float: 'left', fontSize: 12, marginTop: 10 }}>
                            <input type="checkbox" id="apply-and-drop" onChange={(e) => {
                              this.applyAndDropChecked = e.target.checked
                            }}/>
                            <label for="apply-and-drop">应用后删除</label>
                          </div>
                        </div>
                        <div className={styles.buttonGroup}>
                          <div className={`${styles.button} ${styles.cancel}`} onClick={this.props.onCancelClick}>取消</div>
                          <div className={`${styles.button} ${styles.submit}`} onClick={::this.handleSubmitClick}>确定</div>
                        </div>
                      </div>
    let $content = this.isApplying? $applyModal : $dropModal
    return (
      <div className={styles.stashModalPage}>
        {$content}
      </div>
    )
  }
}
