var assert = require("assert");
var Model = require("../src/Model");

describe('Model', function(){

    describe('#new()', function(){
        it('init', function(){
            var obj = new Model({ a: 1, b: 2 })
            console.log(obj);
        });
        it('defaults', function(){
            Model.defaults = { c: 3 };
            var obj = new Model({ a: 1, b: 2 });
            console.log(obj);
        });
    });
    describe('#extend()', function(){
        it('init', function(){
            ModelA = Model.extend({
                d: 4
            })
            var obj = new ModelA({ a: 1, b: 2 });
            console.log(obj);
            console.log(obj.constructor.prototype._superclass_);
            console.log(ModelA.prototype._superclass_);
            ModelB = ModelA.extend({
                e: 5
            })
            var obj = new ModelB({ a: 1, b: 2 });
            console.log(obj)
            console.log(obj.constructor._superclass_);
            console.log(ModelB.prototype._superclass_);
        });
    });
});

