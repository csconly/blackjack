'use strict';
module.exports = function(app) {
  var bJack = require('../controllers/bJackControl');

  // todoList Routes
  app.route('/users')
    .get(bJack.list_all_users)
    .post(bJack.create_a_user);


  app.route('/users/:userId')
    .get(bJack.read_a_user)
    .put(bJack.update_a_user)
    .delete(bJack.delete_a_user);
};