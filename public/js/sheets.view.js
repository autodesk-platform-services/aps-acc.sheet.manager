class SheetsView {

  constructor() {
    this._sheetTable = null
    this._versionsetsTable = null
    this._uploadTable = null

    this._pageLimit = 25
    this._pageOffset = 0


    this._data = {
      sheetsTable: [],
      versionsetsTable: null,
      uploadsTable: null
    }

    this._tableFixComlumns = {
      parent: this,
      sheetsTable: function (isRaw) {
        return [
          { field: 'id', title: "id", align: 'left', width: 100 },
          { field: 'number', title: "number", align: 'center' },
          { field: 'title', title: "title", align: 'center' },
          { field: 'uploadFileName', title: "uploadFileName", align: 'center' },
          { field: 'tags', title: "tags", align: 'center', width: 100,formatter: this.parent.tagsFormatter, },
          isRaw ? { field: 'createdBy', title: "createdBy", align: 'center' } : { field: 'createdByName', title: "createdByName", align: 'left' },
          { field: 'createdAt', title: "createdAt", align: 'left' },
          isRaw ? { field: 'updatedBy', title: "updatedBy", align: 'center' } : { field: 'updatedByName', title: "updatedByName", align: 'left' },
          { field: 'updatedAt', title: "updatedAt", align: 'left' },
          isRaw ? { field: 'versionSetId', title: "versionSetId", align: 'center' } : { field: 'versionSetName', title: "versionSetName", align: 'left' },
          { field: 'viewable_urn', title: "viewable_urn", align: 'left' },
          { field: 'viewable_guid', title: "viewable_guid", align: 'left' },

        ]
      },

      versionsetsTable: function (isRaw) {
        return [
          { field: 'id', title: "id", align: 'center' },
          { field: 'name', title: "name", align: 'center' },
          { field: 'issuanceDate', title: "issuanceDate", align: 'center' },

          isRaw ? { field: 'createdBy', title: "createdBy", align: 'center' } : { field: 'createdByName', title: "createdByName", align: 'left' },
          { field: 'createdAt', title: "createdAt", align: 'left' },
          isRaw ? { field: 'updatedBy', title: "updatedBy", align: 'center' } : { field: 'updatedByName', title: "updatedByName", align: 'left' },
          { field: 'updatedAt', title: "updatedAt", align: 'left' },
        ]
      },
      uploadsTable: function (isRaw) {
        return [
          { field: 'id', title: "id", align: 'center' },
          isRaw ? { field: 'versionSetId', title: "versionSetId", align: 'center' } : { field: 'versionSetName', title: "versionSetName", align: 'left' },
          { field: 'status', title: "status", align: 'center' },
          isRaw ? { field: 'publishedBy', title: "publishedBy", align: 'center' } : { field: 'publishedByName', title: "publishedByName", align: 'left' },
          { field: 'publishedAt', title: "publishedAt", align: 'left' },
          isRaw ? { field: 'createdBy', title: "createdBy", align: 'center' } : { field: 'createdByName', title: "createdByName", align: 'left' },
          { field: 'createdAt', title: "createdAt", align: 'left' },
          isRaw ? { field: 'updatedBy', title: "updatedBy", align: 'center' } : { field: 'updatedByName', title: "updatedByName", align: 'left' },
          { field: 'updatedAt', title: "updatedAt", align: 'left' },
        ]
      }

    }
  }

  resetData() {
    this._data = {
      sheetsTable: [],
      versionsetsTable: null,
      uploadsTable: null
    }
  }

  //colum formats
  rawFormatter(value, row, index) {
    var re = `<ul>`
    value.forEach(async element => {
      re += `<li>${element.id}</li>`;
    });
    re += `</ul>`

    return re
  }

  tagsFormatter(value, row, index) {
    var re = `<ul>`
    value.forEach(async e => {
      re += `<li>${e}</li>`;
    });
    re += `</ul>`
    return re
  }

  initTable(domId, isRaw) {
    $(`#${domId}`).bootstrapTable('destroy');
    const columns = this._tableFixComlumns[domId](isRaw)
    $(`#${domId}`).bootstrapTable({
      parent: this,
      data: [],
      editable: true,
      clickToSelect: true,
      cache: false,
      showToggle: false,
      showPaginationSwitch: false,
      pagination: true,
      pageList: [5, 10, 25, 50, 100],
      pageSize: 10,
      pageNumber: 1,
      uniqueId: 'id',
      striped: true,
      search: false,
      showRefresh: false,
      minimumCountColumns: 2,
      smartDisplay: true,
      columns: columns
    });
  }

  initUploadsTable(domId, isRaw) {
    $(`#${domId}`).bootstrapTable('destroy');
    const columns = this._tableFixComlumns[domId](isRaw)
    $(`#${domId}`).bootstrapTable({
      parent: this,
      data: [],
      editable: false,
      clickToSelect: true,
      cache: false,
      showToggle: false,
      showPaginationSwitch: false,
      pagination: true,
      pageList: [5, 10, 25, 50, 100],
      pageSize: 10,
      pageNumber: 1,
      uniqueId: 'id',
      striped: true,
      search: false,
      showRefresh: false,
      minimumCountColumns: 2,
      smartDisplay: true,
      columns: columns,
      treeShowField: 'id',
      parentIdField: 'pid',


    });
  }




  async refreshTable(domId, isRaw = false) {
    $(`#${domId}`).bootstrapTable('destroy');

    var fixCols = this._tableFixComlumns[domId](isRaw)

    $(`#${domId}`).bootstrapTable({
      data: this._data[domId],
      editable: false,
      clickToSelect: true,
      cache: false,
      showToggle: false,
      showPaginationSwitch: false,
      pagination: true,
      pageList: [5, 10, 25, 50, 100],
      pageSize: 5,
      pageNumber: 1,
      uniqueId: 'id',
      striped: true,
      search: false,
      showRefresh: false,
      minimumCountColumns: 2,
      smartDisplay: true,
      columns: fixCols
    });

    this.delegateSelectEvents(domId)

  }

  delegateSelectEvents(domId) {

    if(domId=='sheetsTable')
    $("#sheetsTable").on("click-row.bs.table", (async (row, $sel, field) => {

      const sheetId = $sel.id
      const viewable_urn = $sel.viewable_urn
      const viewable_guid = $sel.viewable_guid

      $('#reviewPanel').hide()
      $('#viewerPanel').show()
      //base64 encoded urn 
      launchViewer(btoa(viewable_urn), viewable_guid)

    }))

    else if(domId=='uploadsTable')
    $("#uploadsTable").on("click-row.bs.table", (async (row, $sel, field) => {

      const uploadId = $sel.id
      const status = $sel.status

      $('#labelUploadId').text(uploadId);

      if (status == 'IN_REVIEW') {
        //ask the user to review the sheets
        review_view.initTable(false)
        $('.clsInProgress_review').show();
        $('#reviewPanel').show()
        $('#viewerPanel').hide()
        const herf = $('#labelProjectHref').text()
        const projectId = herf.split('/')[8]
        const projectId_without_b = projectId.split('b.')[1]
        await review_view.getAllReviewSheets(projectId_without_b, uploadId)
      }  
      else{}

    }))

  }


  async getAllSheetsData(projectId, projectName) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/aps/sheets/alldata/${projectId}/${encodeURIComponent(projectName)}`,
        type: 'GET',
        success: (data) => {
          resolve(data)
        }, error: (error) => {
          reject(error)
        }
      });
    })
  }

  async getSheets(projectId, onepage = false, offset = 0, limit = 100) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/aps/sheets/${projectId}/${encodeURIComponent(projectName)}`,
        type: 'GET',
        success: (data) => {
          resolve(data)
        }, error: (error) => {
          reject(error)
        }
      });
    })
  }


  async getVersionSets(projectId, onepage = false, offset = 0, limit = 100) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/aps/sheets/versionsets/${projectId}`,
        type: 'GET',
        success: (data) => {
          this._data.versionsetsTable = data
          resolve(data)
        }, error: (error) => {
          reject(error)
        }
      });
    })
  }

  async postVersionSets(projectId,payload) {

    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/aps/sheets/versionSet/${projectId}`,
        type: 'POST',
        dataType: 'json',
        data: {data:JSON.stringify(payload)},
        success: (data) => {
          this._data.versionsetsTable = data
          resolve(data)
        }, error: (error) => {
          reject(error)
        }
      });
    })
  }

  async getUploads(projectId, onepage = false, offset = 0, limit = 100) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/aps/sheets/uplpads/${projectId}`,
        type: 'GET',
        success: (data) => {
          this._data.uploadsTable = data
          resolve(data)
        }, error: (error) => {
          reject(error)
        }
      });
    })
  }


}
 