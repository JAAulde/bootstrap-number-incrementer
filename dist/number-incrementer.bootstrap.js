/* jslint */

/**
 * @file A jQuery/Boostrap based widget for use on text and number inputs to
 *       turn them into Bootstrap input groups with plus and minus buttons for
 *       incrementing and decrementing the input's numeric value.
 * @version 1.0.0
 * @copyright Jim Auldridge <auldridgej@gmail.com> 2016
 * @license MIT
 * @see {@link https://github.com/JAAulde/bootstrap-number-incrementer|GitHub Repository}
 * @see {@link http://getbootstrap.com/|Bootstrap}
 * @see {@link https://jquery.com/|jQuery}
 */
(function (context) {
    'use strict';

    var parseInt = context.parseInt,
        $ = context.jQuery,
        template_manager = context.template_manager,
        jQProp = $.fn.prop,
        jQAttr = $.fn.attr,
        defaults = {
            width_factor: 'dynamic', // 'range', 'dynamic', ALL OTHER,
            wrapper_class: null,
            input_class: null,
            incrementer_class: null,
            decrementer_class: null
        },
        consts = {
            CLASS_NAME_INPUT: 'bs-number-incremented',
            CLASS_NAME_WRAPPER: 'bs-number-incrementer',
            NAMESPACE_EVENTS: 'bs-number-incrementer',
            DATA_PROPERTY_WIDGET_DATA: 'widgetData'
        },
        getWrapper = function () {
            if (!getWrapper.$) {
                getWrapper.$ = $(template_manager.get('partials/wrapper.html'));
            }

            return getWrapper.$.clone();
        },
        setWrapperWidth = function (wrapper) {
            var input = wrapper.find('input.' + consts.CLASS_NAME_INPUT),
                options = input.data(consts.DATA_PROPERTY_WIDGET_DATA).options,
                min,
                max,
                len;

            switch (options.width_factor) {
            case 'range':
                min = (input.attr('min') || '').length;
                max = (input.attr('max') || '').length;
                len = (min > max ? min : max) * 0.75;

                wrapper.width((7 + (len || 1)) + 'em');
                break;

            case 'dynamic':
                len = ((input.val() || '').length || 1);

                wrapper.width((7 + len) + 'em');
                break;

            //default
            //  style it yourself externally
            }
        },
        buttonEnablement = function (input) {
            var val = parseInt(input.val(), 10),
                min,
                max,
                disable_selectors = [],
                buttons;

            if (!isNaN(val)) {
                min = parseInt(input.attr('min'), 10);

                if (!isNaN(min) && val <= min) {
                    disable_selectors.push('[data-operation="decrement"]');
                }

                max = parseInt(input.attr('max'), 10);

                if (!isNaN(max) && val >= max) {
                    disable_selectors.push('[data-operation="increment"]');
                }
            }

            buttons = input.closest('div.' + consts.CLASS_NAME_WRAPPER).find('button')
                .prop('disabled', false);

            if (disable_selectors.length) {
                buttons.filter(disable_selectors.join(', '))
                    .prop('disabled', true);
            }
        };

    $.fn.prop = function () {
        var args = arguments;

        if (args.length === 2 && args[0] === 'disabled') {
            this.filter('input.' + consts.CLASS_NAME_INPUT).each(function () {
                var input = $(this);

                if (args[1] === true) {
                    jQProp.apply(input.closest('div.' + consts.CLASS_NAME_WRAPPER).find('button'), args);
                } else {
                    buttonEnablement(input);
                }
            });
        }

        return jQProp.apply(this, args);
    };

    $.fn.attr = function () {
        var args = arguments,
            return_value = jQAttr.apply(this, args);

        if (args.length === 2 && (['min', 'max']).indexOf(args[0]) > -1) {
            this.filter('input.' + consts.CLASS_NAME_INPUT).each(function () {
                var input = $(this),
                    widgetData = input.data(consts.DATA_PROPERTY_WIDGET_DATA);

                buttonEnablement(input);

                if (widgetData.options.width_factor === 'range') {
                    setWrapperWidth(input.closest('div.' + consts.CLASS_NAME_WRAPPER));
                }
            });
        }

        return return_value;
    };

    $.fn.numberIncrementer = function (opts) {
        switch (opts) {
        case 'increment':
            this.filter('input.' + consts.CLASS_NAME_INPUT).each(function () {
                var input = $(this),
                    value,
                    min_value,
                    max_value;

                if (!input.prop('disabled')) {
                    value = parseInt(input.val(), 10);
                    if (isNaN(value)) {
                        value = 0;
                    }

                    min_value = parseInt(input.attr('min'), 10);
                    if (!isNaN(min_value) && min_value > value) {
                        input.val(min_value).trigger('change');
                    } else {
                        max_value = parseInt(input.attr('max'), 10);
                        if (isNaN(max_value) || value < max_value) {
                            input.val(value + 1).trigger('change');
                        }
                    }
                }
            });
            break;

        case 'decrement':
            this.filter('input.' + consts.CLASS_NAME_INPUT).each(function () {
                var input = $(this),
                    value,
                    max_value,
                    min_value;

                if (!input.prop('disabled')) {
                    value = parseInt(input.val(), 10);
                    if (isNaN(value)) {
                        value = 0;
                    }

                    max_value = parseInt(input.attr('max'), 10);
                    if (!isNaN(max_value) && value > max_value) {
                        input.val(max_value).trigger('change');
                    } else {
                        min_value = parseInt(input.attr('min'), 10);
                        if (isNaN(min_value) || min_value < value) {
                            input.val(value - 1).trigger('change');
                        }
                    }
                }
            });
            break;

        case 'destroy':
            this.filter('input.' + consts.CLASS_NAME_INPUT).each(function () {
                var input = $(this),
                    widgetData = input.data(consts.DATA_PROPERTY_WIDGET_DATA),
                    options = widgetData.options,
                    $m,
                    p;

                input.closest('div.' + consts.CLASS_NAME_WRAPPER).replaceWith(input);

                for ($m in widgetData.originals) {
                    if (Object.prototype.hasOwnProperty.call(widgetData.originals, $m)) {
                        for (p in widgetData.originals[$m]) {
                            if (Object.prototype.hasOwnProperty.call(widgetData.originals[$m], p)) {
                                input[$m](p, widgetData.originals[$m][p]);
                            }
                        }
                    }
                }

                if (options.input_class) {
                    input.removeClass(options.input_class);
                }

                input
                    .off('change.' + consts.NAMESPACE_EVENTS)
                    .removeData(consts.DATA_PROPERTY_WIDGET_DATA)
                    .removeClass(consts.CLASS_NAME_INPUT);
            });
            break;
        default:
            var options = $.extend({}, defaults, (opts || {}));

            this.filter('input[type="text"], input[type="number"]').not('.' + consts.CLASS_NAME_INPUT)
                .each(function () {
                    var input = $(this),
                        wrapper = getWrapper(),
                        buttons,
                        widgetData = {
                            originals: {
                                attr: {
                                    type: input.attr('type')
                                },
                                css: {
                                    "text-align": (input.css('text-align') || 'start')
                                }
                            },
                            options: options
                        };

                    input.replaceWith(wrapper);

                    wrapper.find('span.bs-number-incremented-target:first').replaceWith(input);

                    input
                        .prop('disabled', input.prop('disabled'))
                        .attr('type', 'text')
                        .css('text-align', (options.width_factor === 'dynamic' ? 'center' : 'right'))
                        .addClass(consts.CLASS_NAME_INPUT)
                        .on('change.' + consts.NAMESPACE_EVENTS, function () {
                            if (input.data(consts.DATA_PROPERTY_WIDGET_DATA).options.width_factor === 'dynamic') {
                                setWrapperWidth(input.closest('div.' + consts.CLASS_NAME_WRAPPER));
                            }

                            buttonEnablement(input);
                        })
                        .data(consts.DATA_PROPERTY_WIDGET_DATA, widgetData);

                    buttonEnablement(input);

                    setWrapperWidth(wrapper);

                    buttons = wrapper.find('button[data-operation]')
                        .on('click', function () {
                            var operation = $(this).data('operation');

                            if ((['increment', 'decrement']).indexOf(operation) >= 0) {
                                input.numberIncrementer(operation);
                            }
                        });

                    if (options.input_class) {
                        input.addClass(options.input_class);
                    }

                    if (options.wrapper_class) {
                        wrapper.addClass(options.wrapper_class);
                    }

                    if (options.incrementer_class) {
                        buttons.filter('[data-operation="increment"]')
                            .addClass(options.incrementer_class);
                    }

                    if (options.decrementer_class) {
                        buttons.filter('[data-operation="decrement"]')
                            .addClass(options.decrementer_class);
                    }
                });
            break;
        }

        return this;
    };
}(this));
(function(){
	template_manager.cache('partials/wrapper.html','<div class="bs-number-incrementer"><div class="input-group"><span class="input-group-btn"><button type="button" class="btn btn-default" data-operation="decrement"><span class="glyphicon glyphicon-minus"></span></button> </span><span class="bs-number-incremented-target"></span> <span class="input-group-btn"><button type="button" class="btn btn-default" data-operation="increment"><span class="glyphicon glyphicon-plus"></span></button></span></div></div>');
})();