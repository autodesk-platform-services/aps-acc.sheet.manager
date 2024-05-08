/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Developer Support and Advocacy
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

'use strict';

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer')

const config = require('../../config');
const utility = require('../utility');

const { OAuth } = require('../services/oauth');
const extract = require('../services/extract');
const _excel = require('../excel/excel');

const upload = multer({ dest: './PDF_Uploads/' });
const sheets_service = require('../services/sheets');


//store 3-legged token to cookie
router.use(async (req, res, next) => {
  const oauth = new OAuth(req.session);
  if (!oauth.isAuthorized()) {
    console.log('no valid authorization!')
    res.status(401).end('Please login first')
    return
  }
  req.oauth_client = oauth.getClient();
  req.oauth_token = await oauth.getInternalToken();
  const twoleggedres = await oauth.get2LeggedToken();
  config.credentials.token_3legged = req.oauth_token.access_token
  config.credentials.token_2legged = twoleggedres.access_token

  next();
});

//get all sheets, version sets, uploads
router.get('/sheets/alldata/:projectId/:projectName', async (req, res) => {

  const projectId = req.params['projectId']
  const projectName = req.params['projectName']
  res.status(200).end()

  try {
    //extract all sheets. start with offset = 0, limit = 100/page
    const alldata = await extract.exportAll(projectId, 0, 100, false)
    //send data to client side
    utility.socketNotify(utility.SocketEnum.SHEETS_TOPIC,
      utility.SocketEnum.GET_SHEETS_ALL_DATA,
      { result: alldata, projectName: projectName })

    //produce excel file in parallel
    const result = await _excel._export(`acc-sheets-report<${projectName}>`, {
      sheets: alldata.allSheets,
      versionSets: alldata.allVersionSets,
      uploads: alldata.allUploads
    })

  }
  catch (e) {
    utility.socketNotify(utility.SocketEnum.SHEETS_TOPIC,
      utility.SocketEnum.GET_SHEETS_ALL_DATA,
      { result: null, message: e.toString() })
  }
});

//download excel file 
router.get('/sheets/downloadExcel/:projectName', async (req, res) => {

  var projectName = req.params['projectName']

  projectName = `acc-sheets-report<${projectName}>.xlsx`

  var file_full_csv_name = path.join(__dirname,
    '../../Excel_Exports/' + projectName);
  if (fs.existsSync(file_full_csv_name)) {
    res.download(file_full_csv_name);
  }
  else {
    res.status(500).json({ error: 'no such excel file!' });
  }
});

//get review sheets of one upload
router.get('/sheets/reviewSheets/:projectId/:uploadId', async (req, res) => {

  const projectId = req.params['projectId']
  const uploadId = req.params['uploadId']
  res.status(200).end()

  try {
    //extract all review sheets. start with offset = 0, limit = 100/page
    var allReviewSheets = []
    allReviewSheets = await sheets_service.getReviewSheets(projectId, uploadId, allReviewSheets, 0, 100)

    //thumbnails go with another endpoint
    if (allReviewSheets && allReviewSheets.length > 0) {
      //get all ids
      var sheetIds = allReviewSheets.map(i => i.id)
      //get tiny thumbnails
      var payload = { reviewSheetIds: sheetIds, type: 'tiny' }
      const allTinyThumbnails = await sheets_service.getReviewSheetsThumbnail(projectId, uploadId, JSON.stringify(payload))
      //get big thumbnails
      payload = { reviewSheetIds: sheetIds, type: 'big' }
      const allBigThumbnails = await sheets_service.getReviewSheetsThumbnail(projectId, uploadId, JSON.stringify(payload))
      allReviewSheets.forEach(element => {
        element.tinyThumbnail = allTinyThumbnails.find(i => i.reviewSheetId == element.id)
        element.bigThumbnail = allBigThumbnails.find(i => i.reviewSheetId == element.id)
      });
    }

    utility.socketNotify(utility.SocketEnum.SHEETS_TOPIC,
      utility.SocketEnum.GET_REVIEW_SHEETS,
      { result: allReviewSheets })
  } catch (e) {
    utility.socketNotify(utility.SocketEnum.SHEETS_TOPIC,
      utility.SocketEnum.GET_REVIEW_SHEETS,
      { result: null, message: e.toString() })
  }

});

//publish sheets
router.get('/sheets/publishSheets/:projectId/:uploadId', async function (req, res) {
  const { projectId, uploadId } = req.params;
  res.status(200).end()
  try {
    const { result, message } = await sheets_service.publishSheets(projectId, uploadId)

    utility.socketNotify(utility.SocketEnum.SHEETS_TOPIC,
      utility.SocketEnum.PUBLISH_SHEETS,
      { result: result, message: message, projectId: projectId })
  } catch (e) {
    utility.socketNotify(utility.SocketEnum.SHEETS_TOPIC,
      utility.SocketEnum.PUBLISH_SHEETS,
      { result: null, message: e.toString(), projectId: projectId })
  }
});

//patch one upload
router.post('/sheets/patchReviewSheets/:projectId/:uploadId', async function (req, res) {
  const { projectId, uploadId } = req.params;
  const payload = JSON.parse(req.body.data)
  res.status(200).end()

  try {
    const result = await sheets_service.patchReviewSheets(projectId, uploadId, JSON.stringify(payload))

    utility.socketNotify(utility.SocketEnum.SHEETS_TOPIC,
      utility.SocketEnum.PATCH_REVIEW_SHEETS,
      { result: result, projectId: projectId })
  } catch (err) {
    utility.socketNotify(utility.SocketEnum.SHEETS_TOPIC,
      utility.SocketEnum.PATCH_REVIEW_SHEETS,
      { result: null, message: e.toString(), projectId: projectId })
  }
});


router.post('/sheets/newVersionSet/:projectId', async function (req, res) {
  const { projectId } = req.params;
  const payload = JSON.parse(req.body.data)
  try {

    res.status(200).end()
    const result = await sheets_service.newVersionSet(projectId, JSON.stringify(payload))

    utility.socketNotify(utility.SocketEnum.SHEETS_TOPIC,
      utility.SocketEnum.NEW_VERSION_SET,
      { result: result, projectId: projectId })
  } catch (err) {
    res.status(500).end()
  }
});

router.post('/sheets/upload1/:projectId', upload.single('pdf'), async function (req, res) {
  const { projectId } = req.params;
  res.status(200).end()

  let arr = []
  const rs = fs.createReadStream(req.file.path);

  rs.on('data', chunk => {
    arr.push(chunk)
  })
  rs.on('end', async chunk => {
    var body = Buffer.concat(arr)
    try {
      let payload = { fileName: "one.pdf" }
      const stg = await sheets_service.createSheetStorage(projectId, JSON.stringify(payload))
      let ret = stg.urn.replace('urn:adsk.objects:os.object:', '');
      let splitBySlash = ret.split("/")
      const bucketKey = splitBySlash[0]
      const objectKey = splitBySlash[1]
      const s3signedurl = await sheets_service.getS3SignedUrl(bucketKey, objectKey)
      const url = s3signedurl.urls[0]
      const uploadKey = s3signedurl.uploadKey
      const uploadStat = await sheets_service.uploadBinary(url, body)
      payload = { uploadKey: uploadKey }
      const completeStat = await sheets_service.completeS3SignedUrl(bucketKey, objectKey, JSON.stringify(payload))
      //const newUpload = await sheets_service.

      utility.socketNotify(utility.SocketEnum.SHEETS_TOPIC,
        utility.SocketEnum.NEW_UPLOAD,
        { result: result, projectId: projectId })
    } catch (err) {
      utility.socketNotify(utility.SocketEnum.SHEETS_TOPIC,
        utility.SocketEnum.NEW_UPLOAD,
        { result: null, message: e.toString(), projectId: projectId })
    }
  }
  )


});

router.post('/sheets/upload/:projectId/:versionSetId', upload.single('pdf'), async function (req, res) {
  const { projectId, versionSetId } = req.params;
  res.status(200).end()

  //read pdf file stream
  const body = fs.readFileSync(req.file.path);

  try {
    let payload = { fileName: "one.pdf" }
    const stg = await sheets_service.createSheetStorage(projectId, JSON.stringify(payload))
    if (stg) {
      let ret = stg.urn.replace('urn:adsk.objects:os.object:', '');
      let splitBySlash = ret.split("/")
      const bucketKey = splitBySlash[0]
      const objectKey = splitBySlash[1]
      const s3signedurl = await sheets_service.getS3SignedUrl(bucketKey, objectKey)

      if (s3signedurl) {
        const url = s3signedurl.urls[0]
        const uploadKey = s3signedurl.uploadKey
        const uploadStat = await sheets_service.uploadBinary(url, body)

        if (uploadStat) {
          payload = { uploadKey: uploadKey }
          const completeStat = await sheets_service.completeS3SignedUrl(bucketKey, objectKey, JSON.stringify(payload))
          if (completeStat) {
            payload = {
              versionSetId: versionSetId,
              files: [{
                storageType: "OSS",
                storageUrn: stg.urn,
                name: "one.pdf"
              }]
            }
            const newUpload = await sheets_service.createNewUpload(projectId, JSON.stringify(payload))
            if (newUpload) {
              utility.socketNotify(utility.SocketEnum.SHEETS_TOPIC,
                utility.SocketEnum.NEW_UPLOAD,
                { result: newUpload, projectId: projectId })
            } else (
              utility.socketNotify(utility.SocketEnum.SHEETS_TOPIC,
                utility.SocketEnum.NEW_UPLOAD,
                { result: null, message: 'exception when newUpload of sheet ' })
            )
          } else {
            utility.socketNotify(utility.SocketEnum.SHEETS_TOPIC,
              utility.SocketEnum.NEW_UPLOAD,
              { result: null, message: 'exception when complete uploading ' })
          }
        } else {
          utility.socketNotify(utility.SocketEnum.SHEETS_TOPIC,
            utility.SocketEnum.NEW_UPLOAD,
            { result: null, message: 'exception when uploading binary ' })
        }

      } else {
        utility.socketNotify(utility.SocketEnum.SHEETS_TOPIC,
          utility.SocketEnum.NEW_UPLOAD,
          { result: null, message: 'exception when getting s3 signed url ' })
      }

    } else {
      utility.socketNotify(utility.SocketEnum.SHEETS_TOPIC,
        utility.SocketEnum.NEW_UPLOAD,
        { result: null, message: 'exception when create sheet storage ' })
    }

  } catch (err) {
    utility.socketNotify(utility.SocketEnum.SHEETS_TOPIC,
      utility.SocketEnum.NEW_UPLOAD,
      { result: null, message: e.toString(), projectId: projectId })
  }

});

router.post('/sheets/versionSet/:projectId', async function (req, res) {
  const { projectId } = req.params;
  const name = JSON.parse(req.body.data).name
  const issuanceDate = JSON.parse(req.body.data).issuanceDate
  const payload = {
    name: name,
    issuanceDate: issuanceDate
  }
  res.status(200).end()
  try {

    const result = await sheets_service.newVersionSet(projectId, JSON.stringify(payload))

    utility.socketNotify(utility.SocketEnum.SHEETS_TOPIC,
      utility.SocketEnum.NEW_VERSION_SET,
      { result: result, projectId: projectId })
  } catch (err) {
    utility.socketNotify(utility.SocketEnum.SHEETS_TOPIC,
      utility.SocketEnum.NEW_VERSION_SET,
      { result: null, message: e.toString(), projectId: projectId })
  }

});




module.exports = router