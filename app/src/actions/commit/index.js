
import { Reference, Signature } from 'nodegit'
import { loadStageAndUnStage } from '../stage'

export const CREATE_COMMIT_ON_HEAD = 'CREATE_COMMIT_ON_HEAD'
export const CREATE_COMMIT_ON_HEAD_FAIL = 'CREATE_COMMIT_ON_HEAD_FAIL'
export const createCommitOnHead = ({ repo, commitMessage, author, callback }) => {
  return (dispatch) => {
    let index, oid
    repo.refreshIndex().then((idx) => {
      index = idx
      return index.write()
    }).then(() => {
      return index.writeTree()
    }).then((oidResult) => {
      oid = oidResult
      return Reference.nameToId(repo, 'HEAD')
    }).then((head) => {
      return repo.getCommit(head)
    }).then((parent) => {
      const authorSignature = Signature.now(author.name, author.email)
      const committerSignature = Signature.now(author.name, author.email)
      return repo.createCommit('HEAD', authorSignature, committerSignature, commitMessage, oid, [parent])
    }).then(() => {
      callback && callback()
      return loadStageAndUnStage(dispatch, CREATE_COMMIT_ON_HEAD, repo)
    }).catch((e) => {
      dispatch({
        type: CREATE_COMMIT_ON_HEAD_FAIL,
        msg: e,
      })
    })
  }
}
