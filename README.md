# HRID (Human Readable Identifier)

A simple, random, human readable identifier generator for Node.js.

## Usage

HRID uses dictionaries to generate random but human readable identifiers. To keep things as simple as possible, it comes bundled with a builtin dictionary for adjectives, nouns and verbs. These get mixed and matched to generate readable strings joined together with a 'glue' character.

Example usage:
```javascript
const HRID = require('hrid')

let generateID = new HRID()

generateID() // Example output: slope-room-quiet
```

There's a couple of simple options you can set. See the below example:
```javascript
const HRID = require('hrid')

let generateID = new HRID({
  glue: '+', // What keeps the words together
  maxWordLength: 4 // Max individual word length
})

generateID(4) // Example output: leaf+toe+knee+word
generateID(2) // Example output: farm+rock
````

## Installation

Install using yarn:
```
yarn add IngoValente/hrid
```

## License

MIT
