export function proxy(type) {
    if (!type.$$_proxy) {
        makeProxy(type);
    }
    return type.$$_proxy;
}

function makeProxy(type) {
    var proxy = {};
    Object.getOwnPropertyNames(type.prototype).forEach(function(name) {
        if (name != 'constructor') {
            proxy[name] = function() {
                return type.prototype[name].apply(instance(type), arguments);
            }
        }
    });
    type.$$_proxy = proxy;
}

export function provider(type) {
    if (!type.$$_provider) {
        type.$$_provider = defaultProvider(type);
    }
    return type.$$_provider;
}

export function provides(type, factory) {
    type.$$_provider = factory;
}

export function singleton(type) {
    type.$$_provider = function() {
        var instance = defaultProvider(type);

        type.$$_provider = function() {
            return instance;
        };

        return instance;
    }
}

export function inject() {
    var types = [];
    for(var i = 0; i < arguments.length; i++)
        types[i] = arguments[i];

    return function(target) {
        target.$$_providers = types.map(provider);
    }
}

export function instance(type) {
    return provider(type)();
}

function defaultProvider(type) {
    if (type.$$_providers) {
        return function() {
            var args = type.$$_providers.map(function(p) {return p()});
            return new (Function.prototype.bind.apply(type, [null].concat(args)));
        }
    }
    return function() {return new type()};
    
}
