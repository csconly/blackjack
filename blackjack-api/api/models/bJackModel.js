
'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
  name: {
    type: String,
    required: 'username'
  },
  password: {
    type: String,
    required: 'password'
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
//   status: {
//     type: [{
//       type: String,
//       enum: ['pending', 'ongoing', 'completed']
//     }],
//     default: ['pending']
//   }
});

module.exports = mongoose.model('Users', userSchema);