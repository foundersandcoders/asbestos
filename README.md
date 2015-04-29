# asbestos
Generate hapi CRUD handler functions from a model constructor function

## use
```js

var route = {
  method: "POST",
  path: "/models",
  handler: handlers.create
}

// model constructor function
var model = {

  // model must expose create method
  create: function (obj, cb) {

    //... do some db stuff
    return cb("created");
  },

  // model must expose findOne method
  findOne: function (criteria, cb) {

    //... do some db stuff
    return cb("found");
  },

  // model must expose update method
  update: function (criteria, changes, cb) {

    //... do some db stuff
    return cb("updated");
  },

  // model must expose delete method
  del: function (criteria, cb) {

    //... do some db stuff
    return cb("deleted");
  }
}

var handlers = require("asbestos")(model);

```

## api

asbestos exposes a single function that returns on object with 4 methods:
1. ```.create```,
2. ```.findOne```,
3. ```.update```,
4. ```.del```

### createHandlers(fn)

**_params_**

```fn```: the constructor function that returns an object with create, findOne, update, and delete methods.

**_returns_**

An object with 4 methods:

```.create(req, res)```: a function that takes a hapi request and response object. It passes req.payload to the constructor's create method and forwards the create method's response to the response parameter.

```.findOne(req, res)```: a function that takes a hapi request and response object. It passes req.params.id to the constructor's findOne method and forwards the findOne method's response to the response parameter.

```.update(req, res)```: a function that takes a hapi request and response object. It passes req.params.id and req.payload to the constructor's update method and forwards the update method's response to the response parameter.

```.delete(req, res)```: a function that takes a hapi request and response object. It passes req.id to the constructor's delete method and forwards the delete method's response to the response parameter.

## license

MIT
