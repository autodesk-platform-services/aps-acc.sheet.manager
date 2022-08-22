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

// Autodesk Forge configuration

const credentials = {
    client_id: process.env.FORGE_CLIENT_ID,
    client_secret: process.env.FORGE_CLIENT_SECRET,
    callback_url: process.env.FORGE_CALLBACK_URL,
    scopes: {
        // Required scopes for the server-side application
        internal: ['data:read', 'data:write'], 
        // Required scopes for the server-side BIM360 Account Admin
        internal_2legged: ['account:read'],
        // Required scope for the client-side viewer
        public: ['viewables:read']
    },
    token_2legged:'',
    token_3legged:'',
    ForgeBaseUrl:'https://developer.api.autodesk.com' 
}

const endpoints = {
      
    accSheet:{
        get_sheets:`${credentials.ForgeBaseUrl}/construction/sheets/v1/projects/{0}/sheets`,
        batch_get_sheets:`${credentials.ForgeBaseUrl}/construction/sheets/v1/projects/{0}/sheets:batch-get`,
        batch_update_sheets:`${credentials.ForgeBaseUrl}/construction/sheets/v1/projects/{0}/sheets:batch-update`,
        batch_delete_sheets:`${credentials.ForgeBaseUrl}/construction/sheets/v1/projects/{0}/sheets:batch-delete`,
        batch_restore_sheets:`${credentials.ForgeBaseUrl}/construction/sheets/v1/projects/{0}/sheets:batch-restore`,

        get_version_sets:`${credentials.ForgeBaseUrl}/construction/sheets/v1/projects/{0}/version-sets`,
        post_version_sets:`${credentials.ForgeBaseUrl}/construction/sheets/v1/projects/{0}/version-sets`,
        batch_get_version_sets:`${credentials.ForgeBaseUrl}/construction/sheets/v1/projects/{0}/version-sets:batch-get`,
        batch_delete_version_sets:`${credentials.ForgeBaseUrl}/construction/sheets/v1/projects/{0}/version-sets:batch-get`,
        patch_version_set:`${credentials.ForgeBaseUrl}/construction/sheets/v1/projects/{0}/version-sets/{1}`,

        get_uploads:`${credentials.ForgeBaseUrl}/construction/sheets/v1/projects/{0}/uploads`,
        get_upload:`${credentials.ForgeBaseUrl}/construction/sheets/v1/projects/{0}/uploads/{1}`,
        post_uploads:`${credentials.ForgeBaseUrl}/construction/sheets/v1/projects/{0}/uploads`,

        get_review_sheets:`${credentials.ForgeBaseUrl}/construction/sheets/v1/projects/{0}/uploads/{1}/review-sheets`,
        get_review_thumbnails:`${credentials.ForgeBaseUrl}/construction/sheets/v1/projects/{0}/uploads/{1}/thumbnails:batch-get`,
        patch_review_sheets:`${credentials.ForgeBaseUrl}/construction/sheets/v1/projects/{0}/uploads/{1}/review-sheets`,
        publish_sheets:`${credentials.ForgeBaseUrl}/construction/sheets/v1/projects/{0}/uploads/{1}/review-sheets:publish`,

        create_storage:`${credentials.ForgeBaseUrl}/construction/sheets/v1/projects/{0}/storage`

     },
    dataManagement:{ 
        s3_signed_url:`${credentials.ForgeBaseUrl}/oss/v2/buckets/{0}/objects/{1}/signeds3upload`
    }, 
    accRelationship:{
         search:`${credentials.ForgeBaseUrl}/bim360/relationship/v2/containers/{0}/relationships:search`,
    },

    httpHeaders: function (access_token) {
        return {
          Authorization: 'Bearer ' + access_token
        }
    } 
}

module.exports = {
    credentials,
    endpoints
};
