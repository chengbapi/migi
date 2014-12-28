(function (root, factory) {
    if(typeof define === "function" && define.amd) {
        // AMD
        define(["lib1", "lib2"], function(lib1, lib2){
            return factory(lib1, lib2);
        });
    } else if(typeof module === "object" && module.exports) {
        // CMD
        module.exports = factory(
            require("lib1"),
            require("lib2")
        );
    } else {
        // Browser
        root.<%myModule%> = factory(root.lib1, root.lib2);
    }
}(this, function(lib1, lib2) {
    return myModule;
}));

