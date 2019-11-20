// vim: set ts=2 sw=2 et tw=80:

const debug = require('debug')('vimtok');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const nunjucks = require('nunjucks');
const session = require('express-session');
const cors = require('cors');
const flash = require('express-flash');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vimtok', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

//configure app
app.use(logger('dev'));
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.use(cors());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('public'));
app.use(session({
  secret: 'luciano-malusa-in-pensione',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}));

// Initialize routers here
const routers = require('./routes/routers');

app.use('/', routers.root);
app.use('/auth', routers.auth);

app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

// Socket.io code

const io = require('socket.io')(server);

let id = 1;

io.on('connection', (socket) => {
  console.log('client connected');

  socket.emit('sessionId', { id: id++ });

  socket.on('disconnect', () => {
    console.log('client disconnected');
  });
});

const eventBus = require('./pubsub');

module.exports = app;