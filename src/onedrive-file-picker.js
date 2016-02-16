'use strict';

import extend from 'extend';
import Promise from './deps/promise';
import Api from './api';

const DEFAULT_OPTS = {
  // For OneDrive for Business put your resource endpoint here: https://{tenant}-my.sharepoint.com/_api/v2.0
  baseURL: 'https://api.onedrive.com/v1.0',
  accessToken: null,
  promiseLibrary: null,
};

class OneDriveFilePicker {

  /**
   * Creates a new OneDriveFilePicker instance.
   * @param {object} opts - The configuration options.
   * @param {string} [opts.baseURL=https://api.onedrive.com/v1.0] - Base URL of OneDrive REST APIs.
   * @param {string} [opts.accessToken=YOUR_ACCESS_TOKEN] - The access token to use.
   */
  constructor(opts = {}) {
    const options = extend(true, {}, DEFAULT_OPTS, opts);
    this._api = new Api({ baseURL: options.baseURL, accessToken: options.accessToken });
    this.Promise = OneDriveFilePicker.Promise || Promise;
  }

  select() {
    this._api.fetchRoot().then((res) => { console.log(res); });
  }

}

/**
 * Sets the Promise library class to use.
 */
OneDriveFilePicker.promiseLibrary = (promiseLibrary) => {
  OneDriveFilePicker.Promise = promiseLibrary;
};

export default OneDriveFilePicker;
