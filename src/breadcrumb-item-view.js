'use strict';

import breadcrumItem from './html/breadcrumb-item';

/**
 * The BreadcrumbItemView class used to build the view.
 *
 * It's not meant to be used directly.
 */
class BreadcrumbItemView {

  /**
   * Creates a new BreadcrumbItemView instance.
   * @param {object} itemData - The OneDrive item data for this item.
   */
  constructor(itemData = {}) {
    this._itemData = itemData;
  }

  /**
   * Gets the id of item.
   * @return {string} Item id.
   */
  getId() {
    return this._itemData.id;
  }

  build() {
    const _item = jQuery(breadcrumItem);
    _item.data('item', this._itemData);
    _item.find('a').html(this._itemData.name);
    return _item;
  }

}

export default BreadcrumbItemView;
