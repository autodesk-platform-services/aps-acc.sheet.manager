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

const { DataManagementClient } = require('@aps_sdk/data-management');

const { sdkManager } = require('./sdkManager');
const dataManagementClient = new DataManagementClient(sdkManager);

async function getHubs(credentials) {
    const resp = await dataManagementClient.getHubs(credentials.access_token);
    return resp.data.map((hub) => {
        let hubType;
        switch (hub.attributes.extension.type) {
            case 'hubs:autodesk.core:Hub':
                hubType = 'hubs';
                break;
            case 'hubs:autodesk.a360:PersonalHub':
                hubType = 'personalHub';
                break;
            case 'hubs:autodesk.bim360:Account':
                hubType = 'bim360Hubs';
                break;
        }
        return createTreeNode(
            hub.links.self.href,
            hub.attributes.name,
            hubType,
            true
        );
    });
}

async function getProjects(hubId, credentials) {
    const resp = await dataManagementClient.getHubProjects(credentials.access_token, hubId);
    return resp.data.map((project) => {
        let projectType = 'projects';
        switch (project.attributes.extension.type) {
            case 'projects:autodesk.core:Project':
                projectType = 'a360projects';
                break;
            case 'projects:autodesk.bim360:Project':
                if(project.attributes.extension.data.projectType == 'ACC'){
                    projectType = 'accprojects';  
                }else{
                    projectType = 'bim360projects'; 
                }
                break; 
        }
        return createTreeNode(
            project.links.self.href,
            project.attributes.name,
            projectType,
            false
        );
    });
}
// Format data for tree
function createTreeNode(_id, _text, _type, _children) {
    return { id: _id, text: _text, type: _type, children: _children };
}

module.exports = {
    getHubs,
    getProjects
};