'use strict';

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
    this._rows = [];
  }

  addRow() {
    const row = new RowView();
    this._rows.push(row);
    return row;
  }

  build() {
    const _picker = jquery(picker);
    let _element = _picker.find('[onedrive-insert-rows]');
    if (_element.length === 0) {
      _element = _picker;
    }
    for (const row of this._rows) {
      _element.append(row.build());
    }
    return _picker;
  }

}

export default PickerView;
