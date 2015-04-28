"use strict";

var test = require("tape");
var asbestos = require("..");
var model = require("russian-doll")({ index: "index", type: "articles" });
var hapi = require("hapi");
var server = new hapi.Server();
var request = require("request");

server.connection({ port: 8000 });

var handlers = asbestos(model);

server.route([
  {
    method: "POST",
    path: "/articles",
    handler: handlers.create
  },
  {
    method: "GET",
    path: "/articles/{id}",
    handler: handlers.findOne
  },
  {
    method: "PUT",
    path: "/articles/{id}",
    handler: handlers.update
  },
  {
    method: "DELETE",
    path: "/articles/{id}",
    handler: handlers.del
  }
]);

test("NOT A TEST: delete db", function (t) {

  var opts = {
    method: "DELETE",
    url: "http://127.0.0.1:9200/index/articles"
  };

  request(opts, function () {

    t.end();
  });

});

test("asbestos should return an object with create, findOne, update, del methods", function (t) {


  ["create", "findOne", "update", "del"].forEach(function (op) {

    t.ok(handlers.hasOwnProperty(op), "returned object has " + op);

  });

  t.end();

});


test("create should respond with 200 if successfully created", function (t) {

  var opts = {
    method: "POST",
    url: "/articles",
    payload: {
      id: 1234,
      title: "William Fisher and Besart Shyti",
      page: 8
    }
  };

  server.inject(opts, function (res) {

    t.equals(res.statusCode, 200, "200 returned");


    model.findOne({
      id: 1234
    }, function (e, r) {

      t.ok(r.found, "created successfully");
      t.end();
    });
  });
});


test("create should respond with 200 if already exists", function (t) {

  var opts = {
    method: "POST",
    url: "/articles",
    payload: {
      id: 1234,
      title: "William Fisher and Besart Shyti",
      page: 8,
      test: "hello there",
      ntest: "hello"
    }
  };

  server.inject(opts, function (res) {

    t.equals(res.statusCode, 200, "200 returned");
    t.end();
  });
});


test("findOne should return 200 if found", function (t) {

  var opts = {
    method: "GET",
    url: "/articles/1234"
  };

  server.inject(opts, function (res) {

    t.equals(res.statusCode, 200, "200 returned");
    t.end();
  });

});

test("findOne should return 500 if not found", function (t) {

  var opts = {
    method: "GET",
    url: "/articles/4321"
  };

  server.inject(opts, function (res) {

    t.equals(res.statusCode, 500, "500 returned");
    t.end();
  });
});

test("update should return 200 if updated", function (t) {

  var opts = {
    method: "PUT",
    url: "/articles/1234",
    payload: {
      title: "Just William"
    }
  };

  server.inject(opts, function (res) {

    t.equals(res.statusCode, 200, "200 returned");
    model.findOne({
      id: 1234
    }, function (e, r) {

      t.equals(r._source.title, "Just William", "document updated");
      t.end();
    });
  });
});


test("update should return 500 if not found", function (t) {

  var opts = {
    method: "PUT",
    url: "/articles/4321",
    payload: {
      title: "Just William"
    }
  };

  server.inject(opts, function (res) {

    t.equals(res.statusCode, 500, "500 returned");
    t.end();
  });
});

test("delete should return 200 if deleted", function (t) {


  var opts = {
    method: "DELETE",
    url: "/articles/1234"
  };

  server.inject(opts, function (res) {

    t.equals(res.statusCode, 200, "200 returned");

    model.findOne({
      id: 1234
    }, function (e, r) {

      t.ok(e, "document deleted");
      t.notOk(r, "document deleted");
      t.end();
    });
  });

});

test("delete should return 500 if not exists", function (t) {


  var opts = {
    method: "DELETE",
    url: "/articles/4321"
  };

  server.inject(opts, function (res) {

    t.equals(res.statusCode, 500, "500 returned");
    t.end();
  });

});
