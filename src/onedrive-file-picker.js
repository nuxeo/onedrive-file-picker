'use strict';

import Api from './api';
import PickerView from './picker-view';
import extend from 'extend';
import Promise from './deps/promise';

const ONEDRIVE_FILE_PICKER_ID = 'onedrive-file-picker';
const DEFAULT_OPTS = {
  id: ONEDRIVE_FILE_PICKER_ID,
  // For OneDrive for Business put your resource endpoint here: https://{tenant}-my.sharepoint.com/_api/v2.0
  baseURL: 'https://api.onedrive.com/v1.0',
  accessToken: null,
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
    this._id = options.id;
    this._jQuerySelector = `#${this._id}`;
    this._api = new Api({ baseURL: options.baseURL, accessToken: options.accessToken,
      business: opts.baseURL !== DEFAULT_OPTS.baseURL });
    this._picker = new PickerView();
    this.Promise = OneDriveFilePicker.Promise || Promise;
  }

  select() {
    if (jQuery(this._jQuerySelector).length === 0) {
      jQuery('body').append(`<div id="${this._id}"></div>`);
    }
    return this._api.fetchRootChildren().then((res) => {
      jQuery(this._jQuerySelector).replaceWith(this._buildPicker(res.value));
      this._applyHandler();
      const select = new this.Promise((resolve) => {
        jQuery(this._jQuerySelector + ' input.odfp-select').click((event) => {
          if (jQuery(event.currentTarget).hasClass('odfp-active')) {
            const activeItem = jQuery(this._jQuerySelector + ' .odfp-item.odfp-active');
            if (activeItem.data('folder') === 'true') {
              this._api.fetchChildren(activeItem.data('item').id).then((children) => {
                this._replaceItems(children.value);
              });
            } else {
              const activeItemData = activeItem.data('item');
              this.close();
              resolve({ action: 'select', item: activeItemData });
            }
          }
        });
      });
      const close = new this.Promise((resolve) => {
        jQuery(this._jQuerySelector + ' span.odfp-close').click(() => {
          this.close();
          resolve({ action: 'close' });
        });
      });
      return this.Promise.race([select, close]);
    });
  }

  close() {
    jQuery(this._jQuerySelector).hide();
  }

  _buildPicker(items) {
    this._picker.clearItems();
    items.forEach((item) => {
      this._picker.addItem(item);
    });
    return this._picker.build().attr('id', ONEDRIVE_FILE_PICKER_ID);
  }

  /**
   * Applies handler on all items.
   */
  _applyHandler() {
    const items = jQuery(this._jQuerySelector + ' .odfp-item');
    // Navigation
    items.dblclick((event) => {
      const item = jQuery(event.currentTarget);
      if (item.data('folder') === 'true') {
        const itemData = item.data('item');
        this._api.fetchChildren(itemData.id).then((res) => {
          this._picker.addItemToBreadcrumb(itemData);
          this._replaceItems(res.value);
        });
      }
    });
    // Selection
    jQuery(this._jQuerySelector + ' input.odfp-select').removeClass('odfp-active');
    items.click((event) => {
      items.removeClass('odfp-active');
      jQuery(event.currentTarget).addClass('odfp-active');
      jQuery(this._jQuerySelector + ' input.odfp-select').addClass('odfp-active');
    });
    // Breadcrumb
    jQuery(this._jQuerySelector + ' .odfp-breadcrumb .odfp-breadcrumb-item').click((event) => {
      const item = jQuery(event.currentTarget);
      if (!item.hasClass('odfp-active')) {
        const itemData = item.data('item');
        const itemId = itemData.id;
        let promise;
        if (itemData.root) {
          promise = this._api.fetchRootChildren();
        } else if (itemData.search) {
          promise = this._api.search(itemData.search);
        } else {
          promise = this._api.fetchChildren(itemId);
        }
        promise.then((res) => {
          this._picker.setBreadcrumbTo(itemId);
          this._replaceItems(res.value);
        });
      }
    });
    // Search
    const searchInputId = this._jQuerySelector + ' .odfp-search .odfp-search-input';
    const submitInputId = this._jQuerySelector + ' .odfp-search .odfp-search-submit';
    jQuery(searchInputId).keypress((event) => {
      if (event.which === 13) {
        event.preventDefault();
        jQuery(submitInputId).click();
      }
    });
    jQuery(submitInputId).click(() => {
      const search = jQuery(searchInputId).val();
      this._api.search(search).then((res) => {
        this._picker.reinitBreadcrumb();
        this._picker.addSearchToBreadcrumb(search);
        this._replaceItems(res.value);
      });
    });
  }

  /**
   * Replaces items in the dom and applies the handlers.
   */
  _replaceItems(items) {
    const content = this._buildPicker(items).find('.odfp-content');
    jQuery(this._jQuerySelector + ' .odfp-content').replaceWith(content);
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
