let fileName = 'cmp1.csv'

let _ = require('lodash')
let csv = require('csv')
let fs = require('fs')
let parse = require('csv-parse')

let parser = parse({
  delimiter: ','
}, (err, data) => {

  //just work with the first row
  let item = data[605]
  let subset = item[42]
  subsetNote(item[41], item[42])



})

function pad(num) {
  let newNum = ("0000" + num).substr(-3,3)
  return newNum
}

function imageRange(subset) {
  let range = _.split(subset, '-')
  let numImages
  let rangeObj

  if (range[1] !== undefined) {
    numImages = range[1] - range[0] + 1
    rangeObj = {'low': range[0], 'high': range[1], 'numberOfImages': numImages }
  } else {
    numImages = 1
    rangeObj = {'low': range[0], 'high': range[0], 'numberOfImages': 1 }
  }

  return rangeObj
}

function subsetNote(caseTray, subset) {
  let caseTraySplit = _.split(caseTray, '/')
  let caseNum = caseTraySplit[0]
  let trayNum = caseTraySplit[1]

  let note = `Case-${caseNum}-Tray${trayNum}-Slide${subset}`

  return note
  
}


fs.createReadStream('FinalMasterSpreadsheet.csv').pipe(parser)



