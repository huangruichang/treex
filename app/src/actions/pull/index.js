
import { remote } from 'electron'
import low from 'lowdb'
import { Repository, Diff, Reference, Signature } from 'nodegit'
import fileAsync from 'lowdb/lib/file-async'
import { join } from 'path'
import { exec } from 'child_process'
import * as Helper from '../helpers'

const db = low('db.json', {
  storage: fileAsync,
})

export const INIT_PULL_PAGE = 'init_pull_page'
export const INIT_PULL_PAGE_FAIL = 'init_pull_page'

export const initPullPage = (projectName) => {
  const result = db.get('projects').find({ name: projectName }).value()
  const dirPath = result.path
  let repository
  return dispatch => {
    Repository.open(dirPath).then((repo) => {
      repository = repo
      return repo.getReferences(Reference.TYPE.LISTALL)
    }).then((arrayReference) => {
      dispatch({
        type: INIT_PULL_PAGE,
        reop: repository,
        branches: arrayReference,
      })
    }).catch((e) => {
      dispatch({
        type: INIT_PULL_PAGE_FAIL,
        msg: e,
      })
    })
  }
}
