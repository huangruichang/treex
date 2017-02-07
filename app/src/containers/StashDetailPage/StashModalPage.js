
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  initModalStashPage,
  closeFocuseWindow,
  dropStash,
  applyStash,
  popStash,
  saveStash,
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
    onSubmitClick: (repo, index, action, ext = {}) => {
      if (action === 'apply') {
        dispatch(applyStash(repo, index))
      } else if (action === 'pop') {
        dispatch(popStash(repo, index))
      } else if (action === 'save') {
        dispatch(saveStash(repo, ext.stashMessage, ext.saveAndApplyChecked))
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
  }

  init() {
    const { params } = this.props
    if (params.action == 'apply') {
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

  componentDidMount() {
    this.refs.stashMessage && this.refs.stashMessage.focus()
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
    const { params } = this.props
    if (params.action == 'apply') {
      if (this.applyAndDropChecked) {
        this.props.onSubmitClick(this.props.repo, this.props.params.index, 'pop')
      } else {
        this.props.onSubmitClick(this.props.repo, this.props.params.index, 'apply')
      }
    } else if (params.action == 'save') {
      this.props.onSubmitClick(this.props.repo, this.props.params.index, 'save', {
        stashMessage: this.stashMessage,
        saveAndApplyChecked: this.saveAndApplyChecked,
      })
    } else {
      this.props.onSubmitClick(this.props.repo, this.props.params.index)
    }
  }

  handleStashMessageChange(e) {
    this.stashMessage = e.target.value
  }

  render() {
    const { params } = this.props
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
                          <div className={styles.inputWrapper}>
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
    let $saveModal = <div>
                        <div className={styles.tip}>
                          <div class={styles.text}>这将贮藏你当前工作区所有变更并返回到一个干净的工作区状态.</div>
                          <div class={styles.text}>
                            <span>信息:</span>
                            <input type="text" ref="stashMessage" style={{ width: 500, marginTop: 10 }} onChange={::this.handleStashMessageChange}/>
                          </div>
                          <div className={styles.inputWrapper}>
                            <input type="checkbox" id="save-and-apply" onChange={(e) => {
                              this.saveAndApplyChecked = e.target.checked
                            }}/>
                            <label for="save-and-apply">保留缓存的变更</label>
                          </div>
                        </div>
                        <div className={styles.buttonGroup}>
                          <div className={`${styles.button} ${styles.cancel}`} onClick={this.props.onCancelClick}>取消</div>
                          <div className={`${styles.button} ${styles.submit}`} onClick={::this.handleSubmitClick}>确定</div>
                        </div>
                      </div>
    const modalMap = {
      apply: $applyModal,
      save: $saveModal,
      drop: $dropModal,
    }
    let $content = modalMap[params.action]
    return (
      <div className={styles.stashModalPage}>
        {$content}
      </div>
    )
  }
}
