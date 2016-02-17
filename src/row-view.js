'use strict';

import ItemView from './item-view';
import jquery from './deps/jquery';
import row from './html/row';

/**
 * The RowView class used to build the view.
 *
 * It's not meant to be used directly.
 */
class RowView {

  /**
   * Creates a new RowView instance.
   */
  constructor() {
    this._cols = [];
  }

  /**
   * Add a new item to the row.
   * @param {object} itemData - The OneDrive item data for this item.
   */
  addCol(itemData = {}) {
    const col = new ItemView(itemData);
    this._cols.push(col);
    return col;
  }

  build() {
    const _row = jquery(row);
    let _element = _row.find('[onedrive-insert-items]');
    if (_element.length === 0) {
      _element = _row;
    }
    for (const col of this._cols) {
      _element.append(col.build());
    }
    return _row;
  }

}

export default RowView;
