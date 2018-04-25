var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var mysql = require('mysql');
var mongoose = require('mongoose');
var mongodb = require('mongodb');
var db = require('../common/connect_mogodb.js');
const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function(req, file,cb){
		cb(null,file.fieldname + '-'+ Date.now()+path.extname(file.originalname));
	}
});

const upload = multer({storage:storage});


/* GET home page. */
router.get('/', function(req, res, next) {
	var profile = db.get('profile_collection');
	profile.find({},(err, results)=>{
		if(err) throw err;
		res.render('admin/index', {"data":results})
	})
});

router.get("/add", (req,res,next)=>{
	res.render('admin/add');
})



router.post("/add",upload.single('projectimg'),(req,res,next)=>{
	var title = req.body.title;
	var service = req.body.service;
	var client = req.body.client;
	var url = req.body.url;
	var descript = req.body.descript;
	var projectdate = req.body.projectdate;

	req.checkBody('title', 'Title is required').notEmpty();
	req.checkBody('service', 'Title is required').notEmpty();
	req.checkBody('client', 'Title is required').notEmpty();
	req.checkBody('url', 'Title is required').notEmpty();
	req.checkBody('descript', 'Title is required').notEmpty();
	req.checkBody('projectdate', 'Title is required').notEmpty();
	var arrError = req.validationErrors();

	if(req.file){
		console.log("Upload file ");
		var filename = req.file.filename;
	}else{
		console.log("No upload file");
		var filename = 'noimage.jpg';
	}

	if(arrError){
		console.log('err!');
		res.render('admin/add',{errors: arrError});
	}else{
		var profile = db.get('profile_collection');
		profile.insert({
			title: title,
			service: service,
			client: client,
			url: url,
			descript:descript,
			projectdate: projectdate,
			image: filename

		},(err, profile)=>{
			if(err) throw err;
			req.flash('success','Added');
			res.location('/admin');
			res.redirect('/admin');
		})
	}
})

router.get("/edit/:id", (req,res,next)=>{
	var id = req.params.id;
	var profileEdit = db.get('profile_collection');
	profileEdit.findOne({'_id': id},(err, result)=>{
		if(err) throw err;
		res.render('admin/edit',{'dataEdit':result});
	})
	
})

router.post("/edit/:id",upload.single('projectimg'),(req,res,next)=>{
	var title = req.body.title;
	var service = req.body.service;
	var client = req.body.client;
	var url = req.body.url;
	var descript = req.body.descript;
	var projectdate = req.body.projectdate;
	var idEdit = req.params.id;
	req.checkBody('title', 'Title is required').notEmpty();
	req.checkBody('service', 'Title is required').notEmpty();
	req.checkBody('client', 'Title is required').notEmpty();
	req.checkBody('url', 'Title is required').notEmpty();
	req.checkBody('descript', 'Title is required').notEmpty();
	req.checkBody('projectdate', 'Title is required').notEmpty();
	var arrError = req.validationErrors();

	if(req.file){
		console.log("Upload file ");
		var filename = req.file.filename;
	}else{
		console.log("No upload file");
		var filename = 'noimage.jpg';
	}

	if(arrError){
		res.redirect('/admin/edit/'+idEdit);
	}else{
		if(req.file){
			var updateEdit = {
				title: title,
				service: service,
				client: client,
				url: url,
				descript:descript,
				projectdate: projectdate,
				image: filename
			};
		}else{
			var updateEdit = {
				title: title,
				service: service,
				client: client,
				url: url,
				descript:descript,
				projectdate: projectdate
			};
		}
		var profile = db.get('profile_collection');
			profile.update({'_id': idEdit},{$set:updateEdit},(err, profile)=>{
				if(err) throw err;
			})
		req.flash('success','Updated');
		res.location('/admin');
		res.redirect('/admin');
	}
})

router.delete('/delete/:id', (req,res)=>{
	var id = req.params.id;
	var profileDelete = db.get('profile_collection');
	profileDelete.remove({'_id': id}, (err, result)=>{
		if(err) throw err;
	})
	res.sendStatus(200);
})
module.exports = router;
