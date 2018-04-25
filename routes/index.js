var express = require('express');
var router = express.Router();
var db = require('../common/connect_mogodb.js');
/* GET home page. */
router.get('/', function(req, res, next) {
	var profile = db.get('profile_collection');
	profile.find({},(err,results)=>{
		if (err) throw err;
		console.log(results);
		res.render('index', {'data': results}) 
	})
});

router.get('/detail/:id', (req,res, next)=>{
	var id = req.params.id
	var detail = db.get('profile_collection');
	detail.findOne({'_id': id},(err, data)=>{
		if(err) throw err;
		console.log(data);
		res.render('details',{'dataprofile':data});
	})
})
module.exports = router;
