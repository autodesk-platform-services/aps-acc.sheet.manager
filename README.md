# ACC Sheet Export & Import Sample

[![Node.js](https://img.shields.io/badge/Node.js-12.19-blue.svg)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-6.14.8-blue.svg)](https://www.npmjs.com/)
![Platforms](https://img.shields.io/badge/Web-Windows%20%7C%20MacOS%20%7C%20Linux-lightgray.svg)
[![Data-Management](https://img.shields.io/badge/Data%20Management-v1-green.svg)](http://developer.autodesk.com/)

[![ACC Sheet API](https://img.shields.io/badge/ACC%20Sheet-api-green.svg)](https://forge.autodesk.com/en/docs/acc/v1/reference/http/sheets-sheets-GET/)
 

[![MIT](https://img.shields.io/badge/License-MIT-blue.svg)](http://opensource.org/licenses/MIT)
[![Level](https://img.shields.io/badge/Level-Intermediate-blue.svg)](http://developer.autodesk.com/)


## Description
This sample demonstrates the following use cases:

* Export sheets, version sets and uploads of ACC Sheet to excel file. The web application provides two options to display the ID properties either in **Raw data** and **Human readable form**.
* View basic information of published sheets. View published sheet in Forge Viewer
* View basic information of uploads. List reviewing sheets of uploads (when upload status is IN_REVIEW)
* Modify number and title of reviewing sheets
* Publish reviewing sheets  
* Create new sheets from source PDF 
* Delete sheets (coming soon)

This sample is implemented based on Node.js version of [Learn Forge Tutorial](https://github.com/Autodesk-Forge/learn.forge.viewhubmodels/tree/nodejs), please refer to https://learnforge.autodesk.io/ for the details about the framework.

## Thumbnail
![thumbnail](/help/main.png)  

## Demonstration
[![https://youtu.be/CoreCvObcjU](https://img.youtube.com/vi/CoreCvObcjU/0.jpg)]

# Web App Setup

## Prerequisites

1. **Forge Account**: Follow [this tutorial](http://learnforge.autodesk.io/#/account/) to create a Forge Account, activate subscription and create an app. For this new app, use **http://localhost:3000/api/forge/callback/oauth** as Callback URL. Finally take note of the **Client ID** and **Client Secret**.
2. **ACC Account**: must be Account Admin to add the app integration. It is same to BIM360 integration. [Learn about how to integrate](https://forge.autodesk.com/blog/bim-360-docs-provisioning-forge-apps). 
3. **ACC Sheet**: In one project of Autodesk. Please check [product help](https://help.autodesk.com/view/BUILD/ENU/?guid=Upload_And_Publish_Sheets) for more information
4. **Node.js**: basic knowledge with [**Node.js**](https://nodejs.org/en/).
5. **JavaScript** basic knowledge with **jQuery**

## Running locally

Install [NodeJS](https://nodejs.org), version 8 or newer.

Clone this project or download it (this `nodejs` branch only). It's recommended to install [GitHub desktop](https://desktop.github.com/). To clone it via command line, use the following (**Terminal** on MacOSX/Linux, **Git Shell** on Windows):

    git clone https://github.com/

Install the required packages using `npm install`.


**Environment environment**

Set the enviroment variables with your client ID & secret and finally start it. Via command line, navigate to the folder where this repository was cloned and use the following:

Mac OSX/Linux (Terminal)

    npm install
    export FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM DEVELOPER PORTAL>>
    export FORGE_CLIENT_SECRET=<<YOUR CLIENT SECRET>>
    export FORGE_CALLBACK_URL=<<YOUR CALLBACK URL>>

    npm start

Windows (use **Node.js command line** from Start menu)

    npm install
    set FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM DEVELOPER PORTAL>>
    set FORGE_CLIENT_SECRET=<<YOUR CLIENT SECRET>>
    set FORGE_CALLBACK_URL=<<YOUR CALLBACK URL>>

    npm start

OR, set enviroment variables of [launch.json](/.vscode/launch.json) for debugging.

## Use Cases

1. Open the browser: [http://localhost:3000](http://localhost:3000). 
2. After user logging, select a project. The code will start extracting all assets, version sets and uploads. They will be displayed in the main table view. Switch **Raw data** and **Human readable** to check __IDs__ data.
3. Click _Export_ option of **Actions** and click _Execute_ button to download excel file. 
4. Switch to Sheets tab of the main table view, click any row of sheet, the corresponding sheet will be loaded in Forge Viewer.

<p align="center"><img src="./help/main.png" width="600" ></p>  

5. Switch to Uploads tab of the main table view, click any row of upload whose status is IN_REVIEW, the corresponding reviewing sheets will be displayed.

<p align="center"><img src="./help/upload.png" width="800" ></p>  
6. Click thumbnail column of the reviewing sheets table, the bigger thumbnail will shown up
<p align="center"><img src="./help/thumbnail.png" width="400" ></p>  
7. Click _title_ or _number_ column, you can edit the values.
<p align="center"><img src="./help/patch.png" width="600" ></p>  
8. Click **Modify Sheets**, Sheet API will update number or title with updated values
9. Click **Publish Sheets**, Sheet API will publish the reviewing sheets. The status of the upload will be changed to PUBLISHED. If any issue with the reviewing sheets, the API will throw exception message.

10. Click _Create New Version Set_ option of **Actions**, input name and issuanceDate of the new set and click _Execute_ button. It will create a new version set. Switch to Uploads tab of the main table view to check it. 

<p align="center"><img src="./help/set.png" width="400" ></p>  

11. Click _Create New Sheets_ option of **Actions**, input the id of the version set you want to upload to, click _Execute_ button, select one pdf file in the popup dialog. After the process is completed, the new upload will be available in the list of Uploads. The initial status is PROCESSING. When it is IN_REVIEW, you can review & publish sheets like step #5-9.
<p align="center"><img src="./help/newupload.png" width="400" ></p>  


## Deployment

To deploy this application to Heroku, the **Callback URL** for Forge must use your `.herokuapp.com` address. After clicking on the button below, at the Heroku Create New App page, set your Client ID, Secret and Callback URL for Forge.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Autodesk-Forge/forge-bim360.costmanagement.exchange.csv)


## Limitation
1. In this version, only one source PDF can be uploaded. It can be extended to multiple PDFs
2. In this version, only title and number can be edited with reviewing sheets. It can be extended to support modification of other attributes.

## Tips & Tricks

1. When editing title or number of reviewing sheets, ensure the values are unique in one version set. 
2. this sample adoptes the library of editable-table, which conflicts to date picker of Bootstrap. So the sample uses common date pickter (datetime-local).

## Further Reading
**Document**
- [Field Guide](https://forge.autodesk.com/en/docs/acc/v1/overview/field-guide/sheets/)
- [API Reference](https://forge.autodesk.com/en/docs/acc/v1/reference/http/sheets-sheets-GET/)
 
**Tutorials**:
- [uploading source pdf to publish sheets](https://forge.autodesk.com/en/docs/acc/v1/tutorials/sheets/upload-sheets/)

**Blogs**:
- [Forge Blog](https://forge.autodesk.com/categories/bim-360-api)
- [Field of View](https://fieldofviewblog.wordpress.com/), a BIM focused blog

## License
This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.

## Written by
Xiaodong Liang [@coldwood](https://twitter.com/coldwood), [Forge Advocate and Support](http://forge.autodesk.com)
