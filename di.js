function  nsPrefix(str) {
    return '__$$' + str;
}

var symProvider = nsPrefix('provider'),
    symInterceptors = nsPrefix('interceptors'),
    symTypes = nsPrefix('types');

function argsResolver(type) {
    return type[symTypes].map(function(t) {
        return instance(t);
    });
}

function interceptorsOf(type) {
    if (!type[symInterceptors]) {
        type[symInterceptors] = [];
    }

    return type[symInterceptors];
}

function intercept(obj, interceptors) {
    return interceptors.reduce(function(newInstance, interceptor) {
        return interceptor(newInstance);
    }, obj);
}

function defaultProvider(type) {
    var interceptors = interceptorsOf(type);

    if (type[symTypes]) {
        return function() {
            var obj = new (Function.prototype.bind.apply(type, [null].concat(argsResolver(type))));

            if (interceptors.length > 0) {
                obj = intercept(obj, interceptors);
            }

            return obj;
        };
    }
    return function() {
        var obj = new type();

        if (interceptors.length > 0) {
            obj = intercept(obj, interceptors);
        }

        return obj;
    };
}

export function provider(type) {
    if (!type[symProvider]) {
        type[symProvider] = defaultProvider(type);
    }
    return type[symProvider];
}

export function provide(type, factory) {
    return {
        as: function(factory) {
            type[symProvider] = factory;
        } 
    };
}

export function singleton(type) {
    type[symProvider] = function() {
        var instance = defaultProvider(type)();

        type[symProvider] = function() {
            return instance;
        };

        return instance;
    };
}

export function immutable(type) {
    interceptorsOf(type).push(function(newInstance) {
        return Object.freeze(newInstance);
    });
}

export function inject() {
    var types = [];
    for(var i = 0; i < arguments.length; i++) {
        types[i] = arguments[i];
    }

    return function(target) {
        if (target[symTypes]) {
            target[symTypes] = types.concat(target[symTypes]);
        } else {
            target[symTypes] = types;
        }
    };
}

export function instance(type) {
    return provider(type)();
}

