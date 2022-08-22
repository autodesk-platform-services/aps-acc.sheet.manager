/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
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

const config = require('../../config');
const { get, post, patch, put } = require('./fetch_common');
const utility = require('../utility'); 
const axios = require('axios')

async function getSheets(projectId, allSheets,offset,limit=100,onePage=false) {
  try {
    const endpoint = config.endpoints.accSheet.get_sheets.format(projectId) + `?offset=${offset}&limit=${limit}`  
    const headers = config.endpoints.httpHeaders(config.credentials.token_3legged)

    const response = await get(endpoint, headers);

    if (response.results && response.results.length > 0) {
      console.log(`getting sheets of project ${projectId}`)
      allSheets = allSheets.concat(response.results);
      if (!onePage && response.pagination.totalResults>allSheets.length) {
        offset += 100
        return getSheets(projectId,allSheets,offset);
      }
      else {
        return allSheets
      }
    } else {
      return allSheets
    }
  } catch (e) {
    console.error(`getting sheets of  ${projectId} failed: ${e}`)
    return {}
  }
}

async function getVersionSets(projectId, allVersionSets,offset,limit=100,onePage=false) {
  try {
    const endpoint = config.endpoints.accSheet.get_version_sets.format(projectId) + `?offset=${offset}&limit=${limit}`  
    const headers = config.endpoints.httpHeaders(config.credentials.token_3legged)

    const response = await get(endpoint, headers);

    if (response.results && response.results.length > 0) {
      console.log(`getting version sets of project ${projectId}`)
      allVersionSets = allVersionSets.concat(response.results);
      if (!onePage && response.pagination.totalResults>allVersionSets.length) {
        offset += 100
        return getVersionSets(projectId,allVersionSets,offset);
      }
      else {
        return allVersionSets
      }
    } else {
      return allVersionSets
    }
  } catch (e) {
    console.error(`getting version sets of  ${projectId} failed: ${e}`)
    return []
  }
}

async function getUploads(projectId, allUploads,offset,limit=100,onePage=false) {
  try {
    const endpoint = config.endpoints.accSheet.get_uploads.format(projectId) + `?offset=${offset}&limit=${limit}`  
    const headers = config.endpoints.httpHeaders(config.credentials.token_3legged)

    const response = await get(endpoint, headers);

    if (response.results && response.results.length > 0) {
      console.log(`getting uploads of project ${projectId}`)
      allUploads = allUploads.concat(response.results); 
      return allUploads
    } else {
      return allUploads
    }
  } catch (e) {
    console.error(`getting uploads of  ${projectId} failed: ${e}`)
    return []
  }
}



async function getReviewSheets(projectId,uploadId,allReviewSheets,offset,limit=100) {
  try {
    const endpoint = config.endpoints.accSheet.get_review_sheets.format(projectId,uploadId) + `?offset=${offset}&limit=${limit}`  
    const headers = config.endpoints.httpHeaders(config.credentials.token_3legged)

    const response = await get(endpoint, headers);

    if (response.results && response.results.length > 0) {
      console.log(`getting review sheets of project ${projectId}and upload ${uploadId}` )
      allReviewSheets = allReviewSheets.concat(response.results);
      if ( response.pagination.totalResults>allReviewSheets.length) {
        offset += 100
        return getReviewSheets(projectId,uploadId,allReviewSheets,offset);
      }
      else {
        return allReviewSheets
      }
 
    } else {
      return allReviewSheets
    }
  } catch (e) {
    console.error(`getting review sheets of project ${projectId}and upload ${uploadId} failed: ${e}`)
    return []
  }
}

async function getReviewSheetsThumbnail(projectId,uploadId,payload) {
  try {
    const endpoint = config.endpoints.accSheet.get_review_thumbnails.format(projectId,uploadId)  
    const headers = config.endpoints.httpHeaders(config.credentials.token_3legged)
    headers['Content-Type'] = 'application/json' 
    const response = await post(endpoint, headers,payload);

    if (response.results && response.results.length > 0) {
      return response.results
    }
  } catch (e) {
    console.error(`getting review sheets of project ${projectId}and upload ${uploadId} failed: ${e}`)
    return []
  }
}

 // create single asset
async function publishSheets(projectId, uploadId) {
  try { 
    const endpoint = config.endpoints.accSheet.publish_sheets.format(projectId,uploadId)
    var headers = config.endpoints.httpHeaders(config.credentials.token_3legged)
    const response = await post(endpoint, headers,null)
    return {result:true,message:''}
  } catch (e) {
    console.error(`publishSheets failed: ${e.message.details}`)
    return {result:false,message:e.message.details}
  }
}

async function patchReviewSheets(projectId, uploadId,payload) {
  try { 
    const endpoint = config.endpoints.accSheet.patch_review_sheets.format(projectId,uploadId)
    var headers = config.endpoints.httpHeaders(config.credentials.token_3legged)
    headers['Content-Type'] = 'application/json'
    const response = await patch(endpoint, headers,payload)
    return {result:true,message:''}
  } catch (e) {
    console.error(`patchReviewSheets failed: ${e}`)
    return {result:true,message:''}
  }
}

async function newVersionSet(projectId,payload) {
  try { 
    const endpoint = config.endpoints.accSheet.post_version_sets.format(projectId)
    var headers = config.endpoints.httpHeaders(config.credentials.token_3legged)
    headers['Content-Type'] = 'application/json'
    const response = await post(endpoint, headers,payload)
    return {result:true,message:''}
  } catch (e) {
    console.error(`newVersionSet failed: ${e.message.details}`)
    return {result:false,message:e.message.details}
  }
} 

async function createSheetStorage(projectId,payload) {

  try {
    const endpoint = config.endpoints.accSheet.create_storage.format(projectId)   
    const headers = config.endpoints.httpHeaders(config.credentials.token_3legged) 
    headers['Content-Type'] = 'application/json' 
    const response = await post(endpoint, headers,payload);

    console.log(`createSheetStorage of project ${projectId} succeeded` ) 
    return response
    
  } catch (e) {
    console.error(`createSheetStorage of project ${projectId} failed: ${e}`)
    return {result:false,message:e.message}
  } 
}

async function createNewUpload(projectId,payload) {

  try {
    const endpoint = config.endpoints.accSheet.post_uploads.format(projectId)   
    const headers = config.endpoints.httpHeaders(config.credentials.token_3legged) 
    headers['Content-Type'] = 'application/json' 

    const response = await post(endpoint, headers,payload); 
    return response
     
  } catch (e) {
    console.error(`createNewUpload of project ${projectId} failed: ${e}`)
    return null
  }  
}

//the endpoints below are Data Management API (for uploading pdfs) 

async function getS3SignedUrl(bucketKey,objectKey) {
  try {
    const endpoint = config.endpoints.dataManagement.s3_signed_url.format(bucketKey,objectKey)   
    const headers = config.endpoints.httpHeaders(config.credentials.token_3legged) 
    const response = await get(endpoint, headers);

    if (response) {
      console.log(`getS3SignedUrl...` )
      return response 
    } else {
      return null
    }
  } catch (e) {
    console.error(`getting review sheets of project ${projectId}and upload ${uploadId} failed: ${e}`)
    return null
  }
}

async function uploadBinary1(signedUrl,pdfFile){
  try {
    const headers = {'Content-Type':'application/octet-stream'} 
    const response = await put(signedUrl, headers,pdfFile.toString());

    console.log(`uploadBinary...` )
    return response 
     
  } catch (e) {
    console.error(`uploadBinary failed: ${e}`)
    return null
  }
}

async function uploadBinary(signedUrl,pdfFile){
  try {
    console.log(`uploading binary.....` )
    const response = await axios.put(signedUrl,pdfFile); 
    console.log(`uploadBinary done...` )
    return response  
  } catch (e) {
    console.error(`uploadBinary failed: ${e}`)
    return null 
  }
}

async function completeS3SignedUrl(bucketKey,objectKey,payload) {
  try {
    const endpoint = config.endpoints.dataManagement.s3_signed_url.format(bucketKey,objectKey)   
    const headers = config.endpoints.httpHeaders(config.credentials.token_3legged) 
    headers['Content-Type'] = 'application/json' 

    const response = await post(endpoint, headers,payload); 
    console.log(`completeS3SignedUrl...` )
    return response  
  } catch (e) {
    console.error(`completeS3SignedUrl failed: ${e}`)
    return null
  }
} 

module.exports = {
  getSheets, 
  getVersionSets,
  getUploads,
  getReviewSheets,
  publishSheets,
  patchReviewSheets,
  getReviewSheetsThumbnail,
  newVersionSet,
  createSheetStorage,

  getS3SignedUrl,
  uploadBinary,
  completeS3SignedUrl,
  createNewUpload 
}