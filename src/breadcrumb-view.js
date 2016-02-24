'use strict';

import breadcrumb from './html/breadcrumb';
import BreadcrumbItemView from './breadcrumb-item-view';

const ROOT_ID = 'ROOT';
const SEARCH_ID = 'SEARCH';

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
    this._items = [new BreadcrumbItemView({ id: ROOT_ID, name: 'Home', root: true })];
  }

  /**
   * Add a new item to the breadcrumb.
   * @param {object} itemData - The OneDrive item data for this breadcrumb item.
   * @return {BreadcrumbItemView} The added item.
   */
  addItem(itemData = {}) {
    const item = new BreadcrumbItemView(itemData);
    this._items.push(item);
    return item;
  }

  /**
   * Adds a new item as a search item to the breadcrumb.
   * @param {string} search - The search input submitted by user.
   * @return {BreadcrumbItemView} The added item.
   */
  addSearch(search) {
    const item = new BreadcrumbItemView({ id: SEARCH_ID, name: 'Your search', search });
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

  /**
   * Reinitialize the breadcrumb.
   */
  reinit() {
    this.setCurrent(ROOT_ID);
  }

  build() {
    const _breadcrumb = jQuery(breadcrumb);
    let _element = _breadcrumb.find('[onedrive-insert-breadcrumb-items]');
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
