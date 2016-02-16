'use strict';

import jquery from './deps/jquery';
import Promise from './deps/promise';

/**
 * The Api class used to fetch information for OneDrive REST APIs.
 *
 * It's not meant to be used directly.
 */
class Api {

  /**
   * Creates a new OneDriveFilePicker instance.
   * @param {object} options - The configuration options.
   * @param {string} [options.baseURL=https://api.onedrive.com/v1.0] - Base URL of OneDrive REST APIs.
   * @param {string} [options.accessToken=YOUR_ACCESS_TOKEN] - The access token to use.
   */
  constructor(options) {
    this._baseURL = options.baseURL;
    this._accessToken = options.accessToken;
  }

  fetchRoot() {
    return this._fetch('/drive/root');
  }

  fetchChildren(itemId) {
    return this._fetch('/drive/item/' + itemId + '/children');
  }

  _fetch(path) {
    return new Promise((resolve, reject) => {
      jquery.ajax({
        url: this._baseURL + path,
        type: 'GET',
        beforeSend: (xhr) => {xhr.setRequestHeader('Authorization', 'bearer ' + this._accessToken);},
        success: (data) => { resolve(data); },
        error: (jqXHR, textStatus, errorThrown) => { reject(errorThrown); },
      });
    });
  }

}

export default Api;
