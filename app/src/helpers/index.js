
import { Repository, Diff, Reference, Signature } from 'nodegit'

export const addFileToIndex = (repo, fileName) => {
  let index
  return repo.refreshIndex().then((idx) => {
    index = idx
    return index.addByPath(fileName)
  }).then(() => {
    return index.write()
  })
}

export const removeFileFromIndex = (repo, fileName) => {
  let index
  return repo.refreshIndex().then((idx) => {
    index = idx
    return index.removeByPath(fileName)
  }).then(() => {
    return index.write()
  })
}

export const getUnstagedPatches = (repo) => {
  return repo.refreshIndex().then((index) => {
    return Diff.indexToWorkdir(repo, index, {
      flags:
      Diff.OPTION.SHOW_UNTRACKED_CONTENT |
      Diff.OPTION.RECURSE_UNTRACKED_DIRS
    })
  }).then((diff) => {
    return diff.patches()
  })
}

export const getStagedPatches = (repo) => {
  let index
  return repo.refreshIndex().then((idx) => {
    index = idx
    return repo.getHeadCommit()
  }).then((commit) => {
    return commit.getTree()
  }).then((tree) => {
    return Diff.treeToIndex(repo, tree, index, null)
  }).then((diff) => {
    return diff.patches()
  })
}

export const getDiffLines = (patch) => {
  return patch.hunks().then((arrayConvenientHunk) => {
    let promises = []
    for (let hunk of arrayConvenientHunk) {
      promises.push(hunk.lines())
    }
    return Promise.all(promises)
  }).then((args) => {
    let arrayHunk = []
    for (let lines of args) {
      let arrayLine = []
      for (let line of lines) {
        arrayLine.push(line)
      }
      arrayHunk.push(arrayLine)
    }
    return Promise.resolve(arrayHunk)
  })
}

export const getBranchHeadCommit = (repo, branch) => {
  if (branch) {
    return repo.getBranch(branch).then((reference) => {
      return repo.getReferenceCommit(reference)
    })
  }
  return repo.getHeadCommit()
}

export const getDiff = (commit) => {
  return commit.getDiff()
}

export const getCommitDiffFiles = (repo, commitId) => {
  return repo.getCommit(commitId).then((commit) => {
    return commit.getDiff()
  }).then((arrayDiff) => {
    let promises = []
    for (let diff of arrayDiff) {
      promises.push(diff.patches())
    }
    return Promise.all(promises)
  }).then((args) => {
    let files = []
    for (let arrayConvenientPatch of args) {
      for (let convenientPatch of arrayConvenientPatch) {
        files.push(convenientPatch)
      }
    }
    return Promise.resolve(files)
  })
}

export const getCommitInfo = (repo, commitId) => {
  let _commit
  return repo.getCommit(commitId).then((commit) => {
    _commit = commit
    return commit.getParents()
  }).then((arrayCommit) => {
    let parents = []
    for (let commit of arrayCommit) {
      parents.push(commit.id().toString().slice(0, 5))
    }
    const commitInfo = {
      desc: _commit.message(),
      author: _commit.author().toString(),
      commitId: _commit.id().toString(),
      date: _commit.date().toString(),
      parents: parents,
    }
    return Promise.resolve(commitInfo)
  })
}

export const getHistories = (commit, historiesLimit) => {
  return new Promise((resolve, reject) => {
    const eventEmitter = commit.history()
    const histories = []
    let flag = false
    eventEmitter.on('commit', (commit) => {
      if (histories.length < historiesLimit) {
        const history = {
          desc: commit.message(),
          author: commit.author().toString(),
          commitId: commit.id().toString(),
          date: commit.date().toString(),
        }
        histories.push(history)
      } else {
        if (!flag) {
          flag = true
          resolve(histories)
        }
      }
    })
    eventEmitter.on('end', () => {
      if (histories.length <= historiesLimit && !flag) {
        resolve(histories)
      }
    })
    eventEmitter.on('error', (error) => {
      reject(error)
    })
    eventEmitter.start()
  })
}
