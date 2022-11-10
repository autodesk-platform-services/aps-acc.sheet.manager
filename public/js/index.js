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

//global variables 
const sheets_view = new SheetsView()
const review_view = new ReviewsView()



$(document).ready(function () {

  //initialize editable table
  $.fn.editable.defaults.mode = 'popup'; 
  $.fn.datepicker.DPGlobal.template = $.fn.datepicker.DPGlobal.template.replace(/icon-/g, "fa fa-");
  //initialize date input  
  $('.datepicker').datepicker({ autoclose: true });
  
  var isRaw = false // by default: human readable form
  sheets_view.initTable('sheetsTable', isRaw)
  sheets_view.initTable('versionsetsTable', isRaw)
  sheets_view.initUploadsTable('uploadsTable', isRaw)

  review_view.initTable(isRaw)

  $('#btnRefresh').click(async () => {
    $('.clsInProgress').show(); 
    //refresh  
    var projectId = $('#labelProjectId').text()
    var projectName = $('#labelProjectName').text()
    const isRaw = $('input[name="dataTypeToDisplay"]:checked').val() === 'rawData' 
    sheets_view.resetData()
    sheets_view.initTable('sheetsTable', isRaw)
    sheets_view.initTable('versionsetsTable', isRaw)
    sheets_view.initTable('uploadsTable', isRaw)

    await sheets_view.getAllSheetsData(projectId, projectName)
  })

  $('#btnPublishUpload').click(async () => {
    var projectId = $('#labelProjectId').text()
    var uploadId = $('#labelUploadId').text()

    review_view.publishSheets(projectId, uploadId)
  })

  $('#btnPatchSheets').click(async () => {
    const projectId = $('#labelProjectId').text()
    const uploadId = $('#labelUploadId').text()

    //get current input from reviewSheetsTable 
    var payload = []
    $("#reviewSheetsTable tbody tr").each(function () {
      var self = $(this);
      payload.push({
        id: self.find("td:eq(0)").text().trim(),
        number: self.find("td:eq(1)").text().trim() == '{no number}' ? '' : self.find("td:eq(1)").text().trim(),
        title: self.find("td:eq(2)").text().trim() == '{no title}' ? '' : self.find("td:eq(2)").text().trim()
      });
    })

    review_view.patchReviewSheets(projectId, uploadId, payload)
  })

  $('.input-group').click(function () {

    const isRaw = $('input[name="dataTypeToDisplay"]:checked').val() === 'rawData'
    sheets_view.refreshTable('sheetsTable', isRaw)
    sheets_view.refreshTable('versionsetsTable', isRaw)
    sheets_view.refreshTable('uploadsTable', isRaw) 
  });

  $('#executeJob').click(async () => {
    const job = $('input[name="batchjob"]:checked').val(); 

    if (job == 'export') {
      const projectName = $('#labelProjectName').text() 
      window.location = `/api/aps/sheets/downloadExcel/${projectName}`

    }
    else if (job == 'newset') {
      const name = $('#newSetName').val()
      const d = new Date($('#issuanceDate').val() )
      var month = d.getMonth()+1
      if(month <10)
        month = `0${month}`
      var date = d.getDate()
      if(date <10)
        date = `0${date}`
  
      const issuanceDate = `${d.getFullYear()}-${month}-${date}`
      const projectId = $('#labelProjectId').text()
      const payload = {name:name,issuanceDate:issuanceDate}
      sheets_view.postVersionSets(projectId,payload) 
    }
    else if (job == 'newsheets') {
      $('#hidden-upload-file').click();
    }  
  })

  $('#hidden-upload-file').on('change', async (evt) => {

    $('.importInProgress').show();
    var projectId = $('#labelProjectId').text()
    const versionSetId = $('#versionSetIdForNewUpload').val() 
    const files = evt.target.files
    if (files.length === 1) {
      const formData = new FormData();
      formData.append('pdf', files[0]);
      const endpoint = `/api/aps/sheets/upload/${projectId}/${versionSetId}`;

      const response = await fetch(endpoint, { method: 'POST', body: formData });
      if (response.ok) {
        //wait the result at socket modules.... 

      } else {
        $.notify('Exception to import pdf.', 'error');
        $('.importInProgress').hide();
      }
    } else {
      $.notify('Please select single pdf file only!', 'warn')
      $('.importInProgress').hide();
    }
  });


});

