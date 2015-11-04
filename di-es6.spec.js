import chai from 'chai';
import {proxy, immutable, provide, provider, singleton, inject, instance} from './di';

const expect = chai.expect;

describe('Provide', function() {

    it('should create a function provider for a class', function() {
        
        class Test {
            constructor(name) {
                this.name = name;
            }
        }
        
        provide(Test).as(()  => new Test('factory'));

        expect(provider(Test)).to.exist;
        expect(instance(Test).name).to.equal('factory');
    });

});

describe('Inject', function() {

    it('should inject dependencies', function() {

        class A {
            constructor() {
                this.name = 'a';
            }
        }

       @inject(A) 
       class B {
           constructor(a) {
               this.injected = a.name === 'a';
           }
       }

       @inject(A, B)
       class C {
           constructor(a, b) {
               this.injected = a.name === 'a' && b.injected;
           }
       }

       expect(instance(B).injected).to.be.true;
       expect(instance(C).injected).to.be.true;
        
    });
    
});

describe('Singleton', function() {

    it('should only have one instance', function() {
      @singleton
      class Single {
          constructor() {
              this.name = 'singleton';
          }

      } 

      class Test {

      }

      expect(instance(Single)).to.equal(instance(Single));
      expect(instance(Test)).not.to.equal(instance(Test));
      expect(instance(Single).name).to.equal('singleton');
      
    });
    
});

describe('Immutable', function() {

    it('should create immutable objects', function() {
        @immutable
        class CantChange {
            constructor() {
                this.name = 'original';
            }
        }

        // direct wont be fronzen   
        expect(Object.isFrozen(new CantChange())).to.be.false;

        // using 
        expect(Object.isFrozen(instance(CantChange))).to.be.true;

    });

    it('should create immutable objects (with dependencies)', function() {

        class Dependency {
            constructor() {
                this.name = 'dep';
            }
        }

        @immutable
        @inject(Dependency)
        class CantChange {
            constructor(dep) {
                this.dep = dep;
                this.name = 'original';
            }
        }

        // direct wont be fronzen   
        expect(Object.isFrozen(new CantChange())).to.be.false;

        // using 
        expect(Object.isFrozen(instance(CantChange))).to.be.true;

        expect(instance(CantChange).dep.name).to.equal('dep');

    });

    it('should work as a immutable dependency', function() {
        @immutable
        class Dependency {
            constructor() {
                this.name = 'dep';
            }
        }

        @inject(Dependency)
        class Test {
            constructor(dep) {
                this.dep = dep;
            }
        }

        expect(Object.isFrozen(instance(Test).dep)).to.be.true;

    });
});

describe('Inheritance', function() {
    it('should support for use the Super dependencies', function() {
        var queue = [];

        class Publisher {
            send(message) {
                queue.push(message);
            }
        }

        class Subscriber {
            consume() {
                return queue.pop();
            }
        }

        @inject(Publisher)
        class Super {
            constructor(publisher) {
                this.publisher = publisher;
                expect(publisher instanceof Publisher).to.be.true;
            }

            send(message) {
                this.publisher.send(message);
            }

        }

        @inject(Subscriber)
        class MyClass extends Super { 
            constructor(subscriber, publisher) {
                super(publisher);
                this.subscriber = subscriber;
                expect(subscriber instanceof Subscriber).to.be.true;
            }

            publish(message) {
                super.send(message);
            }

            consume() {
                return this.subscriber.consume();
            }
        }

        var myObj = instance(MyClass);
        myObj.publish('test');

        expect(myObj.consume()).to.equal('test');
        expect(queue).to.be.empty;
    });

    it('should support multiple dependencies', function() {

        class A {}
        class B {}
        class C {}

        @inject(A,B,C)
        class ABC {
            constructor(a,b,c) {
                this.a = a;
                this.b = b;
                this.c = c;
            }
        }

        class D {}

        @inject(D)
        class MyClass extends ABC {
            constructor(d, ...args) {
                super(...args);
                this.d = d;
            }
        }
        
        var myObj = instance(MyClass);
        
        expect(myObj.a instanceof A).to.be.true;
        expect(myObj.b instanceof B).to.be.true;
        expect(myObj.c instanceof C).to.be.true;
        expect(myObj.d instanceof D).to.be.true;
    });

    it('should support more than 2 levels', function() {

        var count = 0;

        class A {}
        class B {}
        class C {}

        @inject(A)
        class Grandfather {
            constructor(a) {
                expect(a instanceof A).to.be.true;
                count++;
            }

        }

        @inject(B)
        class Father extends Grandfather {
            constructor(b, a) {
                super(a);
                expect(b instanceof B).to.be.true;
                count++;
            }
            
        }

        @inject(C)
        class Son extends Father{
            constructor(c, b, a) {
                super(b, a);
                expect(c instanceof C).to.be.true;
                count++;
            }
        }

        instance(Son);

        expect(count).to.equal(3);
        
    });

});
