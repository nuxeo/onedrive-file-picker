'use strict';

import item from './html/item';

/**
 * The ItemView class used to build the view.
 *
 * It's not meant to be used directly.
 */
class ItemView {

  /**
   * Creates a new ItemView instance.
   * @param {object} itemData - The OneDrive item data for this item.
   */
  constructor(itemData = {}) {
    this._itemData = itemData;
  }

  build() {
    const _item = jQuery(item);
    _item.addClass('odfp-item');
    _item.data('item', this._itemData);
    _item.find('.odfp-name').append(this._itemData.name);
    const thumbnails = this._itemData.thumbnails;
    if (thumbnails && thumbnails.length > 0) {
      _item.find('.odfp-thumbnail .odfp-picture')
        .attr('style', `background-image: url("${thumbnails[0].medium.url}");`);
      _item.find('.odfp-thumbnail .odfp-icon').hide();
    } else {
      _item.find('.odfp-thumbnail .odfp-picture').hide();
      if (this._itemData.folder) {
        _item.find('.odfp-thumbnail .odfp-icon').addClass('icon-folder-open');
      } else if (this._itemData.video) {
        _item.find('.odfp-thumbnail .odfp-icon').addClass('icon-file-video');
      } else if (this._itemData.audio) {
        _item.find('.odfp-thumbnail .odfp-icon').addClass('icon-file-audio');
      } else if (this._itemData.image || this._itemData.photo) {
        _item.find('.odfp-thumbnail .odfp-icon').addClass('icon-file-image');
      } else {
        _item.find('.odfp-thumbnail .odfp-icon').addClass('icon-doc-text');
      }
    }
    if (this._itemData.folder) {
      _item.data('folder', 'true');
    }
    return _item;
  }

}

export default ItemView;
