var assert = require("assert");
var Router = require("../src/Router");
describe('Router', function(){
    var router = Router.start({
        '/': {
            tag: 'root directory',
            childNodes: {
                'home': {
                    tag: 'home page'
                },
                'help/:id': {
                    tag: 'help page'
                },
                'doSomething/then/last': {
                    tag: 'done'
                }
            }
        },
        '/renxing': {
            tag: 'renxing page'
        }
    });
    router.on('enter', function(node, params) {
        console.log('enter:' + node.tag);
        console.log(params);
    });
    router.on('leave', function(node, params) {
        console.log('leave:' + node.tag);
        console.log(params);
    });

    describe('#init()', function(){
        it('init', function(){
            console.log(router);
        });
    });
    describe('#match()', function(){
    });
    describe('#getTargetState()', function(){
        it('from root to home', function(){
            var state = router.getTargetState(router.rootNode, '/home', [], []);
            console.log(state);
        });
        it('from root to renxing', function(){
            var state = router.getTargetState(router.rootNode, '/renxing', [], []);
            console.log(state);
        });
    });
    describe('#shortestPath()', function() {

    });
    describe.only('#triggerRouter()', function(){
        it('from root to home', function(){
            router.triggerRouter('/home');
        });
        it.only('from home to help', function(){
            router.triggerRouter('/help/123');
        });
        it('from help to renxing', function(){
            router.triggerRouter('/renxing');
        });
        it('from renxing to last', function(){
            router.triggerRouter('/doSomething/then/last');
        });
        //it('form help to renxing', function(){
            //router.triggerRouter('/hhaha');
        //});
    });
});

