
import { execSync } from 'child_process'
import low from 'lowdb'
import { Repository, Branch, Diff, Reference, Stash, Cred, Revwalk } from 'nodegit'
import DiffLineHelper from './DiffLine'
import fileAsync from 'lowdb/lib/file-async'

const db = low('db.json', {
  storage: fileAsync,
})

db.defaults({ projects: [] }).value()

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
      Diff.OPTION.RECURSE_UNTRACKED_DIRS,
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

export const getStashPatches = (repo, index = 0) => {
  return new Promise((resolve, reject) => {
    try {
      let filterBlank = (arr = []) => {
        return arr.filter((element) => {
          return !!element
        })
      }

      let parseHeader = (header) => {
        header = header.replace(/@@/g, '').trim()
        let ranges = header.split(' ')
        let leftRange = ranges[0]
        let rightRange = ranges[1]
        let start = +leftRange.split(',')[0].substring(1)
        return {
          leftRange: leftRange,
          rightRange: rightRange,
          start: start - 1,
        }
      }

      const path = repo.path().replace(/\.git\//, '')
      let result = execSync(`git stash show -p stash@{${index}}`, {
        cwd: path,
      })

      let patches = []
      let tokens = filterBlank(result.toString().split('diff --git'))

      for (let token of tokens) {
        let info = token.split('\n')
        let headerReg = /@@\s[-|+]\d+,\d+\s[-|+]\d+,\d+ @@/
        let headerElement = info[4]
        let header = parseHeader(headerElement.match(headerReg)[0])

        let rawLines = filterBlank(info.splice(5))

        let leftNo = header.start
        let rightNo = header.start

        let lines = []
        for (let rawLine of rawLines) {
          let oldLineno = ''
          let newLineno = ''
          let origin
          if (rawLine[0] === '\\') {
            oldLineno = ''
            newLineno = ''
            origin = ''
          } else if (rawLine[0] === '+') {
            oldLineno = ''
            rightNo++
            newLineno = rightNo
            origin = Diff.LINE.ADDITION
          } else if (rawLine[0] === '-') {
            leftNo++
            oldLineno = leftNo
            origin = Diff.LINE.DELETION
          } else if (rawLine === '') {
            oldLineno = ''
            newLineno = ''
            origin = ''
          } else {
            leftNo++
            rightNo++
            oldLineno = leftNo
            newLineno = rightNo
            origin = ''
          }
          let content = rawLine.substring(1)
          lines.push(new DiffLineHelper({
            oldLineno: oldLineno,
            newLineno: newLineno,
            origin: origin,
            content: content,
          }))
        }
        patches.push(lines)
      }
      resolve(patches)
    } catch (e) {
      reject(e)
    }
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
    //@todo make sorting extensible
    const eventEmitter = commit.history(Revwalk.SORT.TIME)
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

export const checkoutBranch = (repo, branchName) => {
  return repo.checkoutBranch(branchName)
}

export const checkoutRemoteBranch = (repo, branchName, branchFullName) => {
  let create = (repository, name, fullName, sha, upstreamName) => {
    let reference
    return Reference.create(repository, fullName, sha, 0, '').then((ref) => {
      reference = ref
      return Branch.setUpstream(reference, upstreamName)
    }).then(() => {
      return repository.checkoutBranch(name)
    })
  }

  return repo.getReference(branchFullName).then((reference) => {
    return create(repo, branchName, `refs/heads/${branchName}`, reference.target().tostrS(), branchFullName)
  })
}

export const getStashes = (repo) => {
  return new Promise((resolve, reject) => {
    let stashes = []
    Stash.foreach(repo, (index, stash, oid) => {
      stashes.push({
        index: index,
        stash: stash,
        oid: oid,
      })
    }).then(() => {
      resolve(stashes)
    }).catch((e) => {
      reject(e)
    })
  })
}

export const dropStash = (repo, index) => {
  return Stash.drop(repo, +index)
}

export const applyStash = (repo, index) => {
  return Stash.apply(repo, +index)
}

export const popStash = (repo, index) => {
  return Stash.pop(repo, +index)
}

export const openRepo = (projectName) => {
  const result = db.get('projects').find({ name: projectName }).value()
  const dirPath = result.path
  return Repository.open(dirPath)
}

export const pull = (repo, origin, branch) => {
  return repo.fetch(origin, {
    callbacks: {
      credentials: (url, userName) => {
        return Cred.sshKeyFromAgent(userName)
      },
      certificateCheck: () => {
        return 1
      },
    },
  }).then(() => {
    return repo.mergeBranches(branch, `${origin}/${branch}`)
  })
}
