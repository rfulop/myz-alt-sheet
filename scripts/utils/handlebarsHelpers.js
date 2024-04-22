export const handlebarsHelpers = function() {
    Handlebars.registerHelper('range', function(start, end) {
        const range = [];
        for (let i = start; i < end; i++) {
            range.push(i);
        }
        return range;
    });

    Handlebars.registerHelper('groupEveryTwo', function (context, options) {
        let result = [];
        let keys = Object.keys(context);
        let temp = [];

        for (let i = 0; i < keys.length; i++) {
            temp.push({ key: keys[i], value: context[keys[i]] });
            if (temp.length === 2 || i === keys.length - 1) {
                result.push(temp);
                temp = [];
            }
        }
        return result.map(group => options.fn(group)).join('');
    });}