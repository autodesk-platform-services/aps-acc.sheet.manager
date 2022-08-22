
const tagsListFormat = (list) => {
   var res = ''
   for(var i in list){
     res+=`${list[i]} \n`
    }
   return res
}; 
 
 
const sheetsColumns = [
   { id: 'id', propertyName: 'id', columnTitle: 'id', columnWidth: 8, locked: true },
   { id: 'number', propertyName: 'number', columnTitle: 'number', columnWidth: 8, locked: false },
   { id: 'title', propertyName: 'title', columnTitle: 'title', columnWidth: 8, locked: false },
   { id: 'uploadFileName', propertyName: 'uploadFileName', columnTitle: 'uploadFileName', columnWidth: 8, locked: false },
   { id: 'tags', propertyName: 'tags', columnTitle: 'tags', columnWidth: 10, locked: false,format: tagsListFormat },
   { id: 'createdBy', propertyName: 'createdBy', columnTitle: 'createdBy', columnWidth: 10, locked: false },
   { id: 'createdByName', propertyName: 'createdByName', columnTitle: 'createdByName', columnWidth: 10, locked: false },
   { id: 'createdAt', propertyName: 'createdAt', columnTitle: 'createdAt', columnWidth: 10, locked: false },
   { id: 'updatedAt', propertyName: 'updatedAt', columnTitle: 'updatedAt', columnWidth: 10, locked: false },
   { id: 'updatedBy', propertyName: 'updatedBy', columnTitle: 'updatedByName', columnWidth: 10, locked: false },
   { id: 'updatedByName', propertyName: 'updatedByName', columnTitle: 'updatedByName', columnWidth: 10, locked: false },
   { id: 'versionSetId', propertyName: 'versionSetId', columnTitle: 'versionSetId', columnWidth: 10, locked: false },
   { id: 'versionSetName', propertyName: 'versionSetName', columnTitle: 'versionSetName', columnWidth: 10, locked: false },
   { id: 'viewable_urn', propertyName: 'viewable_urn', columnTitle: 'viewable_urn', columnWidth: 10, locked: false },
   { id: 'viewable_guid', propertyName: 'viewable_guid', columnTitle: 'viewable_guid', columnWidth: 10, locked: false } 
];

const versionSetsColumns = [
   { id: 'id', propertyName: 'id', columnTitle: 'id', columnWidth: 8, locked: true },
   { id: 'name', propertyName: 'name', columnTitle: 'name', columnWidth: 8, locked: true },
   { id: 'createdBy', propertyName: 'createdBy', columnTitle: 'createdBy', columnWidth: 10, locked: false },
   { id: 'createdByName', propertyName: 'createdByName', columnTitle: 'createdByName', columnWidth: 10, locked: false },
   { id: 'createdAt', propertyName: 'createdAt', columnTitle: 'createdAt', columnWidth: 10, locked: false },
   { id: 'updatedAt', propertyName: 'updatedAt', columnTitle: 'updatedAt', columnWidth: 10, locked: false },
   { id: 'updatedBy', propertyName: 'updatedBy', columnTitle: 'updatedByName', columnWidth: 10, locked: false },
   { id: 'updatedByName', propertyName: 'updatedByName', columnTitle: 'updatedByName', columnWidth: 10, locked: false },
];


const uploadsColumns = [
   { id: 'id', propertyName: 'id', columnTitle: 'id', columnWidth: 8, locked: true },
   { id: 'versionSetId', propertyName: 'versionSetId', columnTitle: 'versionSetId', columnWidth: 10, locked: false },
   { id: 'versionSetName', propertyName: 'versionSetName', columnTitle: 'versionSetName', columnWidth: 10, locked: false },
   { id: 'status', propertyName: 'status', columnTitle: 'status', columnWidth: 10, locked: false },
   { id: 'publishedBy', propertyName: 'publishedBy', columnTitle: 'publishedBy', columnWidth: 10, locked: false },
   { id: 'publishedByName', propertyName: 'publishedByName', columnTitle: 'publishedByName', columnWidth: 10, locked: false },
   { id: 'createdBy', propertyName: 'createdBy', columnTitle: 'createdBy', columnWidth: 10, locked: false },
   { id: 'createdByName', propertyName: 'createdByName', columnTitle: 'createdByName', columnWidth: 10, locked: false },
   { id: 'createdAt', propertyName: 'createdAt', columnTitle: 'createdAt', columnWidth: 10, locked: false },
   { id: 'updatedAt', propertyName: 'updatedAt', columnTitle: 'updatedAt', columnWidth: 10, locked: false },
   { id: 'updatedBy', propertyName: 'updatedBy', columnTitle: 'updatedByName', columnWidth: 10, locked: false },
   { id: 'updatedByName', propertyName: 'updatedByName', columnTitle: 'updatedByName', columnWidth: 10, locked: false },
];
  
module.exports = {
    sheetsColumns,
    versionSetsColumns,
    uploadsColumns 
};
