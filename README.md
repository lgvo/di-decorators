# Simple Dependency Injection with ES Decorators


[![Build Status](https://travis-ci.org/lgvo/di-decorators.svg?branch=master)](https://travis-ci.org/lgvo/di-decorators)
[![Coverage Status](https://coveralls.io/repos/lgvo/di-decorators/badge.svg?branch=master&service=github)](https://coveralls.io/github/lgvo/di-decorators?branch=master)
[![npm version](https://badge.fury.io/js/di-decorators.svg)](http://badge.fury.io/js/di-decorators)
[![Code Climate](https://codeclimate.com/github/lgvo/di-decorators/badges/gpa.svg)](https://codeclimate.com/github/lgvo/di-decorators)
[![npm](https://img.shields.io/npm/dm/di-decorators.svg)](https://www.npmjs.com/package/di-decorators)
[![Join the chat at https://gitter.im/lgvo/di-decorators](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/lgvo/di-decorators?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


This project is a easy to use little dependency injection framework on top of ES Decorators.
The basic idea is to have a easy way to declare dependencies with ES decorators.

** Please take the time to star the project if you like it! "npm star di-decorators" and also on github [di-decorators](https://github.com/lgvo/di-decorators). **

## Installation

```sh
$ npm install --save di-decorators
```

## Usage

### Babel Config
Yout need a ES.next transpiler to run di-decorators, in that case Babel.
```sh
$ npm install --global babel 
```

Right now to use decorators with Babel you need to configure it with stage 1.
Simple add a ".babelrc" file on the root of your project:
```javascript
{"stage": 1}
```

For more details on how to use babel: [https://babeljs.io](https://babeljs.io)


### Inject and Instance

```javascript
import {instance, inject} from 'di-decorators';
import {ClassToBeInjected} from './somePackage';

@inject(ClassToBeInjected)
class MyClass {

    constructor(injected) {
        this.dependency = injected;
    }
}


var myObject = instance(MyClass); // create a instance of MyClass with the dependencies
myObject.dependency; // will be a  instance of ClassToBeInjected
```

You can inject any class, by default a new instance will be created.
In the last example the call to "instance(MyClass)" will be the same as "new MyClass(new ClassToBeInjected())". 

### Immutable

```javascript
import {instance, immutable} from 'di-decorators';

@immutable
class CannotChange {
    constructor() {
        this.value = 1;
    }
}

var obj = instance(CannotChange);

obj.value; // 1
Object.isFrozen(obj); // true

obj.value = 2; // Throws a TypeError: Cannot assign to read only property 'value'

```

You can mark a class as immutable so the instance will be frozen.

### Singleton

```javascript
import {instance, inject, singleton} from 'di-decorators';

@singleton
class TheOne {

}

@inject(TheOne)
class A {
    constructor(one) {
        this.one = one;
    }
}

@inject(TheOne)
class B {
    constructor(one) {
        this.one = one;
    }
}

var a = instance(A),
    b = instance(B);

a.one === b.one; // will be true, the instance is the same
a.one === instace(TheOne); // also true
```

If you want to have only one instance of some class you can use the @singleton decorator, that way every time you inject the same instance of the class.

### Inheritance

```javascript
import {instance, inject} from 'di-decorators';

class Hello {
    message() {
        return "Hello";
    }
}

@inject(Hello)
class Super {
    constructor(hello) {
        this.hello = hello;
    }
}

class World {
    message() {
        return "World";
    }
}

@inject(World)
class MyClass extends Super {
    constructor(world, hello) {
        super(hello);
        this.world = world;
    }

    helloWorld() {
        return this.hello.message() + ' ' +
               this.world.message() + '!';
    }
}

instance(MyClass).helloWorld(); // will be the string 'Hello World!'

```

So how it works? Basically when you extend a class with dependency injections we add theses dependencies to the current class so you can pass to the super constructor.


The ideal way to do that is using rest parameters, so you can add more dependencies to the super class without worry to change everyone that extends it.

Se the example bellow:
```javascript

class A {}
class B {}

@inject(A, B)
class Super {
    constructor(a, b) {
        this.a = a;
        this.b = b; 
    }
}

class C {}

@inject(C)
class MyClass extends Super {
    constructor(c, ...args) {
        super(...args);
        this.c= c;
    }
}
```


### Defining your own provider.

```javascript
import {instance, provide} from 'di-decorators';

class MyClass {
    constructor(name) {
        this.name = name;
    }
}

provide(MyClass).as(function() {
    return new MyClass('provider');
});

instance(MyClass).name; // will be the 'provider' string;
```

You can use provide to define how to create the instance.

## See Also
* [restful-express](https://github.com/lgvo/restful-express) declarative way to define Express routers using decorators.
* [express-promise-wrapper](https://github.com/lgvo/express-promise-wrapper) simple wrapper to to transform promise results into express functions.

## Contributing
* Pull Requests are welcome!
* Feel free to fork, and if you are planning to add more features please open a issue so we can discuss about.
* Mind the test coverage and code complexity, if you can do it with TDD probably will come with both.
* Try to use only ES5 in the core lib.

## License
[MIT](LICENSE)
