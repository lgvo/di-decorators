# Simple Dependency Injection with ES Decorators
==============================================

This project is a easy to use little dependency injection framework on top of ES Decorators.
The basic idea is to have a easy way to declare dependencies with ES decorators.


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

Right now to use decorators with Babel you need to configure it with state 1.
Simple add a ".babelrc" file on the root of your project:
```javascript
{"state": 1}
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
In the last example the call to "instance(MyClass)" will be the same of "new MyClass(new ClassToBeInjected)". 

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
a.one === isntance(TheOne); // also true
```

If you want to have only one instance of some class you can use the @singleton decorator, that way every time you will inject the same instance of the class.


### Defining your own provider.

```javascript
import {instance, provide} from 'di-decorators';

class MyClass {
    constructor(name) {
        this.name = name;
    }
}

provide(MyClass).with(function() {
    return new MyClass('provider');
});

instance(MyClass).name; // will be the 'provider' string;
```

You can use provide to define how you want to create your the instance.

## License
[MIT](LICENSE)
