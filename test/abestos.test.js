"use strict";

var test = require("tape");
var asbestos = require("..");
var hapi = require("hapi");
var server = new hapi.Server();
var request = require("request");
var is = require("torf");


server.connection({ port: 8000 });


var optsAdaptor = {
	index: "index",
	type: "articles",
	port: process.env.ES_PORT,
	host: process.env.ES_HOST
};


var model = require("russian-doll")(optsAdaptor);


var handlers = asbestos(model);

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

test("NOT A TEST: delete db", function (t) {

	var opts = {
		method: "DELETE",
		url: "http://127.0.0.1:9200/index/articles"
	};

	request(opts, function () {

		t.end();
	});
});

test("asbestos should return an object with create, findOne, update, del and find methods", function (t) {


	["create", "findOne", "update", "del", "find"].forEach(function (op) {

		t.ok(handlers.hasOwnProperty(op), "returned object has " + op);

	});

	t.end();
});

test("create should respond with 200 if successfully created", function (t) {

	var opts = {
		method: "POST",
		url: "/articles",
		payload: {
			id: "1234",
			title: "William Fisher and Besart Shyti",
			page: 8,
			test: "hello there",
			ntest: "hello"
		}
	};

	server.inject(opts, function (res) {

		res.payload = JSON.parse(res.payload);

		t.equals(res.statusCode, 200, "200 returned");
		t.equal(res.payload.id, opts.payload.id, "created successfully");
		t.end();
	});
});

test("create should respond with 200 if already exists", function (t) {

	var opts = {
		method: "POST",
		url: "/articles",
		payload: {
			id: "1234",
			title: "William Fisher and Besart Shyti",
			page: 8,
			test: "hello there",
			ntest: "hello"
		}
	};

	server.inject(opts, function (res) {

		res.payload = JSON.parse(res.payload);

		t.equals(res.statusCode, 200, "200 returned");
		t.equal(res.payload.id, opts.payload.id, "document returned");

		t.end();
	});
});

test("#find()", function (t){

	t.test("should return an array", function (st){

		var opts = {
			method: "GET",
			url: "/articles?test=hello"
		};

		setTimeout(function (){

			server.inject(opts, function (res){

				res.payload = JSON.parse(res.payload);

				st.equals(res.statusCode, 200, "200 returned");
				st.ok(is.type(res.payload, "array"), "array returned");
				st.equals(res.payload.length, 1, "array returned");
				st.equal(res.payload[0].id, "1234", "document returned");

				st.end();
			});
		}, 1000);
	});

	t.test("if nothing was find should return 200 and empty array", function (st){

		var opts = {
			method: "GET",
			url: "/articles?test=notFound"
		};

		server.inject(opts, function (res){

			res.payload = JSON.parse(res.payload);

			st.equals(res.statusCode, 200, "200 returned");
			st.ok(is.type(res.payload, "array"), "array returned");
			st.equals(res.payload.length, 0, "array is empty");

			st.end();
		});
	});
})

test("#findOne() should return 200 if found", function (t) {

	var opts = {
		method: "GET",
		url: "/articles/1234"
	};

	server.inject(opts, function (res) {

		res.payload = JSON.parse(res.payload);

		t.equals(res.statusCode, 200, "200 returned");
		t.equals(res.payload.id, "1234", "returned correct document");
		t.end();
	});

});

test("#findOne() should return 404 if not found", function (t) {

	var opts = {
		method: "GET",
		url: "/articles/4321"
	};

	server.inject(opts, function (res) {

		res.payload = JSON.parse(res.payload);

		t.equals(res.statusCode, 404, "404 returned");
		t.ok(is.type(res.payload, "object"), "object returned");
		t.ok(!is.ok(res.payload), "object is empty");
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

		res.payload = JSON.parse(res.payload);

		t.equals(res.statusCode, 200, "200 returned");
		t.equals(res.payload.title, opts.payload.title, "document updated");
		t.end();
	});
});


test("update should return 404 if not found", function (t) {

	var opts = {
		method: "PUT",
		url: "/articles/4321",
		payload: {
			title: "Just William"
		}
	};

	server.inject(opts, function (res) {

		res.payload = JSON.parse(res.payload);

		t.equals(res.statusCode, 404, "404 returned");
		t.ok(is.type(res.payload, "object"), "object returned");
		t.ok(!is.ok(res.payload), "object is empty");
		t.end();
	});
});

test("delete should return 200 and the document deleted if deleted", function (t) {

	var opts = {
		method: "DELETE",
		url: "/articles/1234"
	};

	server.inject(opts, function (res) {

		res.payload = JSON.parse(res.payload);

		t.equals(res.statusCode, 200, "200 returned");
		t.equals(res.payload.title, "Just William", "document deleted returned");
		t.end();
	});

});

test("delete should return 404 if not exists", function (t) {

	var opts = {
		method: "DELETE",
		url: "/articles/4321"
	};

	server.inject(opts, function (res) {

		res.payload = JSON.parse(res.payload);

		t.equals(res.statusCode, 404, "404 returned");
		t.ok(is.type(res.payload, "object"), "object returned");
		t.ok(!is.ok(res.payload), "object is empty");
		t.end();
	});
});



test("NOT A TEST: delete db", function (t) {

	var opts = {
		method: "DELETE",
		url: "http://127.0.0.1:9200/index/articles"
	};

	request(opts, function () {

		t.end();
	});
});