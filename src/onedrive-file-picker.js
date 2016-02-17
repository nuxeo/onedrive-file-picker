'use strict';

import Api from './api';
import PickerView from './picker-view';
import extend from 'extend';
import jquery from './deps/jquery';
import Promise from './deps/promise';

const DEFAULT_OPTS = {
  // For OneDrive for Business put your resource endpoint here: https://{tenant}-my.sharepoint.com/_api/v2.0
  baseURL: 'https://api.onedrive.com/v1.0',
  accessToken: null,
  promiseLibrary: null,
};

const ONEDRIVE_FILE_PICKER_ID = 'onedrive-file-picker';
const JQUERY_PICKER_SELECTOR = '#' + ONEDRIVE_FILE_PICKER_ID;

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
    jquery(JQUERY_PICKER_SELECTOR).remove();
    return this._api.fetchRootChildren().then((res) => {
      this._buildPicker(res.value).appendTo(jquery('body'));
      this._applyHandler();
      return new this.Promise((resolve) => {
        jquery(JQUERY_PICKER_SELECTOR + ' input.select').click(() => {
          const activeItem = jquery(JQUERY_PICKER_SELECTOR + ' .item.active');
          if (activeItem.data('folder') === 'true') {
            this._api.fetchChildren(activeItem.data('item').id).then((children) => {
              this._replaceItems(children.value);
            });
          } else {
            resolve({ action: 'itemSelected', item: activeItem.data('item') });
          }
        });
      });
    });
  }

  _buildPicker(items) {
    const picker = new PickerView();
    const nbItem = items.length;
    let row;
    for (let i = 0; i < nbItem; i++) {
      if (i % 5 === 0) {
        row = picker.addRow();
      }
      row.addCol(items[i]);
    }
    return picker.build().attr('id', ONEDRIVE_FILE_PICKER_ID);
  }

  /**
   * Applies handler on all items.
   */
  _applyHandler() {
    const items = jquery(JQUERY_PICKER_SELECTOR + ' .item');
    // Navigation
    items.dblclick((event) => {
      const itemId = jquery(event.currentTarget).data('item').id;
      this._api.fetchChildren(itemId).then((res) => {
        this._replaceItems(res.value);
      });
    });
    // Selection
    items.click((event) => {
      items.removeClass('active');
      jquery(event.currentTarget).addClass('active');
    });
  }

  /**
   * Replaces items in the dom and applies the handlers.
   */
  _replaceItems(items) {
    const rows = this._buildPicker(items).find('[onedrive-insert-rows]');
    jquery(JQUERY_PICKER_SELECTOR + ' [onedrive-insert-rows]').replaceWith(rows);
    this._applyHandler();
  }

}

/**
 * Sets the Promise library class to use.
 */
OneDriveFilePicker.promiseLibrary = (promiseLibrary) => {
  OneDriveFilePicker.Promise = promiseLibrary;
};

export default OneDriveFilePicker;
