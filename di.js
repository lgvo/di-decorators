// use Symbol if supported
var Symbol = Symbol || function(str) {
    return '__$$' + str;
};


var symProvider = Symbol('provider'),
    symTypes = Symbol('types');

function defaultProvider(type) {
    if (type[symTypes]) {
        return function() {
            var args = type[symTypes].map(function(t) {
                return instance(t);
            });
            return new (Function.prototype.bind.apply(type, [null].concat(args)));
        };
    }
    return function() {return new type()};
}

export function provider(type) {
    if (!type[symProvider]) {
        type[symProvider] = defaultProvider(type);
    }
    return type[symProvider];
}

export function provides(type, factory) {
    type[symProvider] = factory;
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

export function inject() {
    var types = [];
    for(var i = 0; i < arguments.length; i++)
        types[i] = arguments[i];

    return function(target) {
        target[symTypes] = types;
    };
}

export function instance(type) {
    return provider(type)();
}

