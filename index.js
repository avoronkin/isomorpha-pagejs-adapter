var _ = require('lodash');

module.exports = function (routeTable, routeManager) {
    if (!routeTable) {
        throw new Error('pagejs adapter: routeTable required!');
    }
    if (!routeManager) {
        throw new Error('pagejs adapter: routeManager instance required!');
    }
    if (!_.isArray(routeTable)) {
        throw new Error('pagejs adapter: routeTable must be array!');
    }
    _.each(routeTable, function (route) {
        addRoute(route, routeManager);
    });
}

function addRoute(route, routeManager, parentName) {
    if (_.isUndefined(route.method)) route.method = 'get';
    if (route.method !== 'get') return;

    if (!route.pattern) {
        throw new Error('pagejs adapter addRoute(): route.pattern required!', route);
    }
    if (!route.handlers) {
        throw new Error('pagejs adapter addRoute(): route.handlers required!', route);
    }

    if (_.isFunction(route.handlers)) {
        route.handlers = [route.handlers];
    }

    var routeArguments = [{
            name: route.name,
            re: route.pattern,
            parent: parentName ? routeManager.getRoute(parentName) : null
        }, route.handlers];

    routeManager.add.apply(routeManager, routeArguments);

    if (_.isArray(route.routes)) {
        _.each(route.routes, function (r) {
            addRoute(r, routeManager, route.name);
        });
    }

}

