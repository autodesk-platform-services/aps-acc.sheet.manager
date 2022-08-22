
const fs = require('fs');
const excelJS = require('exceljs');
const columnDefs = require('./columnDefs');
const asset_service = require('../services/sheets');
const asyncPool = require('tiny-async-pool')
const utility = require('../utility'); 

module.exports = {
    _export 
};

//each element of the array will export one sheet in the same Excel file
async function _export(exportName, dataArray) {
    try {
        const workbook = new excelJS.Workbook();
        workbook.creator = 'acc-sheets-export';
        const excel_sheets = ['sheets', 'versionSets', 'uploads']

        excel_sheets.forEach(s => {

            const worksheet = workbook.addWorksheet(`${s}`)
            const data = dataArray[s]
            const fixColumnsDef = columnDefs[s + 'Columns'].slice()
            var columnDef = fixColumnsDef
            
            worksheet.columns = columnDef.map(col => {
                return { key: col.id, header: col.columnTitle, width: col.columnWidth };
            });

            for (const d of data) {
                let rowData = {};
                for (const column of columnDef) {
                    if (column.format) {
                        rowData[column.id] = column.format(d[column.propertyName]);
                    }
                    else {
                        rowData[column.id] = d[column.propertyName];
                    }
                }
                var row = worksheet.addRow(rowData);
            }
            worksheet.properties.defaultRowHeight = 25;
            worksheet.properties.defaultColWidth = 30;
            worksheet.eachRow(async (row, rowNumber) => {
                rowNumber == 1 ?
                    row.font = { size: 15, bold: true } : row.font = { size: 15, bold: false }
                 
            })

            // Setup data validation and protection where needed
            for (const column of columnDef) {
                if (column.locked || column.validation) {
                    worksheet.getColumn(column.id).eachCell(function (cell) {
                        if (column.locked) {
                            cell.protection = {
                                locked: true
                            };
                        }
                        if (column.validation) {
                            cell.dataValidation = column.validation;
                        }
                    });
                }
            } 
        })
 
        const buffer = await workbook.xlsx.writeBuffer();
        fs.writeFileSync(`./Excel_Exports/${exportName}.xlsx`, buffer, "binary")
        console.log(`./Excel_Exports/${exportName}.xlsx is saved`);
        return true
    } catch (e) {
        console.log(`./Excel_Exports/${exportName}.xlsx failed`);
        return false 
    } 
} 