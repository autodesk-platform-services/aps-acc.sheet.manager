

const SocketEnum = {
  SHEETS_TOPIC: 'sheets topic',
  GET_SHEETS_ALL_DATA: 'get all data of sheets',
  GET_SHEETS: 'get sheets',
  GET_VERSION_SETS: 'get version sets',
  GET_UPLOADS: 'get uploads',

  GET_REVIEW_SHEETS: 'get review sheets',
  PUBLISH_SHEETS: 'publish sheets',
  PATCH_REVIEW_SHEETS: 'patch review sheets',
  GET_REVIEW_SHEETS_THUMBNAIL: 'get review sheets thumbnails',

  NEW_VERSION_SET: 'new version set',
  NEW_UPLOAD: 'new upload'
};

const HOST_URL = window.location.host;
socketio = io(HOST_URL);
socketio.on(SocketEnum.SHEETS_TOPIC, async (d) => {
  const jsonData = JSON.parse(d)
  const isRaw = $('input[name="dataTypeToDisplay"]:checked').val() === 'rawData'

  switch (jsonData.event) {
    case SocketEnum.GET_SHEETS_ALL_DATA:
      if (jsonData.data.result) {
        sheets_view._data.sheetsTable = jsonData.data.result.allSheets
        sheets_view._data.versionsetsTable = jsonData.data.result.allVersionSets
        sheets_view._data.uploadsTable = jsonData.data.result.allUploads
        await sheets_view.refreshTable('sheetsTable', isRaw)
        await sheets_view.refreshTable('versionsetsTable', isRaw)
        await sheets_view.refreshTable('uploadsTable', isRaw)
      } else {
        alert(`exception with get all data:${jsonData.data.message}`)
      }
      $('.importInProgress').hide()
      $('.clsInProgress').hide();
      console.log('export sheets data  done')
      break;

    case SocketEnum.GET_REVIEW_SHEETS:

      if (jsonData.data.result) {
        review_view._data.reviewSheetsTable = jsonData.data.result
        review_view.refreshTable(isRaw)
      }else{
        alert(`exception with get review sheets:${jsonData.data.message}`) 
      }
      $('.importInProgress').hide(); 
      $('.clsInProgress_review').hide();
      console.log('export review sheets done')
      break;
    case SocketEnum.PATCH_REVIEW_SHEETS: 
      alert('patch review sheets successfully!')
      break;

    case SocketEnum.PUBLISH_SHEETS:  
    case SocketEnum.NEW_UPLOAD:  
    case SocketEnum.NEW_VERSION_SET: 
      if (jsonData.data.result) {
        $('.clsInProgress').show(); 
        //refresh  
        var projectId = $('#labelProjectId').text()
        var projectName = $('#labelProjectName').text()
        const isRaw = $('input[name="dataTypeToDisplay"]:checked').val() === 'rawData' 
        sheets_view.resetData()
        sheets_view.initTable('sheetsTable', isRaw)
        sheets_view.initTable('versionsetsTable', isRaw)
        sheets_view.initTable('uploadsTable', isRaw)

        console.log(`${jsonData.event} done`)
        alert(`${jsonData.event} succeeded!`)

        await sheets_view.getAllSheetsData(projectId, projectName)
      } else {
        alert(`exception with ${jsonData.event}. Error: ${jsonData.data.message}`) 
      } 
      break;

  }

})
