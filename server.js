const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const colors = require('colors')
const morgan = require('morgan')
const cors = require('cors');




// use dotenv files
dotenv.config({
  path: './config/config.env'
});

connectDB();

const app = express();



// Dev logging middleware
app.use(morgan('dev'));
// Body parser

// Body parser
app.use(express.json({
  extended: true
}));

// Cors
app.use(cors());


// app.use(express.static('paytm'))


// ********* Routers admin ******//
// admin auth
app.use('/admin/auth', require('./routes/Admin/auth'));

// admin task
app.use('/admin/task', require('./routes/Admin/tasks'));

// admin subtask
app.use('/admin/subtask', require('./routes/Admin/subtask'));

//admin banner
app.use('/admin/banner', require('./routes/Admin/banner'));


// SubTaskCategoryItems 

app.use('/admin/services', require('./routes/Admin/services'));

// User Auth
app.use('/user/auth', require('./routes/User/auth.js'))

// Cart
app.use('/admin', require('./routes/Admin/cart'));


// ********* Routers user *********//
app.use('/uploads', express.static('uploads'));
app.use('/uploads/banner', express.static('uploads/banner'));


app.use('/user/address', require('./routes/User/address'));

app.use('/user/order', require('./routes/User/order'));

// app.use('/user', require('./routes/User/payment'));

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      status: error.status || 500,
      message: error.message
    }
  })
})

const PORT = process.env.PORT || 3030;
const server = app.listen(PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);


// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // server.close(() => process.exit(1));
});