define(function (require) {
    var _ = require('underscore');
    var Events = require('./Events');

    function Router(obj, option) {
        this.currentState = null;
        this.rootNode = initRouterTree(obj);
    }

    _.extend(Router.prototype, Events, {
        initRouterTree: function(obj) {
            return obj;
        },
        updateRouter: function(obj) {
            _.extend(this.rootNode, obj);
            this.trigger('addRouter');
        },
        triggerRouter: function(path) {
            var self = this;
            var targetState = this.getTargetState(this.rootNode, path, [], []);

            var shortestPath = this.findShortestPath(this.currentState, targetState);
            _.forEach(shortestPath.leave, function(leaveState) {
                self.trigger('leave', leaveState.node, leaveState.params);
            });
            _.forEach(shortestPath.enter, function(enterState) {
                self.trigger('enter', enterState.node, enterState.params);
            });

            this.currentState = targetState;
        },
        getTargetState: function(nodes, path, unmatched, stateStack) {
            if (path.length === 0) {
                return null;
            }
            var rules = _.keys(nodes);
            // 从长到短
            rules = _.sortBy(rules, function(rule) {
                return -rule.length;
            });

            for (var i = 0; i < rules.length; i++) {
                var matchResult = this.match(rules[i], path);
                if (matchResult) {
                    matchResult.node = nodes[rules[i]];
                    if (unmatched.length) {
                        stateStack.push(matchResult);
                        return this.getTargetState(nodes[rules[i]].childNodes, unmatched.join(''), [], stateStack);
                    }
                    stateStack.push(matchResult);
                    return stateStack;
                }
            }
            // degrade /a/b/c -> /a/b
            var lastIndexOfSlash = path.lastIndexOf('/');
            var degradePath = path.slice(0, lastIndexOfSlash);
            unmatched.unshift(path.slice(lastIndexOfSlash));
            return this.getTargetState(nodes, degradePath, unmatched, stateStack);
        },
        findShortestPath: function(currentState, targetState) {
            // get Common parent Node
            for (var i = 0; i < currentState.length; i++) {
                if (currentState.node !== targetState.node ||
                    !_.isEqual(currentState.params, targetState.params)) {
                    break;
                }
            }
            return {
                leave: currentState.slice(i).reverse(),
                enter: targetState.slice(i)
            };
        },
        match: function(rule, path) {
            if (rule === path) {
                return {
                    params: {

                    }
                };
            }
            return false;
        }
    });

    return Router;
});
