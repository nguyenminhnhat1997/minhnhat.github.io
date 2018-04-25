var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var session = require('express-session');
var flash = require('connect-flash');
var multer = require('multer');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var expressValidator = require("express-validator");

// uplaod file
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file,cb){
    cb(null,file.fieldname + '-'+ Date.now()+path.extname(file.originalname));
  }
});

const upload = multer({storage:storage});

var app = express();

//express validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//connect flash
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


//session
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);




app.set('port',(process.env.PORT || 4600));
app.listen(app.get('port'), function(){
	console.log('Server started on port: '+app.get('port'));
})
module.exports = app;
