(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global.jqueryI18next = factory());
}(this, (function () {
    'use strict';

    var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

    var defaults = {
        tName: 't',
        i18nName: 'i18n',
        handleName: 'localize',
        selectorAttr: 'data-i18n',
        targetAttr: 'i18n-target',
        optionsAttr: 'i18n-options',
        useOptionsAttr: false,
        parseDefaultValueFromContent: true,
        childrenRegx: '\\$c\\((.+?)\\)'//保留子级的标签的嵌套模式-修改自Jquery-i18next
    };



    function init(i18next, $) {

        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

        options = _extends({}, defaults, options);

        function parse(ele, key, opts) {
            if (key.length === 0) return;

            var attr = 'text';

            if (key.indexOf('[') === 0) {
                var parts = key.split(']');
                key = parts[1];
                attr = parts[0].substr(1, parts[0].length - 1);
            }

            if (key.indexOf(';') === key.length - 1) {
                key = key.substr(0, key.length - 2);
            }

            function extendDefault(o, val) {
                if (!options.parseDefaultValueFromContent) return o;
                return _extends({}, o, { defaultValue: val });
            }

            var defaultHtmlNode = extendDefault(opts, ele.html());
            var defaultHtml = "<div>" + defaultHtmlNode.defaultValue.toString() + "</div>";
            var elements = $(defaultHtml).children('[' + options.selectorAttr + ']');
            
            if ($(defaultHtml).children('[' + options.selectorAttr + ']').length>0) {
                //保留子级的标签的嵌套模式-修改自Jquery-i18next
                var translated = i18next.t(key, defaultHtmlNode);
                var match = void 0;
                var childrenRegexp = new RegExp(options.childrenRegx, 'g');
                while (match = childrenRegexp.exec(translated)) {
                    var selectAttr = match[1];
                    var childrenEle =  $(defaultHtml).children('['+options.selectorAttr+"='" + selectAttr + "']");
                    var childrenHtml = "<div>" + localize($(childrenEle), opts) + "</div>";
                    var value = $(childrenHtml).find("[data-i18n='" + selectAttr + "']").prop("outerHTML");
                    // console.log("key:"+key)
                    // console.log("translated:"+translated)
                    // console.log("now:"+selectAttr)
                    // console.log("de:"+childrenHtml);
                    // console.log("va:"+value)
                    // console.log()
                    translated = translated.replace(match[0], value);
                }
                ele.html(translated);

            } else if (attr === 'html') {
                ele.html(i18next.t(key, defaultHtmlNode));
            } else if (attr === 'text') {
                ele.text(i18next.t(key, extendDefault(opts, ele.text())));
            } else if (attr === 'prepend') {
                ele.prepend(i18next.t(key, defaultHtmlNode));
            } else if (attr === 'append') {
                ele.append(i18next.t(key, defaultHtmlNode));
            } else if (attr.indexOf('data-') === 0) {
                var dataAttr = attr.substr('data-'.length);
                var translated = i18next.t(key, extendDefault(opts, ele.data(dataAttr)));

                // we change into the data cache
                ele.data(dataAttr, translated);
                // we change into the dom
                ele.attr(attr, translated);
            } else {
                ele.attr(attr, i18next.t(key, extendDefault(opts, ele.attr(attr))));
            }
            return ele.prop("outerHTML");
        }

        //记录已经翻译过的key
        var translatedMap;
        function localize(ele, opts) {

            var newEle;
            var key = ele.attr(options.selectorAttr);
            if (!key && typeof key !== 'undefined' && key !== false) key = ele.text() || ele.val();
            if (!key || translatedMap[key] != undefined) return;

            var target = ele,
                targetSelector = ele.data(options.targetAttr);

            if (targetSelector) target = ele.find(targetSelector) || ele;

            if (!opts && options.useOptionsAttr === true) opts = ele.data(options.optionsAttr);

            opts = opts || {};

            if (key.indexOf(';') >= 0) {
                var keys = key.split(';');

                $.each(keys, function (m, k) {
                    // .trim(): Trim the comma-separated parameters on the data-i18n attribute.
                    if (k !== '')
                        newEle = parse(target, k.trim(), opts);
                });
            } else {
                newEle = parse(target, key, opts);
            }

            if (options.useOptionsAttr === true) {
                var clone = {};
                clone = _extends({ clone: clone }, opts);

                delete clone.lng;
                ele.data(options.optionsAttr, clone);
            }

            //记录已经翻译过的key
            translatedMap[key] = key;

            return newEle;
        }

        function handle(opts) {
            translatedMap = {};
            return this.each(function () {
                // localize element itself
                localize($(this), opts);

                // localize children
                //   var elements = $(this).find('[' + options.selectorAttr + ']');
                //   elements.each(function () {
                //     localize($(this), opts);
                //   });
            });
        };

        // $.t $.i18n shortcut
        $[options.tName] = i18next.t.bind(i18next);
        $[options.i18nName] = i18next;

        // selector function $(mySelector).localize(opts);
        $.fn[options.handleName] = handle;
    }

    var index = {
        init: init
    };

    return index;

})));