var mobile = false,
mobileFunction = function () {
    if (mobile){
        $('.header-phones').appendTo('.header-phones-mobile');
        $('.nav-cart').appendTo('header');
        $('.car-search').appendTo('.nav-menu');
    } else {
        $('.header-phones').appendTo('header');
        $('.nav-cart').appendTo('.nav-menu-cart');
        $('.car-search').appendTo('.col-search');
    }
};
$(document).ready(function() {
    $(window).resize(function () {
        if (($(window).width()<1200) && !mobile){
            mobile = true;
            mobileFunction();
        } else if (($(window).width()>=1200) && mobile){
            mobile = false;
            mobileFunction();
        }
        var footer = $('.wrap').height() - $('footer').position().top - $('footer').outerHeight(true) - 30;
        if ( footer > 0  ){
            if (!$('.footer-nailed').length)
                $('<div class="footer-nailed">').insertBefore('footer');
            $('.footer-nailed').css('minHeight', footer);
        }
    }).trigger('resize');

    $('.nav-menu-mobile').on('click', '.nav-menu-mobile-1 .search-button', function (e){
        e.preventDefault();
        $('.car-search').show();
        $('.uk-search-input').focus().blur(function () {
            $('.car-search').hide();
        });
    });

    $('.catalog-list-count').on('click', '.catalog-list-count-minus', function (){
        input = $(this).closest('.catalog-list-count').find('.uk-input');
        val = parseInt(input.val(), 10);
        if (val>0)
            input.val( val-1 );
    }).on('click', '.catalog-list-count-plus', function (){
        input = $(this).closest('.catalog-list-count').find('.uk-input');
        val = parseInt(input.val(), 10);
        input.val( val+1 );
    });

    $('.catalog-list-korzina').on('click', '.uk-close', function (){
        if (confirm('Убрать из корзины?'))
            $(this).closest('.uk-card').remove();
    });
});


/*! numbered v1.0.6 | pavel-yagodin | MIT License | https://github.com/CSSSR/jquery.numbered */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Numbered = factory();
    }
}(this, function () {
    'use strict';

    var defaults = {
        mask: '+7 (###) ### - ## - ##',
        numbered: '#',
        empty: '_',
        placeholder: false
    };

    var Numbered = function (target, params) {
        var self = this;

        if (typeof target !== 'object') {
            self.inputs = document.querySelectorAll(target);
        } else if (typeof target.length !== 'undefined') {
            self.inputs = target;
        } else {
            self.inputs = [target];
        }
        self.inputs = Array.prototype.slice.call(self.inputs);

        params = params || (typeof self.inputs[0].numbered !== 'undefined' ? self.inputs[0].numbered.params : {});

        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
        }

        self.params = params;
        self.config = {};

        self.config.placeholder = self.params.mask.replace(new RegExp(self.params.numbered, 'g'), self.params.empty);
        self.config.numbered    = self.params.numbered.replace(/([()[\]\.^\#$|?+-])/g, '\\\\$1');
        self.config.numberedCol = self.params.mask.split(self.params.numbered).length -1;
        self.config.empty       = self.params.empty.replace(/([()[\]\.^\#$|?+-])/g, '\\$1');
        self.config.mask        = self.params.mask.replace(/([()[\]\.^\#$|?+-])/g, '\\$1').replace(new RegExp(self.config.numbered, 'g'), '(\\d)');
        self.config.maskNums    = self.params.mask.replace(/[^\d]/gi, '').split('');
        self.config.maskNumsCol = self.config.maskNums.length;
        self.config.regexp      = new RegExp('^' + self.config.mask + '$');
        self.config.events      = ['input', 'change', 'click', 'focusin', 'blur'];

        // console.log(self.config);


        self._eventFire = function(el, etype){
            if (el.fireEvent) {
                el.fireEvent('on' + etype);
            } else {
                var evObj = document.createEvent('Events');
                evObj.initEvent(etype, true, false);
                el.dispatchEvent(evObj);
            }
        };

        self._getSelectionRange = function (oElm) {
            var r = { text: '', start: 0, end: 0, length: 0 };
            if (oElm.setSelectionRange) {
                r.start= oElm.selectionStart;
                r.end = oElm.selectionEnd;
                r.text = (r.start != r.end) ? oElm.value.substring(r.start, r.end): '';
            } else if (document.selection) {
                var oR;
                if (oElm.tagName && oElm.tagName === 'TEXTAREA') {
                    var oS = document.selection.createRange().duplicate();
                    oR = oElm.createTextRange();
                    var sB = oS.getBookmark();
                    oR.moveToBookmark(sB);
                } else {
                    oR = document.selection.createRange().duplicate();
                }

                r.text = oR.text;
                for (; oR.moveStart('character', -1) !== 0; r.start++);
                r.end = r.text.length + r.start;
            }
            r.length = r.text.length;
            return r;
        };


        self.magic = function (event) {
            var numbered = this.numbered;
            var value = numbered.input.value || ' ';
            var valueFormatted = value.replace(/[^\d]/gi, '').split('').join('');
            var valueFormattedArr = valueFormatted.split('');
            var valueFormattedCol = valueFormattedArr.length;
            var valueFormattedIndex = 0;
            var positionStart = -1;
            var positionEnd = -1;
            var positionOld = self._getSelectionRange(numbered.input);
            var maskNumsIndex = 0;
            var valueFormattedRes = [];
            var maskSplit = numbered.params.mask.split('');
            // console.log(valueFormatted);

            for (var key in maskSplit) {
                var val = maskSplit[key];
                key = parseInt(key);
                if (maskNumsIndex <= numbered.config.maskNumsCol && val == numbered.config.maskNums[maskNumsIndex] && val == valueFormattedArr[valueFormattedIndex]) {
                    valueFormattedRes.push(val);
                    maskNumsIndex++;
                    valueFormattedIndex++;
                } else if(val == numbered.params.numbered) {
                    if (positionStart < 0) {
                        positionStart = key;
                    }
                    if(valueFormattedIndex < valueFormattedCol) {
                        valueFormattedRes.push(valueFormattedArr[valueFormattedIndex]);
                        valueFormattedIndex++;
                        positionEnd = key;
                    } else {
                        valueFormattedRes.push(numbered.params.empty);
                    }
                } else {
                    valueFormattedRes.push(val);
                }
            }
            value = valueFormattedRes.join('');

            var position = (positionEnd >= 0 ? positionEnd + 1 : positionStart);
            if (event.type !== 'click') {
                if ((event.type === 'blur' || event.type === 'change') && valueFormattedIndex - maskNumsIndex === 0 && !numbered.params.placeholder) {
                    this.value = '';
                } else if (numbered.oldValue !== numbered.input.value || event.type === 'focusin') {
                    this.value = value;
                }
            }

            if(event.type !== 'change' && event.type !== 'blur' && (event.type !== 'click' || (numbered.lastEvent === 'focusin' && event.type === 'click'))) {
                if (numbered.input.setSelectionRange) {
                    numbered.input.setSelectionRange(position, position);
                } else if (numbered.input.createTextRange) {
                    var range = numbered.input.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', position);
                    range.moveStart('character', position);
                    range.select();
                }
            }

            numbered.oldValue = this.value;
            numbered.lastEvent = event.type;
            return event.target;
        };

        for (var index in self.inputs) {
            var $input = self.inputs[index];
            var is = false;
            if (typeof $input.numbered === 'оbject' || typeof $input.numbered !== 'undefined') {
                is = true;
            }
            $input.numbered = {
                input: self.inputs[index],
                config: self.config,
                params: self.params,
                oldValue: false
            };

            if (!is) {
                for (var key in self.config.events) {
                    $input.addEventListener(self.config.events[key], self.magic);
                }
                self._eventFire($input, 'blur');
            }
            self.inputs[index] = $input;
        }

        self.destroy = function () {
            var self = this;
            for (var index in self.inputs) {
                var $input = self.inputs[index];

                for (var key in self.config.events) {
                    $input.removeEventListener(self.config.events[key], self.magic);
                    $input.numbered = null;
                }
            }
            return null;
        };

        self.validate = function (i) {
            var input = i || false;
            var self = this;
            var res = self.inputs.length > 1 ? [] : false;
            var inputs = input !== false ? [input] : self.inputs;
            for (var index in inputs) {
                var $input = inputs[index];
                var validate;

                if (inputs[index].numbered.config.regexp.test(inputs[index].numbered.input.value)) {
                    validate = 1;
                } else if (inputs[index].numbered.input.value === '' || inputs[index].numbered.input.value === inputs[index].numbered.config.placeholder) {
                    validate = 0;
                } else {
                    validate = -1;
                }

                if (inputs.length > 1) {
                    res.push(validate);
                } else {
                    res = validate;
                }
            }
            return res;
        };

        self.reInit = function () {
            var self = this;
            var res = self.inputs.length > 1 ? [] : false;
            for (var index in self.inputs) {
                var $input = self.inputs[index];
                self._eventFire($input, 'blur');
            }
            return res;
        };

        self.setVal = function (value) {
            var self = this;
            var res = self.inputs.length > 1 ? [] : false;
            for (var index in self.inputs) {
                var $input = self.inputs[index];
                $input.value = value;
                self._eventFire($input, 'blur');
            }
            return res;
        };

        self.getVal = function (r) {
            var raw = r || false;
            var values = [];
            for (var index in this.inputs) {
                var $input = this.inputs[index];
                var value = $input.value;

                if (raw) {
                    if (this.validate($input) > 0) {
                        var arr = value.match(this.config.regexp);
                        value = arr.slice(1, arr.length).join('');
                    } else {
                        value = $input.value.replace(/[^\d]/gi, '');
                    }
                }
                values.push(value);
            }
            return values.length>1?values:values[0];
        };

        return self;
    };

    return Numbered;
}));

var numberedPhone = new Numbered('.phone');