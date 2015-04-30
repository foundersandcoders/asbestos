# asbestos
Generate hapi CRUD handler functions from a model constructor function

## use
```js

var route = {
  method: "POST",
  path: "/models",
  handler: handlers.create
}

// model prototype
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

  // model must expose search method
  find: function (criteria, cb) {

    //... do some db stuff
    return cb("deleted");
  }
}

var handlers = require("asbestos")(model);

```

## api

asbestos exposes a single function that returns on object with 5 methods:
1. ```.create```
2. ```.find```
3. ```.findOne```
4. ```.update```
5. ```.del```

### createHandlers(obj)

**_params_**

```obj```: an object with create, find, findOne, update, and del methods.

**_returns_**

An object with 5 methods:

```.create(req, res)```: a hapi handler function. It passes req.payload to the constructor's create method. It returns the object just created on success.

```.find(req, res)```: a hapi handler function. It passes req.query to the constructor's find method. It returns the matched documents on success. It returns an empty array if not found.

```.findOne(req, res)```: a hapi handler function. It passes req.params.id to the constructor's findOne method. It returns the matched document on success. It returns an empty object and a 404 if not found.

```.update(req, res)```: a hapi handler function. It passes req.params.id and req.payload to the constructor's update method. It returns the updated document on success. It returns an empty object and a 404 if not found.

```.del(req, res)```: a hapi handler function. It passes req.params.id to the constructor's delete method. It returns the deleted document on success. It returns an empty object and a 404 if not found.

## license

MIT
