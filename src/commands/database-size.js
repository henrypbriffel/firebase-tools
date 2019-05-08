"use strict";

var Command = require("../command");
var requireInstance = require("../requireInstance");
var requirePermissions = require("../requirePermissions");
var DatabaseSize = require("../database/size").default;
var utils = require("../utils");

var _ = require("lodash");

module.exports = new Command("database:size <path>")
  .description("esimate the size of the Firebase subtree rooted at the specified path")
  .option(
    "--instance <instance>",
    "use the database <instance>.firebaseio.com (if omitted, use default database instance)"
  )
  .before(requirePermissions, ["firebasedatabase.instances.get"])
  .before(requireInstance)
  .action(function(path, options) {
    if (!_.startsWith(path, "/")) {
      return utils.reject("Path must begin with /", { exit: 1 });
    }
    let sizeOps = new DatabaseSize(options.instance, path);
    return sizeOps.execute().then(function(bytes) {
      utils.logSuccess(path + " is approximately " + bytes + " bytes.");
    });
  });
