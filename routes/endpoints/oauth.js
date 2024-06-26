/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Developer Advocacy and Support
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

const express = require('express');

const config = require('../../config');
const { OAuth } = require('../services/oauth');

let router = express.Router();

router.get('/callback/oauth', async (req, res, next) => {
    const { code } = req.query;
    const oauth = new OAuth(req.session);
    try {
        await oauth.setCode(code);
        res.redirect('/');
    } catch(err) {
        next(err);
    }
});

router.get('/oauth/url', (req, res) => {
    const oauth = new OAuth(req.session);
    const url = oauth.getAuthorizationUrl();
    res.end(url);
});

router.get('/oauth/signout', (req, res) => {
    req.session = null;
    res.redirect('/');
});

// Endpoint to return a 2-legged access token
router.get('/oauth/token', async (req, res, next) => {
    const oauth = new OAuth(req.session);
    if (!oauth.isAuthorized()) {
        res.status(401).end();
        return;
    } 
    try {
        const accessToken = await oauth.getPublicToken();
        res.json(accessToken);
    } catch(err) {
        next(err);
    }
});

router.get('/oauth/clientid', (req, res) =>{
    res.status(200).end( JSON.stringify({id : config.credentials.client_id}) );
});

module.exports = router;
