// import express from 'express';
// const app = express();
// import cors from 'cors';

// app.use(cors());

// app.post("/upload", (req, res) => {
//     // use modules such as express-fileupload, Multer, Busboy
    
//     setTimeout(() => {
//         console.log('file uploaded')
//         return res.status(200).json({ result: true, msg: 'file uploaded' });
//     }, 3000);
// });

// app.delete("/upload", (req, res) => {
//     console.log(`File deleted`)
//     return res.status(200).json({ result: true, msg: 'file deleted' });
// });

// app.listen(8000, () => {
//     console.log(`Server running on port 8000`)
// });

// server.mjs

// server.mjs

// server.mjs

// server.mjs

// server.mjs

// server.mjs

// server.js

// server.js

// import express from 'express';
// import { dirname, join } from 'path';
// import { fileURLToPath } from 'url';
// import multer from 'multer';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const app = express();
// const PORT = 8000;

// // Multer storage configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/'); // Destination folder
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });

// // Multer instance
// const upload = multer({ storage });

// // Route to handle folder upload
// app.post('/upload', upload.single('folder'), (req, res) => {
//   res.status(200).send('Folder uploaded successfully');
// });

// // Serve static files
// const publicPath = join(__dirname, 'public');
// app.use(express.static(publicPath));

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// import express from 'express';
// import multer from 'multer';
// import fs from 'fs';
// import unzipper from 'unzipper';

// const app = express();
// const PORT = 8000;

// const upload = multer({ dest: 'uploads/' }); // Temporary destination for uploaded zip files

// // Route to handle folder upload
// app.post('/upload', upload.single('folder'), (req, res) => {
//   const { path: zipFilePath } = req.file;

//   fs.createReadStream(zipFilePath)
//     .pipe(unzipper.Extract({ path: 'uploads' })) // Extract zip file contents to a directory
//     .on('close', () => {
//       // Remove the temporary zip file
//       fs.unlinkSync(zipFilePath);

//       res.status(200).send('Folder uploaded and extracted successfully');
//     })
//     .on('error', (err) => {
//       console.error('Error extracting folder:', err);
//       res.status(500).send('Error extracting folder');
//     });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });




// import express from 'express';
// import multer from 'multer';
// import fs from 'fs';
// import unzipper from 'unzipper';

// const app = express();
// const PORT = 8000;

// const upload = multer({ dest: 'uploads/' }); // Temporary destination for uploaded zip files

// // Route to handle folder upload
// app.post('/upload', upload.single('folder'), (req, res) => {
//   const { path: zipFilePath } = req.file;
//   const destinationFolder = 'uploads/folders';

//   // Remove previous folder if exists
//   if (fs.existsSync(destinationFolder)) {
//     try {
//       fs.rmSync(destinationFolder, { recursive: true, force: true });
//     } catch (err) {
//       if (err.code !== 'ENOTEMPTY') {
//         console.error('Error removing previous folder:', err);
//         return res.status(500).send('Error removing previous folder');
//       }
//     }
//   }

//   fs.mkdirSync(destinationFolder); // Recreate folder to avoid errors if it's deleted

//   fs.createReadStream(zipFilePath)
//     .pipe(unzipper.Extract({ path: destinationFolder })) // Extract zip file contents to a directory
//     .on('close', () => {
//       // Remove the temporary zip file
//       fs.unlinkSync(zipFilePath);

//       res.status(200).send('Folder uploaded and replaced successfully');
//     })
//     .on('error', (err) => {
//       console.error('Error extracting folder:', err);
//       res.status(500).send('Error extracting folder');
//     });
// });

// // // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });



// import express from 'express';
// import multer from 'multer';
// import fs from 'fs';
// import unzipper from 'unzipper';
// import { promisify } from 'util';
// import yauzl from 'yauzl';
// import { fileURLToPath } from 'url';
// import path from 'path';
// import tar from 'tar-stream';
// // import zlib from 'zlib';

// const app = express();
// const PORT = 8000;
// // // Get the current file's path
// // const __filename = fileURLToPath(import.meta.url);
// // // Get the directory path of the current file
// // const __dirname = path.dirname(__filename);

// const upload = multer({ dest: 'uploads/' }); // Temporary destination for uploaded zip files

// // Function to extract nested zip files
// const openZip = promisify(yauzl.open);

// async function extractNestedZip(source, destination) {
//   const zipFile = await openZip(source, { lazyEntries: true });

//   zipFile.readEntry();
//   zipFile.on('entry', function (entry) {
//     if (/\/$/.test(entry.fileName)) {
//       // Directory file names end with '/'
//       fs.mkdirSync(path.join(destination, entry.fileName), { recursive: true });
//       zipFile.readEntry();
//     } else if (entry.fileName.endsWith('.zip')) {
//       // If entry is a nested zip file, recursively extract it
//       zipFile.openReadStream(entry, function (err, readStream) {
//         if (err) throw err;
//         readStream.pipe(unzipper.Extract({ path: path.join(destination, path.dirname(entry.fileName)) }));
//         readStream.on('end', function () {
//           zipFile.readEntry();
//         });
//       });
//     } else {
//       zipFile.openReadStream(entry, function (err, readStream) {
//         if (err) throw err;

//         // Ensure parent directory exists
//         fs.mkdirSync(path.join(destination, path.dirname(entry.fileName)), { recursive: true });

//         readStream.on('end', function () {
//           zipFile.readEntry();
//         });

//         readStream.pipe(fs.createWriteStream(path.join(destination, entry.fileName)));
//       });
//     }
//   });

//   return new Promise((resolve, reject) => {
//     zipFile.on('end', () => {
//       zipFile.close();
//       resolve();
//     });

//     zipFile.on('error', (err) => {
//       reject(err);
//     });
//   });
// }

// const openZip = promisify(yauzl.open);

// async function extractNestedFiles(source, destination) {
//   const zipFile = await openZip(source, { lazyEntries: true });

//   zipFile.readEntry();
//   zipFile.on('entry', function (entry) {
//     if (/\/$/.test(entry.fileName)) {
//       // Directory file names end with '/'
//       fs.mkdirSync(path.join(destination, entry.fileName), { recursive: true });
//       zipFile.readEntry();
//     } else if (entry.fileName.endsWith('.zip')) {
//       // If entry is a nested zip file, recursively extract it
//       zipFile.openReadStream(entry, function (err, readStream) {
//         if (err) throw err;
//         readStream.pipe(unzipper.Extract({ path: path.join(destination, path.dirname(entry.fileName)) }));
//         readStream.on('end', function () {
//           zipFile.readEntry();
//         });
//       });
//     } else if (entry.fileName.endsWith('.tar')) {
//       // If entry is a nested tar file, extract it
//       const extractPath = path.join(destination, path.dirname(entry.fileName));
//       fs.mkdirSync(extractPath, { recursive: true });
//       zipFile.openReadStream(entry, async function (err, readStream) {
//         if (err) throw err;
//         const extract = tar.extract();
//         readStream.pipe(extract);
//         extract.on('entry', (header, stream, next) => {
//           const filePath = path.join(extractPath, header.name);
//           if (header.type === 'directory') {
//             fs.mkdirSync(filePath, { recursive: true });
//             next();
//           } else {
//             stream.pipe(fs.createWriteStream(filePath)).on('finish', next);
//           }
//         });
//         extract.on('finish', () => zipFile.readEntry());
//       });
//     } else {
//       zipFile.openReadStream(entry, function (err, readStream) {
//         if (err) throw err;

//         // Ensure parent directory exists
//         fs.mkdirSync(path.join(destination, path.dirname(entry.fileName)), { recursive: true });

//         readStream.on('end', function () {
//           zipFile.readEntry();
//         });

//         readStream.pipe(fs.createWriteStream(path.join(destination, entry.fileName)));
//       });
//     }
//   });

//   return new Promise((resolve, reject) => {
//     zipFile.on('end', () => {
//       zipFile.close();
//       resolve();
//     });

//     zipFile.on('error', (err) => {
//       reject(err);
//     });
//   });
// }
// Route to handle folder upload
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import unzipper from 'unzipper';
import { promisify } from 'util';
import yauzl from 'yauzl';
import { fileURLToPath } from 'url';
import path from 'path';
import tar from 'tar-stream';

const app = express();
const PORT = 8000;

// Define __dirname globally
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ dest: 'uploads/' }); // Temporary destination for uploaded zip files

// Function to extract nested zip files
const openZip = promisify(yauzl.open);

async function extractNestedZip(source, destination) {
  const zipFile = await openZip(source, { lazyEntries: true });

  zipFile.readEntry();
  zipFile.on('entry', function (entry) {
    if (/\/$/.test(entry.fileName)) {
      // Directory file names end with '/'
      fs.mkdirSync(path.join(destination, entry.fileName), { recursive: true });
      zipFile.readEntry();
    } else if (entry.fileName.endsWith('.zip')) {
      // If entry is a nested zip file, recursively extract it
      zipFile.openReadStream(entry, function (err, readStream) {
        if (err) throw err;
        readStream.pipe(unzipper.Extract({ path: path.join(destination, path.dirname(entry.fileName)) }));
        readStream.on('end', function () {
          zipFile.readEntry();
        });
      });
    } else {
      zipFile.openReadStream(entry, function (err, readStream) {
        if (err) throw err;

        // Ensure parent directory exists
        fs.mkdirSync(path.join(destination, path.dirname(entry.fileName)), { recursive: true });

        readStream.on('end', function () {
          zipFile.readEntry();
        });

        readStream.pipe(fs.createWriteStream(path.join(destination, entry.fileName)));
      });
    }
  });

  return new Promise((resolve, reject) => {
    zipFile.on('end', () => {
      zipFile.close();
      resolve();
    });

    zipFile.on('error', (err) => {
      reject(err);
    });
  });
}

app.post('/upload', upload.single('folder'), async (req, res) => {
  const { path: zipFilePath } = req.file;

  // Construct the destination folder path
  const destinationFolder = path.join(__dirname, '../../public/uploads/folders');

  // Remove previous folder if exists
  if (fs.existsSync(destinationFolder)) {
    try {
      fs.rmSync(destinationFolder, { recursive: true, force: true });
    } catch (err) {
      if (err.code !== 'ENOTEMPTY') {
        console.error('Error removing previous folder:', err);
        return res.status(500).send('Error removing previous folder');
      }
    }
  }

  fs.mkdirSync(destinationFolder, { recursive: true }); // Recreate folder to avoid errors if it's deleted

  try {
    await extractNestedZip(zipFilePath, destinationFolder);

    // Remove the temporary zip file
    fs.unlinkSync(zipFilePath);

    res.status(200).send('Folder uploaded and replaced successfully');
  } catch (err) {
    console.error('Error extracting folder:', err);
    res.status(500).send('Error extracting folder');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
