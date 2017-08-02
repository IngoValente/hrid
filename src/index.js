const fs = require('fs')
const path = require('path')

const _DICTIONARY_FILES = ['nouns', 'verbs', 'adjectives']

const getDictionaryFilePath = name => {
  return path.join(__dirname, `../dictionaries/${name}.txt`)
}

const getRandom = limit => {
  return Math.floor(Math.random() * limit)
}

const shuffle = array => {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

class Dictionary {
  constructor(path, options) {
    this.words = []

    let maxWordLength = options && options.maxWordLength,
      data = fs.readFileSync(path, 'utf-8')

    data.split(/\s+/).forEach(word => {
      if (word && (!maxWordLength || word.length <= maxWordLength))
        this.words.push(word)
    })

    this.size = this.words.length
  }

  chooseRandom() {
    return this.words[getRandom(this.size)]
  }
}

class Generator {
  constructor(options) {
    this.dictionaries = []
    this.glue = (options && options.glue) || '-'
  }

  choose(length = 3) {
    if (this.size === 0) throw new Error('No dictionaries available.')

    if (this.size === 1) return this.dictionaries[0].chooseRandom()

    let probe,
      tries = 10,
      used = new Map()

    let seq = []
    let dictCounter = 0
    for (let i = 0; i < length; i++) {
      let counter = 0
      while (counter < tries) {
        counter++
        if (!used.has((probe = this.dictionaries[dictCounter].chooseRandom())))
          break
      }

      if (counter === tries)
        throw new Error('Too many tries to find a unique word')

      used.set(probe, true)
      seq.push(probe)
      dictCounter = dictCounter - 1 > this.size ? 0 : dictCounter++
    }

    return shuffle(seq).join(this.glue)
  }

  use(dictionary) {
    this.dictionaries.push(dictionary)
    this.size = this.dictionaries.length
  }
}

const createGenerator = (dictionaries, options) => {
  const generator = new Generator(options)

  dictionaries.forEach(dictionary => {
    generator.use(dictionary)
  })

  return generator
}

function HRID(options) {
  let paths = _DICTIONARY_FILES.map(file => getDictionaryFilePath(file))
  let dictionaries = paths.map(path => new Dictionary(path, options))
  _generator = createGenerator(dictionaries, options)
  return length => _generator.choose(length)
}

module.exports = HRID
