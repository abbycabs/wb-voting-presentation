var server = require("./server"),
    router = require("./router"),
    requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.mobile;
handle["/mobile"] = requestHandlers.mobile;
handle["/voting_options"] = requestHandlers.voting_options;
handle["/option"] = requestHandlers.option;
handle["/votes"] = requestHandlers.votes;

server.start(router.route, handle);
