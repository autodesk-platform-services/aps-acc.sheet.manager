
/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Developer Advocacy and Support
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
const sheets_service = require('./sheets'); 

async function exportAll(projectId,offset,limit,onePage=false){

  var allSheets = []
  allSheets = await sheets_service.getSheets(projectId, allSheets,offset,limit,onePage)
   
  var allVersionSets = []
  allVersionSets = await sheets_service.getVersionSets(projectId, allVersionSets,offset,limit,onePage)

  var allUploads = []
  allUploads = await sheets_service.getUploads(projectId, allUploads,offset,limit,onePage)
 
  allSheets.forEach(async s => { 
    //all attributes are named as default. Only customize a few attributes 
    //viewerable data
    s.viewable_urn = s.viewable.urn
    s.viewable_guid = s.viewable.guid 

    //version set 
    s.versionSetId = s.versionSet.id
    s.versionSetName = s.versionSet.name  
  });  

  allUploads.forEach(async u => { 
    //all attributes are named as default. Only customize a few attributes 
    const vSet = allVersionSets.find(i=>i.id==u.versionSetId)
    u.versionSetName = vSet&&vSet.name ? vSet.name:'{no name}'
  });   
  console.log(`sorting out all data done`); 
  return { 
    allSheets: allSheets,
    allVersionSets:allVersionSets,
    allUploads: allUploads
  } 

}

async function exportSheets(projectId,offset,limit,onePage=false) {

  //get cursorState
  var allSheets = []
  allSheets = await sheets_service.getSheets(projectId, allSheets,offset,limit,onePage)
   
  allSheets.forEach(async s => { 
    //all attributes are named as default. Only customize a few attributes 
    //viewerable data
    s.viewable_urn = s.viewable.urn
    s.viewable_guid = s.viewable.guid 

    //version set 
    s.versionSetId = s.versionSet.id
    s.versionSetName = s.versionSet.name  
  });  

  console.log(`sorting out sheets done`); 
  return {allSheets:allSheets}
  
} 

async function exportVersionSets(projectId,offset,limit,onePage=false) {

  var allVersionSets = []
  allVersionSets = await sheets_service.getVersionSets(projectId, allVersionSets,offset,limit,onePage)
  console.log(`sorting out version sets done`); 
  return {allVersionSets:allVersionSets}
  
} 
 
async function exportUploads(projectId,offset,limit,onePage=false) {

  var allVersionSets = []
  allVersionSets = await sheets_service.getVersionSets(projectId, allVersionSets,offset,limit,onePage)

  var allUploads = []
  allUploads = await sheets_service.getUploads(projectId, allUploads,offset,limit,onePage)
 
  allUploads.forEach(async u => { 
    //all attributes are named as default. Only customize a few attributes 
    const vSet = allVersionSets.find(i=>i.id==u.versionSetId)
    vSet.name ? u.versionSetName = vSet.name:'{no name}'
  });  

  console.log(`sorting out uploads done`); 
  return {allUploads:allUploads}
  
} 
 

module.exports = {
  exportAll,
  exportSheets,
  exportVersionSets,
  exportUploads 
 } 
