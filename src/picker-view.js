'use strict';

import BreadcrumbView from './breadcrumb-view';
import jquery from './deps/jquery';
import picker from './html/picker';
import RowView from './row-view';

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
    this._rows = [];
  }

  /**
   * Adds a row to the picker and return it.
   * @return {RowView} The added row view.
   */
  addRow() {
    const row = new RowView();
    this._rows.push(row);
    return row;
  }

  /**
   * Clears the rows.
   */
  clearRows() {
    this._rows = [];
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
    const _picker = jquery(picker);
    const _insertBreadcrumb = _picker.find('[onedrive-insert-breadcrumb]');
    _insertBreadcrumb.append(this._breadcrumb.build());
    const _insertRows = _picker.find('[onedrive-insert-rows]');
    for (const row of this._rows) {
      _insertRows.append(row.build());
    }
    return _picker;
  }

}

export default PickerView;
