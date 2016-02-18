'use strict';

import jquery from './deps/jquery';
import breadcrumb from './html/breadcrumb';
import BreadcrumbItemView from './breadcrumb-item-view';

/**
 * The BreadcrumbView class used to build the view.
 *
 * It's not meant to be used directly.
 */
class BreadcrumbView {

  /**
   * Creates a new BreadcrumbView instance.
   */
  constructor() {
    this._items = [new BreadcrumbItemView({ id: 'ROOT', name: 'Home' })];
  }

  /**
   * Add a new item to the breadcrumb.
   * @param {object} itemData - The OneDrive item data for this breadcrumb item.
   */
  addItem(itemData = {}) {
    const item = new BreadcrumbItemView(itemData);
    this._items.push(item);
    return item;
  }

  /**
   * Sets the current directory to item owning the input id. Which is equivalent to remove all elements after this one.
   * @param {string} itemId - The item id.
   */
  setCurrent(itemId) {
    const items = this._items;
    this._items = [];
    for (const item of items) {
      this._items.push(item);
      if (item.getId() === itemId) {
        break;
      }
    }
  }

  build() {
    const _breadcrumb = jquery(breadcrumb);
    let _element = _breadcrumb.find('[onedrive-insert-items]');
    if (_element.length === 0) {
      _element = _breadcrumb;
    }
    for (const item of this._items) {
      _element.append(item.build());
    }
    // Mark the last as active
    _element.children('.odfp-breadcrumb-item').last().addClass('odfp-active');
    return _breadcrumb;
  }

}

export default BreadcrumbView;
