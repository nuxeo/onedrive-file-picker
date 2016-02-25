'use strict';

import Promise from './deps/promise';

/**
 * The Api class used to fetch information for OneDrive REST APIs.
 *
 * It's not meant to be used directly.
 */
class Api {

  /**
   * Creates a new Api instance.
   * @param {object} options - The configuration options.
   * @param {string} [options.baseURL=https://api.onedrive.com/v1.0] - Base URL of OneDrive REST APIs.
   * @param {string} [options.accessToken=YOUR_ACCESS_TOKEN] - The access token to use.
   */
  constructor(options) {
    this._baseURL = options.baseURL;
    this._accessToken = options.accessToken;
    this._business = options.business;
  }

  fetchRootChildren() {
    return this._fetch('/drive/root/children' + (this._business ? '' : '?expand=thumbnails'));
  }

  fetchChildren(itemId) {
    return this._fetch(`/drive/items/${itemId}/children` + (this._business ? '' : '?expand=thumbnails'));
  }

  search(search) {
    return this._fetch('/drive/root/view.search?q=' + encodeURI(search) + (this._business ? '' : '&expand=thumbnails'));
  }

  _fetch(path) {
    return new Promise((resolve, reject) => {
      jQuery.ajax({
        url: this._baseURL + path,
        type: 'GET',
        beforeSend: (xhr) => {xhr.setRequestHeader('Authorization', 'Bearer ' + this._accessToken);},
        success: (data) => { resolve(data); },
        error: (jqXHR, textStatus, errorThrown) => { reject(errorThrown); },
      });
    });
  }

}

export default Api;
