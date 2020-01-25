import { setCookie, parseCookies, destroyCookie } from 'nookies';

/**
 * "Borrowed" from https://github.com/js-cookie/js-cookie/blob/master/src/rfc6265.mjs
 * @param value
 * @returns {string}
 */

function encodeCookie(value) {
  return encodeURIComponent(value).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent);
}

/**
 * @class NextStorage
 */

export default class NextStorage {
  /**
   * Constructs a new NextStorage object
   * @param {object} ctx Next.js ctx object
   * @param {string} domain Cookies domain (required).
   * @param {string} [path] Cookies path (default: '/')
   * @param {number} [expires] Cookie expiration (in days, default: 365)
   * @param {boolean} [secure] Cookie secure flag (default: true)
   */

  constructor(ctx, { domain, path = '/', expires = 365, secure = true }) {
    if (!domain) {
      throw new Error('The domain of cookieStorage can not be undefined.');
    }

    this.ctx = ctx;
    this.domain = domain;
    this.path = path;
    this.expires = expires;
    this.secure = secure;
  }

  /**
   * This is used to set a specific item in storage
   * @param {string} key - the key for the item
   * @param {object} value - the value
   * @returns {string} value that was set
   */

  setItem(key, value) {
    setCookie(this.ctx, key, encodeCookie(value), {
      path: this.path,
      maxAge: this.expires * 86400,
      domain: this.domain,
      secure: this.secure,
    });

    return this.getItem(key);
  }

  /**
   * This is used to get a specific key from storage
   * @param {string} key - the key for the item
   * This is used to clear the storage
   * @returns {string} the data item
   */

  getItem(key) {
    return parseCookies(this.ctx)[key];
  }

  /**
   * This is used to remove an item from storage
   * @param {string} key - the key being set
   * @returns {string} value - value that was deleted
   */

  removeItem(key) {
    const value = this.getItem(key);

    destroyCookie(this.ctx, key, {
      domain: this.domain,
      path: this.path,
      secure: this.secure,
    });

    return value;
  }

  /**
   * This is used to clear the storage
   * @returns {object} nothing
   */

  clear() {
    const cookies = Object.keys(parseCookies(this.ctx));

    cookies.forEach(cookie => destroyCookie(this.ctx, cookie));

    return {};
  }
}