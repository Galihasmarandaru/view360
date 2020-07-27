const express = require('express');
const multer = require('multer');
const fs = require('fs');
// const ejs = require('ejs');
const path = require('path');

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './static/public/uploads/',
  filename: function (req, file, cb) {
    cb(
      null,
      //   file.fieldname + '-' + Date.now() + path.extname(file.originalname)
      'cube.jpg'
    );
  },
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('myImage');

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Init app
const app = express();

app.use('/static', express.static('./static/'));

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./static'));

app.get('/', (req, res) => res.render('index'));

app.get('/view360', (req, res) => {
  const tempView = fs.readFileSync(`${__dirname}/index.html`, 'utf-8');
  return res.end(tempView);
});

app.get('/demo360', (req, res) => {
  const tempView = fs.readFileSync(`${__dirname}/demo.html`, 'utf-8');
  return res.end(tempView);
});

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render('index', {
        msg: err,
      });
    } else {
      if (req.file == undefined) {
        res.render('index', {
          msg: 'Error: No File Selected!',
        });
      } else {
        const tempView = fs.readFileSync(`${__dirname}/index.html`, 'utf-8');
        return res.end(tempView);
        // res.render('view360.html');
        // , {
        //     msg: 'File Uploaded!',
        //     file: `uploads/${req.file.filename}`,
        //   }
      }
    }
  });
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
