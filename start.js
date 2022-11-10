/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Developer Acvocacy and Support
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
const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);  
 const cookieSession = require('cookie-session');

const PORT = process.env.PORT || 3000;
const config = require('./config');
if (config.credentials.client_id == null || config.credentials.client_id == '' ||
    config.credentials.client_secret == null || config.credentials.client_secret == ''||
    config.credentials.callback_url == null || config.credentials.callback_url == '') {
    console.error('Missing APS_CLIENT_ID or APS_CLIENT_SECRET or APS_CALLBACK_URL in env. variables.');
} 
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');  
app.use(bodyParser());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
    name: 'aps_session',
    keys: ['aps_secure_key'],
    maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days, same as refresh token
}));


app.use(express.json({ limit: '50mb' }));
app.use('/api/aps', require('./routes/endpoints/oauth'));
app.use('/api/aps', require('./routes/endpoints/datamanagement'));
app.use('/api/aps', require('./routes/endpoints/user'));
app.use('/api/aps', require('./routes/endpoints/sheets'));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode).json(err);
});

app.set('port', process.env.PORT || 3000);

//socket for server notifying client side
global.MyApp = {
    SocketIo : require('socket.io')(server)
  };
  global.MyApp.SocketIo.on('connection', function(socket){
    console.log('user connected to the socket');
  
    socket.on('disconnect', function(){
        console.log('user disconnected from the socket');
      });
  })

server.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });
