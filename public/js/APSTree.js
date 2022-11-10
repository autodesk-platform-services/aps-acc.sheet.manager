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

$(document).ready(function () {
  // first, check if current visitor is signed in
  $.ajax({
    url: '/api/aps/oauth/token',
    success: function (res) {
      // yes, it is signed in...
      $('#autodeskSignOutButton').show();
      $('#autodeskSigninButton').hide();

      $('#refreshSourceHubs').show(); 

      // prepare sign out
      $('#autodeskSignOutButton').click(function () {
        $('#hiddenFrame').on('load', function (event) {
          location.href = '/api/forge/oauth/signout';
        });
        $('#hiddenFrame').attr('src', 'https://accounts.autodesk.com/Authentication/LogOut');
        // learn more about this signout iframe at
        // https://forge.autodesk.com/blog/log-out-forge
      })

      // and refresh button
      $('#refreshSourceHubs').click(function () {
        $('#sourceHubs').jstree(true).refresh();
      });

      prepareUserHubsTree();
      showUser();
    },
    error: function(err){
      $('#autodeskSignOutButton').hide();
      $('#autodeskSigninButton').show();
    }
  });

  $('#autodeskSigninButton').click(function () {
    jQuery.ajax({
      url: '/api/forge/oauth/url',
      success: function (url) {
        location.href = url;
      }
    });
  })


  $.getJSON("/api/forge/oauth/clientid", function (res) {
    $("#ClientID").val(res.id);
    $("#provisionAccountSave").click(function () {
      $('#provisionAccountModal').modal('toggle');
      $('#sourceHubs').jstree(true).refresh();
    });
  });  

});



function prepareUserHubsTree() {
  $('#sourceHubs').jstree({
      'core': {
          'themes': { "icons": true },
          'multiple': false,
          'data': {
              "url": '/api/forge/datamanagement',
              "dataType": "json",
              'cache': false,
              'data': function (node) {
                  $('#sourceHubs').jstree(true).toggle_node(node);
                  return { "id": node.id };
              }
          }
      },
      'types': {
        'default': { 'icon': 'glyphicon glyphicon-question-sign' },
        '#': { 'icon': 'glyphicon glyphicon-user' },
        'hubs': { 'icon': './img/a360hub.png' },
        'personalHub': { 'icon': './img/a360hub.png' },
        'bim360Hubs': { 'icon': './img/bim360hub.png' },
        'bim360projects': { 'icon': './img/bim360project.png' },
        'a360projects': { 'icon': './img/a360project.png' },
        'accprojects': { 'icon': './img/accproject.svg' }
      },
      "sort": function (a, b) {
          var a1 = this.get_node(a);
          var b1 = this.get_node(b);
          var parent = this.get_node(a1.parent);
          if (parent.type === 'items') { // sort by version number
              var id1 = Number.parseInt(a1.text.substring(a1.text.indexOf('v') + 1, a1.text.indexOf(':')))
              var id2 = Number.parseInt(b1.text.substring(b1.text.indexOf('v') + 1, b1.text.indexOf(':')));
              return id1 > id2 ? 1 : -1;
          }
          else if (a1.type !== b1.type) return a1.icon < b1.icon ? 1 : -1; // types are different inside folder, so sort by icon (files/folders)
          else return a1.text > b1.text ? 1 : -1; // basic name/text sort
      },
      "plugins": ["types", "state", "sort"],
      "state": { "key": "sourceHubs" }// key restore tree state
  }).on('activate_node.jstree', function(evt, data){
    if (data != null && data.node != null && (data.node.type == 'accprojects' )) {
      $('#labelProjectHref').text(data.node.id);
      $('#labelProjectName').text(data.node.text);

      
       (async (href,projectName)=>{

         //start the progress bar
         $('.clsInProgress').show();

         //get account id and project id
         const accountId = href.split('/')[6]
         const projectId = href.split('/')[8] 
         const accountId_without_b = accountId.split('b.')[1]
        const projectId_without_b = projectId.split('b.')[1]

        //store in hidden DOM
         $('#labelProjectId').text(projectId_without_b);
         $('#labelAccountId').text(accountId_without_b);

        //if the table contents are presented as raw id 
        const isRaw = $('input[name="dataTypeToDisplay"]:checked').val() === 'rawData' 
        sheets_view.resetData()
        sheets_view.initTable('sheetsTable', isRaw)
        sheets_view.initTable('versionsetsTable', isRaw)
        sheets_view.initTable('uploadsTable', isRaw)

        await sheets_view.getAllSheetsData(projectId_without_b,projectName) 

        //wait the result at socket modules: SocketEnum.GET_SHEETS_ALL_DATA
        //......


      })(data.node.id,data.node.text) 
      
      
    }else{
      alert('please select a ACC project!')
    }
  }); 
}

function showUser() {
  jQuery.ajax({
    url: '/api/forge/user/profile',
    success: function (profile) {
      var img = '<img src="' + profile.picture + '" height="20px">';
      $('#userInfo').html(img + profile.name);
    }
  });
}