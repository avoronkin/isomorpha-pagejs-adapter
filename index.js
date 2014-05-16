var _ = require('lodash');

module.exports = function (routeTable, page) {
    if (!routeTable) {
        throw new Error('express adapter: routeTable required!')
    }
    if (!page) {
        throw new Error('express adapter: page.js instance required!')
    }
    if (!_.isArray(routeTable)) {
        throw new Error('express adapter: routeTable must be array!')
    }
    _.each(routeTable, function(route){
        addRoute(route, page);
    });
}

function addRoute(route, page) {
    if (_.isUndefined(route.method)) route.method = 'get';
    if (route.method !== 'get') return;

    if (!route.pattern) {
        throw new Error('express adapter addRoute(): route.pattern required!', route);
    }
    if (!route.handlers) {
        throw new Error('express adapter addRoute(): route.handlers required!', route);
    }

    var handlers = [];

    if (_.isArray(route.handlers)) {
        handlers = route.handlers;
    }
    if (_.isFunction(route.handlers)) {
        handlers.push(route.handlers);
    }

    page.apply(page, [route.pattern].concat(handlers));
}
