import chai from 'chai';
import {proxy, provide, provider, singleton, inject, instance} from './di';

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
