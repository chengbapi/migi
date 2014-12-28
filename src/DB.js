define(function(require) {
    var $ = require('jquery');
    var _ = require('underscore');
    // Simple Browser DB
    // Only Index By ID
    var DB = {};

    function Table(name) {
        this._cid = 0;
        if (DB[name]) { return DB[name]; }

        DB[name] = this;
    }

    _.extend(Table.prototype, {
        create: function(newObj) {
            this[this._cid++] = newObj;
            return newObj;
        },
        get: function(query, returnIDs) {
            var id = parseInt(query, 10);
            if (id) {
                if (returnIDs) { return id; }
                return this[id];
            }
            if (_.isObject(query)) {
                var idPairs = _.pairs(_.omit(this, '_cid'));
                var matchPairs = _.filter(idPairs, function(idPair) {
                    var id = idPair[0];
                    var obj = idPair[1];

                    var match = true;

                    $.each(query, function(key, value) {
                        var queryValue = JSON.stringify(query[key]);
                        var keyValue = JSON.stringify(obj[key]);
                        if (query[key] !== queryValue) {
                            match = false;
                        }
                    });

                    return match;
                });

                return matchPairs.map(function(matchPair) {
                    if (returnIDs) { return matchPair[0]; }
                    return matchPair[1];
                });
            }
        },
        del: function(query) {
            var table = this;
            var matchIDs = this.get(query, true);
            var id = parseInt(query, 10);
            if (id) {
                matchIDs = [matchIDs];
            }

            var ret = [];

            _.forEach(matchIDs, function(matchID) {
                ret.push(table[matchID]);
                delete table[matchID];
            });

            return ret;
        }
    });

    function deepCopy(object) {
        return $.extend(true, {}, object);
    }

    return {
        create: function(tableName, newObj) {
            var table = this._getTableName(tableName, true);
            return table.create(newObj);
        },
        get: function(tableName, query) {
            var table = this._getTableName(tableName);
            if (!table) { return null; }
            return table.get(query);
        },
        del: function(tableName, query) {
            var table = this._getTableName(tableName);
            if (!table) { return null; }
            return table.get(query);
        },
        _getTableName: function(tableName, createIfNotExists) {
            var table = DB[tableName];
            if (!table) {
                if (createIfNotExists) {
                    table = new Table(tableName);
                    DB[tableName] = table;
                    return table;
                } else {
                    return null;
                }
            }
            return table;
        },
        find: function() {
            return this.get.apply(this, arguments);
        },
        query: function() {
            return this.get.apply(this, arguments);
        }
    };

});
