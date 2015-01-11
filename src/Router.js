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
    // Cached regular expressions for matching named param parts and splatted
    // parts of route strings.
    var optionalParam = /\((.*?)\)/g;
    var namedParam    = /(\(\?)?:\w+/g;
    var splatParam    = /\*\w+/g;
    var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;


    var Router = {
        currentState: [],
        start: function(obj) {
            this.rootNode = this.initRouterTree(obj);
            history.start();
            return this;
        },
        initRouterTree: function(obj) {
            var self = this;
            var keys = _.keys(obj);
            _.forEach(keys, function(key) {
                obj[key]._RegExp = self._routeToRegExp(key);
                if (obj[key].childNodes) {
                    self.initRouterTree(obj[key].childNodes);
                }
            });
            return obj;
        },
        // proxy for history.navigate
        navigate: function(fragment, options) {
            return history.navigate(fragment, _.extend({ trigger: true }, options));
        },
        updateRouter: function(obj) {
            //_.extend(this.rootNode, obj);
            //this.trigger('addRouter');
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

            var enterStateLength = shortestPath.enter.length
            var lastState = shortestPath.enter[enterStateLength - 1];
            self.trigger('at', lastState.node, lastState.params);

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
                var matchResult = this.match(nodes[rules[i]], path);
                if (matchResult) {
                    matchResult.node = nodes[rules[i]];
                    if (unmatched.length) {
                        stateStack.push(matchResult);
                        return this.getTargetState(nodes[rules[i]].childNodes, unmatched.join('/'), [], stateStack);
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
            var minLength = Math.min(currentState, targetState);
            // get Common parent Node
            for (var i = 0; i < minLength; i++) {
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
            if (rule._RegExp.test(path)) {
                return {
                    params: this._extractParameters(rule._RegExp, path)
                };
            }
            return false;
        },

        // Convert a route string into a regular expression, suitable for matching
        // against the current location hash.
        _routeToRegExp: function(route) {
            route = route.replace(escapeRegExp, '\\$&')
                       .replace(optionalParam, '(?:$1)?')
                       .replace(namedParam, function(match, optional) {
                         return optional ? match : '([^/?]+)';
                       })
                       .replace(splatParam, '([^?]*?)');
            return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
        },

        // Given a route, and a URL fragment that it matches, return the array of
        // extracted decoded parameters. Empty or unmatched parameters will be
        // treated as `null` to normalize cross-browser behavior.
        _extractParameters: function(route, fragment) {
            var params = route.exec(fragment).slice(1);
            return _.map(params, function(param, i) {
                // Don't decode the search params.
                if (i === params.length - 1) return param || null;
                return param ? decodeURIComponent(param) : null;
            });
        }
    };

    _.extend(Router, Events);


  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = function() {
    _.bindAll(this, 'checkUrl');

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  //var routeStripper = /^[#\/]|\s+$/g;
  var routeStripper = /^[#]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  // Cached regex for stripping urls of hash.
  var pathStripper = /#.*$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Are we at the app root?
    atRoot: function() {
      return this.location.pathname.replace(/[^\/]$/, '$&/') === this.root;
    },

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = decodeURI(this.location.pathname + this.location.search);
          var root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.slice(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("History has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      if (oldIE && this._wantsHashChange) {
        var frame = document.createElement('iframe');
        frame.src = "javascript:0";
        frame.tabindex = "-1";
        frame.style.display = "none";
        document.body.appendChild(frame);
        this.iframe = frame.contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        window.onpopstate = this.checkUrl;
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        window.onhashchange = this.checkUrl;
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = this.location;

      // Transition from hashChange to pushState or vice versa if both are
      // requested.
      if (this._wantsHashChange && this._wantsPushState) {

        // If we've started off with a route from a `pushState`-enabled
        // browser, but we're currently in a browser that doesn't support it...
        if (!this._hasPushState && !this.atRoot()) {
          this.fragment = this.getFragment(null, true);
          this.location.replace(this.root + '#' + this.fragment);
          // Return immediately as browser will do redirect to new url
          return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
        } else if (this._hasPushState && this.atRoot() && loc.hash) {
          this.fragment = this.getHash().replace(routeStripper, '');
          this.history.replaceState({}, document.title, this.root + this.fragment);
        }

      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      window.onpopstate = function() {};
      window.onhashchange = function() {};
      if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragment) {
      fragment = this.fragment = this.getFragment(fragment);
      return Router.triggerRouter(fragment);
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: !!options};

      var url = this.root + (fragment = this.getFragment(fragment || ''));

      // Strip the hash for matching.
      fragment = fragment.replace(pathStripper, '');

      if (this.fragment === fragment) return;
      this.fragment = fragment;

      // Don't include a trailing slash on the root.
      if (fragment === '' && url !== '/') url = url.slice(0, -1);

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) return this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  var history = new History();


  return Router;
}));

