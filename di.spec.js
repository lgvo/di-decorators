import chai from 'chai';
import {proxy, provides, provider, singleton, inject, instance} from './di';

const expect = chai.expect;

describe('Provides', function() {

    it('should create a function provider for a class', function() {
        
        class Test {
            constructor(name) {
                this.name = name;
            }
        }
        
        provides(Test, ()  => new Test('factory'));

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

      } 

      class Test {

      }

      expect(instance(Single)).to.equal(instance(Single));
      expect(instance(Test)).not.to.equal(instance(Test));
      
    });
    
});

describe('Proxy', function() {
    it('should call the method and inject a instance as this', function() {
        class Test {
            constructor(name) {
                this.name = name || 'test';
            }

            getName() {
                return this.name;
            }
        }

        provides(Test, () => new Test('injected'));

        expect(proxy(Test).getName()).to.equal('injected');
    });

    it('should pass the arguments', function() {
        class Test {
            constructor(name) {
                this.name = name || 'test';
            }

            showMessage(msg) {
                return this.name + ': ' + msg; 
            }
        } 

        provides(Test, () => new Test('injected'));

        expect(instance(Test).name).to.equal('injected');

        expect(proxy(Test).showMessage('teste')).to.equal('injected: teste');
    });
});
