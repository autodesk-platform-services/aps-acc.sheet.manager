class ReviewsView {

  constructor() {
    this._reviewSheetsTable = null 
    this._pageLimit = 25
    this._pageOffset = 0 
    this._data = {
      reviewSheetsTable: []
    }

    this._tableFixComlumns = {
      parent: this,
      reviewSheetsTable: function (isRaw) {
        return [
          { field: 'id', title: "id", align: 'center' },
          { field: 'number', title: "number", align: 'center',formatter: this.parent.numberFormatter  },
          { field: 'title', title: "title", align: 'center',formatter: this.parent.titleFormatter  },
          { field: 'fileName', title: "fileName", align: 'center' },
          { field: 'page', title: "page", align: 'center' }, 
          { field: 'tags', title: "tags", align: 'center', formatter: this.parent.tagsFormatter, width: 20 },
          { field: 'tinyThumbnail', title: "thumbnail", align: 'center', formatter: this.parent.thumbnailFormatter, width: 20 }
        ]
      }

    }
  }

  resetData() {
    this._data = {
      reviewSheetsTable: []
    }
  }

  //colum formats
  thumbnailFormatter(value, row, index) {
    var re = `<div><img src="${value.signedUrl}" alt="" width="${value.size[0]}" height="${value.size[1]}"></div>`
    return re
  }

  numberFormatter(value, row, index) {
    if(value == null || value =='')
       value='{no title}'
    var re = `<a href="#" id="review-number-${row.id}" data-type="text" data-placement="right" >${value}</a>`
    return re
  }

  titleFormatter(value, row, index) {
    if(value == null || value =='')
        value='{no title}'
    var re = `<a href="#" id="review-title-${row.id}" data-type="text" data-placement="right" >${value}</a>`
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

  initTable(isRaw) {
    $(`#reviewSheetsTable`).bootstrapTable('destroy');
    const columns = this._tableFixComlumns['reviewSheetsTable'](isRaw)
    $(`#reviewSheetsTable`).bootstrapTable({
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

  async refreshTable(isRaw = false) {
    $(`#reviewSheetsTable`).bootstrapTable('destroy');

    var fixCols = this._tableFixComlumns['reviewSheetsTable'](isRaw)

    $(`#reviewSheetsTable`).bootstrapTable({
      data: this._data['reviewSheetsTable'],
      editable: true,
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
   
    //deletegate editing behavior
    this.delegateEditing()

    //delegate thumbnail clicking
    this.delegateHoverEvents() 

  } 

  delegateEditing(){
    this._data.reviewSheetsTable.forEach(i=>{
      $(`#review-title-${i.id}`).editable()
      $(`#review-number-${i.id}`).editable() 
    })
  }

  delegateHoverEvents() {
    $("#reviewSheetsTable").on("click-cell.bs.table", (async (field, value, row, $element) => {
      if (value.includes('Thumbnail')) {
        //show up big Thumbnail 

        $("#bigImgDiaglogImg").attr("src", `${$element.bigThumbnail.signedUrl}`); 
        $('#bigImgDiaglog').modal('show');  
      }
    }))

  }

  async getAllReviewSheets(projectId, uploadId) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/aps/sheets/reviewSheets/${projectId}/${uploadId}`,
        type: 'GET',
        success: (data) => {
          resolve(data)
        }, error: (error) => {
          reject(error)
        }
      });
    })
  }

  async publishSheets(projectId, uploadId) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/aps/sheets/publishSheets/${projectId}/${uploadId}`,
        type: 'GET',
        success: (data) => {
          resolve(data)
        }, error: (error) => {
          reject(error)
        }
      });
    })
  }

  async patchReviewSheets(projectId, uploadId,payload) { 

    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/aps/sheets/patchReviewSheets/${projectId}/${uploadId}`,
        type: 'POST',
        dataType: 'json',
        data: {data:JSON.stringify(payload)},
        success: (data) => {
          resolve(data)
        }, error: (error) => {
          reject(error)
        }
      });
    })
  }

 

}