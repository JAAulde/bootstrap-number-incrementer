(function (context) {
    'use strict';

    var parseInt = context.parseInt,
        $ = context.jQuery,
        template_manager = context.template_manager,
        baseFontSize = parseFloat($('body').css('font-size'), 10),
        jQProp = $.fn.prop,
        jQAttr = $.fn.attr,
        getWrapper = function () {
            if (!getWrapper.$) {
                getWrapper.$ = $(template_manager.get('partials/wrapper.html'));
            }

            return getWrapper.$.clone();
        },
        setWrapperWidth = function (wrapper) {
            var input = wrapper.find('input.bs-number-incremented'),
                options = input.data('widgetData').options,
                min,
                max,
                len;

            switch (options.width_factor) {
            case 'range':
                    min = (input.attr('min') || '').length;
                    max = (input.attr('max') || '').length;
                    len = ((min > max ? min : max) || 1);

                    wrapper.width((7 + len) + 'em');
                break;

            case 'dynamic':
                len = ((input.val() || '').length || 1);

                wrapper.width((7 + len) + 'em');
                break;
            }
        },
        defaults = {
            width_factor: 'range' // 'range', 'dynamic', ALL OTHER
        };

    $.fn.prop = function () {
        var args = arguments;

        if (args.length === 2 && args[0] === 'disabled') {
            this.filter('input.bs-number-incremented').each(function () {
                var input = $(this);
                $.fn.prop.apply(input.closest('div.bs-number-incrementer').find('button'), args);
            });
        }

        return jQProp.apply(this, args);
    };

    $.fn.attr = function () {
        var args = arguments,
            return_value = jQAttr.apply(this, args);

        if (args.length === 2 && (['min', 'max']).indexOf(args[0]) > -1) {
            this.filter('input.bs-number-incremented').each(function () {
                var input = $(this);
                setWrapperWidth(input.closest('div.bs-number-incrementer'));
            });
        }

        return return_value;
    }

    $.fn.numberIncrementer = function (opts) {
        switch (opts) {
        case 'increment':
            this.filter('input.bs-number-incremented').each(function () {
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
            this.filter('input.bs-number-incremented').each(function () {
                var input = $(this),
                    value,
                    max_value,
                    min_value;

                if (!input.prop('disabled')) {
                    value = parseInt(input.val(), 10);
                    if (isNaN(value)) {
                        value = 0
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
            this.filter('input.bs-number-incremented').each(function () {
                var input = $(this),
                    widgetData = input.data('widgetData');

                input.closest('div.bs-number-incrementer').replaceWith(input);

                input
                    .off('change.bs-number-incrementer')
                    .removeClass('bs-number-incremented')
                    .attr('type', widgetData.original_type)
                    .removeData('widgetData')
            });
            break;
        default:
            var options = $.extend({}, defaults, (opts || {}));

            this.filter('input[type="text"], input[type="number"]')
                .not('.bs-number-incremented')
                    .each(function () {
                        var input = $(this),
                            wrapper = getWrapper(),
                            widgetData = {
                                original_type: input.attr('type'),
                                options: options
                            };

                        input.replaceWith(wrapper);

                        wrapper.find('span.bs-number-incremented-target:first').replaceWith(input);

                        input
                            .prop('disabled', input.prop('disabled'))
                            .data('widgetData', widgetData)
                            .attr('type', 'text')
                            .addClass('bs-number-incremented')
                            .on('change.bs-number-incrementer', function () {
                                if (input.data('widgetData').options.width_factor === 'dynamic') {
                                    setWrapperWidth(input.closest('div.bs-number-incrementer'));
                                }
                            });

                        setWrapperWidth(wrapper);

                        wrapper.find('button[data-operation]')
                            .on('click', function () {
                                var operation = $(this).data('operation');

                                if ((['increment', 'decrement']).indexOf(operation) >= 0) {
                                    input.numberIncrementer(operation);
                                }
                            });
                    });
            break;
        }

        return this;
    };
}(this));