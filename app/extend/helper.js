/**
 * Created by Ethan.Du on 21/11/4
 */
'use strict';
const crypto = require('crypto');
const _ = require('lodash');

module.exports = {
  setCookie(cookieValue) {
    const { ctx, config, logger } = this;

    const opt = {
      domain: config.cookieConfig.domain,
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // Unit : second  default Max-Age is one week
      httpOnly: false,
      secure: false,
    };

    let cookieValueToSet;
    try {
      cookieValueToSet = (typeof cookieValue === 'string' ? cookieValue : encryption(JSON.stringify(cookieValue), config.cookieConfig.encryptionKey));
    } catch (error) {
      logger.error(`set cookie error: ${error}`);
    }

    return ctx.cookies.set(config.cookieConfig.name, cookieValueToSet, opt);
  },

  getCookie() {
    const { ctx, config, logger } = this;

    const cookieValueToSet = ctx.cookies.get(config.cookieConfig.name);

    let userCookie = {};
    try {
      userCookie = JSON.parse(decryption(config.cookieConfig.encryptionKey, cookieValueToSet));
    } catch (error) {
      logger.error(`get cookie error: ${error}`);
    }

    return {
      userId: _.isNull(userCookie) || _.isUndefined(userCookie.userId) ? null : userCookie.userId,
      username: _.isNull(userCookie) || _.isUndefined(userCookie.username) ? null : userCookie.username,
      role: _.isNull(userCookie) || _.isUndefined(userCookie.role) ? null : userCookie.role,
      phone: _.isNull(userCookie) || _.isUndefined(userCookie.phone) ? null : userCookie.phone,
      email: _.isNull(userCookie) || _.isUndefined(userCookie.email) ? null : userCookie.email,
    };
  },

  clearCookie() {
    const { ctx, config } = this;

    return ctx.cookies.set(config.cookieConfig.name, null);
  },
};

/**
 * 加密cookie
 * @param {*} data
 * @param {*} encryptionKey
 * @return
 */
function encryption(data, encryptionKey) {
  const alg = 'aes-256-cbc';
  const iv = 'cxZhhYhet2X4OOMq'; // 某些加密算法需要最小长度，当data不足最小长度时的补充字符串
  const clearEncoding = 'utf8';
  const cipherEncoding = 'base64';
  const cipherChunks = [];
  const cipher = crypto.createCipheriv(alg, encryptionKey, iv);
  cipher.setAutoPadding(true);

  cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
  cipherChunks.push(cipher.final(cipherEncoding));

  return cipherChunks.join('');
}

/**
 * 解密cookie
 * @param {*} encryptionKey
 * @param {*} data
 * @return
 */
function decryption(encryptionKey, data) {
  const alg = 'aes-256-cbc';
  const iv = 'cxZhhYhet2X4OOMq';
  const clearEncoding = 'utf8';
  const cipherEncoding = 'base64';
  const cipherChunks = [];
  const decipher = crypto.createDecipheriv(alg, encryptionKey, iv);
  decipher.setAutoPadding(true);

  cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
  cipherChunks.push(decipher.final(clearEncoding));

  return cipherChunks.join('');
}
