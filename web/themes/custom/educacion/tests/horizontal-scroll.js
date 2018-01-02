(function ($, Drupal) {
    Drupal.horizontalScroll = function (selector) {
        var _this = this;
        this.handler = false, this.semaphore = false;
        this.selector = selector;
        this.el = $(selector);
        var child = this.el.find(selector + '__item').get(0);
        this.itemWidth = $(child).outerWidth();
        this.el.scroll(function () {
            _this.adjustToItem();
        });
        $(selector + '__next').click(function () {
            _this.move(1);
            $(this).blur();
        });
        $(selector + '__prev').click(function () {
            _this.move(-1);
            $(this).blur();
        });
    };

    Drupal.horizontalScroll.prototype.adjustToItem = function () {
        if (this.semaphore) return;
        if (this.handler) clearTimeout(this.handler);
        var offset = this.el.scrollLeft();
        var newPos = (offset % this.itemWidth < this.itemWidth / 2) ? Math.floor(offset / this.itemWidth) * this.itemWidth : Math.ceil(offset / this.itemWidth) * this.itemWidth;
        this.scrollTo(newPos);
    };


    Drupal.horizontalScroll.prototype.move = function (direction) {
        if (!direction) direction = 1;
        if (this.semaphore) return;
        if (this.handler) clearTimeout(this.handler);
        var offset = this.el.scrollLeft();
        var newPos = offset + direction * Math.round(this.el.outerWidth() / this.itemWidth) * this.itemWidth;
        this.scrollTo(newPos);
    };

    Drupal.horizontalScroll.prototype.scrollTo = function (newPos) {
        var _this = this;
        this.handler = setTimeout(function () {
            _this.el.animate({
                scrollLeft: newPos
            }, 200);
            _this.setSemaphore();
        }, 100);
    }


    Drupal.horizontalScroll.prototype.setSemaphore = function () {
        var _this = this;
        this.semaphore = true;
        setTimeout(function () {
            _this.semaphore = false;
        }, 200);
    };
})
(jQuery, Drupal);