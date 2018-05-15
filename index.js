let fileName = 'cmp1.csv'

const _ = require('lodash')
const fs = require('fs')
const parse = require('csv-parse')
const json2csv = require('json2csv').Parser
const fields = ['Title','Creator','Date Original','Subset(Note)','Header','Sport','Gender','Topical Subject','Geographic Subject','Chronological Subject','Source','Type(IMT)','Type(DCMITYPE)','Type(AAT)','Digital Collection','Contributing Institution','Archival Collection','Collection Identifier','Rights Management','Contact Information','Sublocation','SportsSeasonURI','SportsEventID','Series','Corporate Name Subject','Date Digital','Latitude','Longitude','Personal name','Collection Guide','Folder','Folder name','Category','Image Height','Image Width','Duration','Digitization Specifications','Image Number','Object File Name']
const opts = { fields }
const csvParser = new json2csv(opts)

let parser = parse({
  delimiter: ','
}, (err, data) => {

  //just work with the first row
  let item = data[1]
  let subset = item[42]
  let imgRange = imageRange(subset)
  let slidesList = []

  for (let imageNumber = imgRange.low; imageNumber <= imgRange.high; imageNumber++) {
    let slide = {}
    
    slide['Title'] = `${item[4]}_${pad(imageNumber)}`
    slide['Creator'] = 'The University of Iowa; The Crowley Company'
    slide['Date Original'] = item[2]
    slide['Subset(Note)'] = subsetNote(item[41], item[42])
    slide['Header'] = item[4]
    slide['Sport'] = item[5]
    slide['Gender'] = item[6]
    slide['Topical Subject'] = item[7]
    slide['Geographic Subject'] = item[8]
    slide['Chronological Subject'] = item[9]
    slide['Source'] = 'Color slides'
    slide['Type(IMT)'] = 'image/tiff'
    slide['Type(DCMITYPE)'] = 'Still image'
    slide['Type(AAT)'] = 'Photographs'
    slide['Digital Collection'] = 'Hawkeyes Athletic Slides'
    slide['Contributing Institution'] = 'University of Iowa.  Libraries.  University Archives'
    slide['Archival Collection'] = 'Center for Media Production Photographic Service Slide Collection'
    slide['Collection Identifier'] = 'RG30_0002_009'
    slide['Rights Management'] = 'Copyright © The University of Iowa 2015.  All rights reserved.'
    slide['Contact Information'] = 'Contact the University Archives at the University of Iowa: http://www.lib.uiowa.edu/sc/contact/'
    slide['Sublocation'] = item[21]
    slide['SportsSeasonURI'] = item[22]
    slide['SportsEventID'] = item[23]
    slide['Series'] = item[24]
    slide['Corporate Name Subject'] = 'University of Iowa'
    slide['Date Digital'] = item[26]
    slide['Latitude'] = '' 
    slide['Longitude'] = '' 
    slide['Personal name'] = '' 
    slide['Collection Guide'] = '' 
    slide['Folder'] = '' 
    slide['Folder name'] = '' 
    slide['Category'] = '' 
    slide['Image Height'] = '' 
    slide['Image Width'] = '' 
    slide['Duration'] = ''
    slide['Digitization Specifications'] = ''
    slide['Image Number'] = ''
    slide['Object File Name'] = `${item[40]}_${pad(imageNumber)}.tif`

    slidesList.push(slide)    
  }

  const csv = csvParser.parse(slidesList)
  
  fs.writeFile('/Users/mtbutler/Desktop/sample-cmp.csv', csv, 'utf8', function (err) {
    if (err) {
      console.log('error');
    } else {
      console.log('worked');
    }
  })


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
  let caseNum = caseTraySplit[0].replace(/\s/g, '')
  let trayNum = caseTraySplit[1].replace(/\s/g, '')

  let note = `Case ${caseNum}-Tray ${trayNum}-Slide ${subset}`

  return note
  
}


fs.createReadStream('FinalMasterSpreadsheet.csv').pipe(parser)



