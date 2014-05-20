var _ = require('lodash');

module.exports = function (routeTable, page) {
    if (!routeTable) {
        throw new Error('pagejs adapter: routeTable required!');
    }
    if (!page) {
        throw new Error('pagejs adapter: page.js instance required!');
    }
    if (!_.isArray(routeTable)) {
        throw new Error('pagejs adapter: routeTable must be array!');
    }
    _.each(routeTable, function (route) {
        addRoute(route, page);
    });
}

function addRoute(route, page, parentPattern) {
    if (_.isUndefined(route.method)) route.method = 'get';
    if (route.method !== 'get') return;
    parentPattern = parentPattern || '';

    if (!route.pattern) {
        throw new Error('pagejs adapter addRoute(): route.pattern required!', route);
    }
    if (!route.handlers) {
        throw new Error('pagejs adapter addRoute(): route.handlers required!', route);
    }

    if (_.isFunction(route.handlers)) {
        route.handlers = [route.handlers];
    }

    route.pattern = parentPattern + route.pattern;

    page.apply(page, [route.pattern].concat(route.handlers));

    parentPattern = route.pattern;

    if (_.isArray(route.routes)) {
        _.each(route.routes, function (route) {
            addRoute(route, page, parentPattern);
        });
    }
}
