"use strict";

function asbestos (model) {


  return {

    create: function create (req, res) {

      model.create(req.payload, function (e, r) {

        return res(r);
      });
    },
    findOne: function findOne (req, res) {

      model.findOne({
        id: req.params.id
      }, function (e, r) {

        if (e) {
          return res(e).code(500);
        } else {
          return res(r);
        }
      });
    },
    update: function update (req, res) {

      model.update({
        id: req.params.id
      }, req.payload, function (e, r) {

        if (e) {
          return res(e).code(500);
        } else {
          return res(r);
        }
      });
    },
    del: function del (req, res) {

      model.del({
        id: req.params.id
      }, function (e, r) {

        if (e) {
          return res(e).code(500);
        } else {
          return res(r);
        }
      });
    }
  };
}

module.exports = asbestos;
