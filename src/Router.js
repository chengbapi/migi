(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        // AMD
        define(["underscore", "./Events"], function(underscore, Events){
            return factory(underscore, Events);
        });
    } else if(typeof module === "object" && module.exports) {
        // CMD
        module.exports = factory(
            require("underscore"),
            require("./Events")
        );
    } else {
        // Browser
        root.Router = factory(root._, root.events);
    }
}(this, function(_, Events) {

    function Router(obj, option) {
        this.currentState = [];
        this.rootNode = this.initRouterTree(obj);
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
                path = '/';
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
            if (lastIndexOfSlash === -1) {
                throw new Error('not found');
            }
            var degradePath = path.slice(0, lastIndexOfSlash);
            unmatched.unshift(path.slice(lastIndexOfSlash + 1));
            return this.getTargetState(nodes, degradePath, unmatched, stateStack);
        },
        findShortestPath: function(currentState, targetState) {
            // get Common parent Node
            for (var i = 0; i < currentState.length; i++) {
                if (currentState[i].node !== targetState[i].node ||
                    !_.isEqual(currentState[i].params, targetState[i].params)) {
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
}));

