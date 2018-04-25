var mongodb = require('mongodb');
var db = require('monk')('mongodb://nhatnguyen:root@ds247439.mlab.com:47439/profile_database');

module.exports = db;