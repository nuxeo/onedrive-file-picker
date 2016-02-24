'use strict';

import BreadcrumbView from './breadcrumb-view';
import ItemView from './item-view';
import picker from './html/picker';

/**
 * The PickerView class used to build the view.
 *
 * It's not meant to be used directly.
 */
class PickerView {

  /**
   * Creates a new PickerView instance.
   */
  constructor() {
    this._breadcrumb = new BreadcrumbView();
    this._items = [];
  }

  /**
   * Add a new item to the grid.
   * @param {object} itemData - The OneDrive item data for this item.
   */
  addItem(itemData = {}) {
    const item = new ItemView(itemData);
    this._items.push(item);
    return item;
  }

  /**
   * Clears the items.
   */
  clearItems() {
    this._items = [];
  }

  /**
   * Adds an item to the breadcrumb.
   * @param {object} itemData - The item data.
   */
  addItemToBreadcrumb(itemData) {
    this._breadcrumb.addItem(itemData);
  }

  /**
   * Adds a search item to the breadcrumb.
   * @param {string} search - The search request.
   */
  addSearchToBreadcrumb(search) {
    this._breadcrumb.addSearch(search);
  }

  /**
   * Sets the current directory to the item owning the input id.
   * @param {string} itemId - The item id to set as current directory.
   */
  setBreadcrumbTo(itemId) {
    this._breadcrumb.setCurrent(itemId);
  }

  /**
   * Reinitialize the breadcrumb.
   */
  reinitBreadcrumb() {
    this._breadcrumb.reinit();
  }

  /**
   * Builds the picker.
   */
  build() {
    const _picker = jQuery(picker);
    const _insertBreadcrumb = _picker.find('[onedrive-insert-breadcrumb]');
    _insertBreadcrumb.append(this._breadcrumb.build());
    const _insertItems = _picker.find('[onedrive-insert-items]');
    for (const item of this._items) {
      _insertItems.append(item.build());
    }
    return _picker;
  }

}

export default PickerView;
