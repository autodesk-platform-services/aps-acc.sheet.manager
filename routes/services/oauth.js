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

const { AuthenticationClient, Scopes, ResponseType } = require('@aps_sdk/authentication');

const { sdkManager } = require('./sdkManager');
const authenticationClient = new AuthenticationClient(sdkManager);

const config = require('../../config');

class OAuth {
    constructor(session) {
        this._session = session;
    }

    getAuthorizationUrl(scopes = config.credentials.scopes.internal) {
        const { client_id, callback_url } = config.credentials;
        let oauthUrl = authenticationClient.authorize(client_id, ResponseType.Code, callback_url, this.scopeStringsToArray(scopes));

        return oauthUrl;
    }

    isAuthorized() {
        return !!this._session.public_token;
    }

    _expiresIn() {
        const now = new Date();
        const expiresAt = new Date(this._session.expires_at)
        return Math.round((expiresAt.getTime() - now.getTime()) / 1000);
    };

    _isExpired() {
        return (new Date() > new Date(this._session.expires_at));
    }

    /**
     * 
     * @param {string[]} scopeStrings 
     * @returns {Scopes[]}
     */
    scopeStringsToArray(scopeStrings) {
        /**
         * @type {Scopes[]}
         */
        const scopes = [];

        if (scopeStrings.includes('data:read')) scopes.push(Scopes.DataRead);
        if (scopeStrings.includes('data:write')) scopes.push(Scopes.DataWrite);
        if (scopeStrings.includes('data:create')) scopes.push(Scopes.DataCreate);
        if (scopeStrings.includes('data:search')) scopes.push(Scopes.DataSearch);

        if (scopeStrings.includes('account:read')) scopes.push(Scopes.AccountRead);
        if (scopeStrings.includes('account:write')) scopes.push(Scopes.AccountWrite);

        if (scopeStrings.includes('bucket:read')) scopes.push(Scopes.BucketRead);
        if (scopeStrings.includes('bucket:create')) scopes.push(Scopes.BucketCreate);
        if (scopeStrings.includes('bucket:update')) scopes.push(Scopes.BucketUpdate);
        if (scopeStrings.includes('bucket:delete')) scopes.push(Scopes.BucketDelete);

        if (scopeStrings.includes('user:profileRead')) scopes.push(Scopes.UserProfileRead);

        if (scopeStrings.includes('viewables:read')) scopes.push(Scopes.ViewablesRead);

        return scopes;
    }

    getClient() {
        return authenticationClient;
    }

    async get2LeggedToken(scopes = config.credentials.scopes.internal_2legged) {
        const { client_id, client_secret } = config.credentials;

        const credentials = await authenticationClient.getTwoLeggedToken(
            client_id,
            client_secret,
            this.scopeStringsToArray(scopes)
        );

        return credentials;
    }

    async getPublicToken() {
        if (this._isExpired()) {
            await this._refreshTokens();
        }

        return {
            access_token: this._session.public_token,
            expires_in: this._expiresIn()
        };
    }

    async getInternalToken() {
        if (this._isExpired()) {
            await this._refreshTokens();
        }

        return {
            access_token: this._session.internal_token,
            expires_in: this._expiresIn()
        };
    }

    // On callback, pass the CODE to this function, it will
    // get the internal and public tokens and store them 
    // on the session
    async setCode(code) {
        const { client_id, client_secret, callback_url } = config.credentials;

        const internalCredentials = await authenticationClient.getThreeLeggedToken(client_id, code, callback_url, {
            clientSecret: client_secret
        });
        const publicCredentials = await authenticationClient.getRefreshToken(client_id, internalCredentials.refresh_token, {
            clientSecret: client_secret,
            scopes: this.scopeStringsToArray(config.credentials.scopes.public)
        });

        const now = new Date();
        this._session.internal_token = internalCredentials.access_token;
        this._session.public_token = publicCredentials.access_token;
        this._session.refresh_token = publicCredentials.refresh_token;
        this._session.expires_at = (now.setSeconds(now.getSeconds() + publicCredentials.expires_in));
    }

    async _refreshTokens() {
        const { client_id, client_secret } = config.credentials;
        const internalCredentials = await authenticationClient.getRefreshToken(client_id, this._session.refresh_token, {
            clientSecret: client_secret
        });

        const publicCredentials = await authenticationClient.getRefreshToken(client_id, internalCredentials.refresh_token, {
            clientSecret: client_secret,
            scopes: this.scopeStringsToArray(config.credentials.scopes.public)
        });

        const now = new Date();
        this._session.internal_token = internalCredentials.access_token;
        this._session.public_token = publicCredentials.access_token;
        this._session.refresh_token = publicCredentials.refresh_token;
        this._session.expires_at = (now.setSeconds(now.getSeconds() + publicCredentials.expires_in));
    }

   async  getUserProfile(accessToken) {
        const resp = await authenticationClient.getUserInfo(accessToken);
        return resp;
    };
}

module.exports = { OAuth };
