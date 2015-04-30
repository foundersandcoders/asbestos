"use strict";

var test = require("tape");
var asbestos = require("..");
var hapi = require("hapi");
var server = new hapi.Server();

server.connection({ port: 8000 });

var opts = {
	index: "index",
	type: "articles",
	// no transport protocol
	host: "127.0.0.1",
	port: Number(process.env.ES_PORT)
};

var failArticles =  require("russian-doll")(opts);

var handlers = asbestos(failArticles);

server.route([
	{
		method: "POST",
		path: "/articles",
		handler: handlers.create
	},
	{
		method: "GET",
		path: "/articles",
		handler: handlers.find
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


test("Error database connection", function (t){



	t.test("create should respond with 500 if failed", function (st) {

		var opts = {
			method: "POST",
			url: "/articles",
			payload: {
				id: "1234",
				title: "William Fisher and Besart Shyti"
			}
		};

		server.inject(opts, function (res) {

			st.equals(res.statusCode, 500, "500 returned");
			st.end();
		});
	});

	t.test("find should respond with 500 if failed", function (st) {

		var opts = {
			method: "GET",
			url: "/articles?name=wil"
		};

		server.inject(opts, function (res) {

			st.equals(res.statusCode, 500, "500 returned");
			st.end();
		});
	});	

	t.test("findOne should respond with 500 if failed", function (st) {

		var opts = {
			method: "GET",
			url: "/articles/1234"
		};

		server.inject(opts, function (res) {

			st.equals(res.statusCode, 500, "500 returned");
			st.end();
		});
	});

	t.test("update should respond with 500 if failed", function (st) {

		var opts = {
			method: "PUT",
			url: "/articles/1234",
			payload: {
				name: "bes"
			}
		};

		server.inject(opts, function (res) {

			st.equals(res.statusCode, 500, "500 returned");
			st.end();
		});
	});

	t.test("delete should respond with 500 if failed", function (st) {

		var opts = {
			method: "DELETE",
			url: "/articles/1234"
		};

		server.inject(opts, function (res) {

			st.equals(res.statusCode, 500, "500 returned");
			st.end();
		});
	});
});