var DELETE_ALL_SENTINEL = -1

function noop () {}

function malarkey (callback, options) {
  options = options || {}

  var text = ''

  var functionQueue = []
  var functionArguments = []
  var functionIndex = -1

  var isStopped = true
  var stoppedCallback = noop

  var methods = {
    type: function (text, typeOptions) {
      var typeSpeed = typeOptions && typeOptions.typeSpeed
      return enqueue(_type, [text, typeSpeed || options.typeSpeed || 50])
    },
    delete: function (characterCount, deleteOptions) {
      if (typeof characterCount === 'object') {
        deleteOptions = characterCount
        characterCount = DELETE_ALL_SENTINEL
      }
      var deleteSpeed = deleteOptions && deleteOptions.deleteSpeed
      return enqueue(_delete, [
        characterCount || DELETE_ALL_SENTINEL,
        deleteSpeed || options.deleteSpeed || 50
      ])
    },
    clear: function () {
      return enqueue(_clear, null)
    },
    pause: function (pauseDuration) {
      return enqueue(setTimeout, [
        pauseDuration != null ? pauseDuration : options.pauseDuration || 2000
      ])
    },
    call: function (callback) {
      return enqueue(_call, [callback])
    },
    stop: function (callback) {
      isStopped = true
      stoppedCallback = callback || noop
      return methods
    },
    start: function () {
      if (isStopped) {
        isStopped = false
        next()
      }
      return methods
    },
    isStopped: function () {
      return isStopped
    }
  }

  function next () {
    if (isStopped) {
      stoppedCallback(text)
      stoppedCallback = noop
      return
    }
    functionIndex += 1
    if (functionIndex === functionQueue.length) {
      if (!options.repeat) {
        functionIndex = functionQueue.length - 1
        isStopped = true
        return
      }
      functionIndex = 0
    }
    functionQueue[functionIndex].apply(
      null,
      [next].concat(functionArguments[functionIndex])
    )
  }

  function enqueue (callback, args) {
    functionQueue.push(callback)
    functionArguments.push(args)
    if (isStopped) {
      isStopped = false
      setTimeout(next, 0)
    }
    return methods
  }

  function _type (next, typeText, typeSpeed) {
    var length = typeText.length
    var i = 0
    setTimeout(function typeCharacter () {
      text += typeText[i++]
      callback(text)
      if (i === length) {
        next()
        return
      }
      setTimeout(typeCharacter, typeSpeed)
    }, typeSpeed)
  }

  function _delete (next, characterCount, deleteSpeed) {
    var finalLength =
      characterCount === DELETE_ALL_SENTINEL ? 0 : text.length - characterCount
    setTimeout(function deleteCharacter () {
      text = text.substring(0, text.length - 1)
      callback(text)
      if (text.length === finalLength) {
        next()
        return
      }
      setTimeout(deleteCharacter, deleteSpeed)
    }, deleteSpeed)
  }

  function _clear (next) {
    text = ''
    callback(text)
    next()
  }

  function _call (next, callback) {
    callback(next, text)
  }

  return methods
}

module.exports = malarkey
