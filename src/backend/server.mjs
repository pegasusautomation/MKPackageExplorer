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
// import tar from 'tar-stream';
import { parse } from 'date-fns';

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



const extractDatesFromFileContent = (fileContent) => {
  const datePatterns = [
    { regex: /\b([A-Za-z]{3} \d{1,2}, \d{4} \d{1,2}:\d{2} (AM|PM))\b/g, format: "MMM d, yyyy h:mm aa" }, // Mar 14, 2024 12:00 AM
    { regex: /\b([A-Za-z]{3}\s{1,2}\d{1,2}\s{1,2}\d{4}\s{1,2}\d{2}:\d{2}:\d{2})\b/g, format: "MMM d yyyy HH:mm:ss" }, // Apr 5 2023 17:18:30
    { regex: /\b(\d{2}\/\d{2}\/\d{4}-\d{2}:\d{2}:\d{2})\b/g, format: "MM/dd/yyyy-HH:mm:ss" }, // 05/24/2021-02:54:22
    { regex: /\b([A-Za-z]{3} \d{1,2} \d{2}:\d{2}:\d{2}\.\d{6} \d{4})\b/g, format: "MMM d HH:mm:ss.SSSSSS yyyy" }, // May 11 23:08:15.846704 2022
    { regex: /\b([A-Za-z]{3} \d{1,2} \d{2}:\d{2}:\d{2} \d{4})\b/g, format: "MMM d HH:mm:ss yyyy" }, // May 23 19:35:00 2021
    { regex: /\b(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})\b/g, format: "yyyy-MM-dd'T'HH:mm:ss" }, // 2024-03-15T02:39:14.100Z
    { regex: /\b(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3})\b/g, format: "yyyy-MM-dd'T'HH:mm:ss.SSS" }, // 2024-03-15T09:48:50.288+09:00
    { regex: /\b(\d{2}\/[A-Za-z]{3}\/\d{4}:\d{2}:\d{2}:\d{2})\b/g, format: "dd/MMM/yyyy:HH:mm:ss" }, // 15/Mar/2024:11:37:38
    { regex: /\b(\d{4}-\d{2}-\d{2}\s{1,2}\d{2}:\d{2}:\d{2})\b/g, format: "yyyy-MM-dd HH:mm:ss" }, // 2023-05-30 02:21:16,214
  ];

  const dates = [];
  for (const { regex, format } of datePatterns) {
    let match;
    while ((match = regex.exec(fileContent)) !== null) {
      const cleanedDateStr = match[1].replace(/\s{2,}/g, ' '); // Replace multiple spaces with single space
      const date = parse(cleanedDateStr, format, new Date());
      if (!isNaN(date)) {
        dates.push(date);
      }
    }
  }
  return dates;
};

app.post('/upload', upload.single('folder'), async (req, res) => {
  const { path: zipFilePath } = req.file;

  // Construct the destination folder path
  const destinationFolder = path.join(__dirname, '../../src/uploads/folders');

  try {
    // Remove previous folder if exists
    if (fs.existsSync(destinationFolder)) {
      fs.rmSync(destinationFolder, { recursive: true, force: true });
    }

    // Recreate the destination folder
    fs.mkdirSync(destinationFolder, { recursive: true });

    // Extract the new zip file
    await extractNestedZip(zipFilePath, destinationFolder);

    // Remove the temporary zip file
    fs.unlinkSync(zipFilePath);

    res.status(200).send('Folder uploaded and replaced successfully');
  } catch (err) {
    console.error('Error processing the upload:', err);
    res.status(500).send('Error processing the upload');
  }
});

// Route to list files for dropdown menu
app.get('/list-files', (req, res) => {
  const destinationFolder = path.join(__dirname, '../../src/uploads/folders');

  // Function to list files recursively
  function listFiles(directory) {
    let files = [];

    fs.readdirSync(directory).forEach(file => {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        files = files.concat(listFiles(filePath));
      } else {
        files.push(file);
      }
    });

    return files;
  }

 
  // Get list of files and send as response
  const files = listFiles(destinationFolder);
  res.json({ files });
});



// Route to handle file search
app.get('/search', (req, res) => {
  const { query } = req.query;
  const destinationFolder = path.join(__dirname, '../../src/uploads/folders');
  const lowerCaseQuery = query.toLocaleLowerCase();

  // Function to list files recursively
  function listFiles(directory) {
    let files = [];

    fs.readdirSync(directory).forEach(file => {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        files = files.concat(listFiles(filePath));
      } else {
        files.push(path.relative(destinationFolder, filePath).toLocaleLowerCase());
      }
    });

    return files;
  }

  // Search for files matching the query
  const files = listFiles(destinationFolder).filter(file => file.includes(lowerCaseQuery));

  res.json({ files });
});

// Define the base directory
const baseDirectory = path.resolve(__dirname, '../../src/uploads/folders');

app.get('/file-data', (req, res) => {
  const { file } = req.query;

  if (!file) {
    console.error('No file specified');
    return res.status(400).send('No file specified');
  }

  // Construct the full file path
  const filePath = path.join(baseDirectory, file);

  // Log the file path to debug
  console.log('Requested File Path:', filePath);

  // Check if the path is a directory
  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error('Error checking file stats:', err);
      return res.status(500).send('Error checking file stats');
    }

    if (stats.isDirectory()) {
      console.error('Error: Path is a directory, not a file:', filePath);
      return res.status(400).send('Path is a directory, not a file');
    }

    // Read data from the selected file
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return res.status(500).send('Error reading file');
      } else {
        try {
          const jsonData = JSON.parse(data);
          res.json(jsonData);
        } catch (jsonErr) {
          // If not JSON, send as plain text
          res.send(data);
        }
      }
    });
  });
});

app.get('/search-by-line', (req, res) => {
  const { query } = req.query;
  const destinationFolder = path.join(__dirname, '../../src/uploads/folders');

  if (!query) {
    return res.status(400).send('No search query provided');
  }

  // Function to list files recursively
  function listFiles(directory) {
    let files = [];

    fs.readdirSync(directory).forEach(file => {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        files = files.concat(listFiles(filePath));
      } else {
        files.push(filePath);
      }
    });

    return files;
  }
  const decodedQuery = decodeURIComponent(query).toLocaleLowerCase();
  // Search for files containing the exact query line
  const files = listFiles(destinationFolder).filter(file => {
    const fileContent = fs.readFileSync(file, 'utf8').toLocaleLowerCase();
    return fileContent.includes(decodedQuery);
  }).map(file => path.relative(destinationFolder, file));

  res.json({ files });
});

app.get('/global-search', async (req, res) => {
  const { fromDate, toDate } = req.query;

  if (!fromDate || !toDate) {
    return res.status(400).json({ error: 'Missing fromDate or toDate' });
  }

  const fromDateObj = parse(fromDate, "MMM d, yyyy h:mm aa", new Date());
  const toDateObj = parse(toDate, "MMM d, yyyy h:mm aa", new Date());

  // console.log(`Searching files between ${fromDateObj} and ${toDateObj}`);

  const filesDir = path.join(__dirname, '../../src/uploads/folders');

  let matchingFiles = [];

  const searchFiles = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        searchFiles(filePath);
      } else {
        
        const content = fs.readFileSync(filePath, 'utf-8');
        const dates = extractDatesFromFileContent(content);
          for (const date of dates){
            // console.log(`Checking date ${date} in file ${filePath}`);
          if (date >= fromDateObj && date <= toDateObj) {
            // console.log(`Date ${date} in file ${filePath} is within range`);
            // Push relative path to filesDir into matchingFiles
            matchingFiles.push(path.relative(filesDir, filePath));
            break;
          } else {
            // console.log(`Date ${date} in file ${filePath} is out of range`);
          }
        }
      }
    });
  };

  searchFiles(filesDir);
  // console.log(`Matching files: ${matchingFiles}`);

  res.json({ files: matchingFiles });
});

app.get('/search-line', async (req, res) => {
  const { query, files } = req.query;
  const destinationFolder = path.join(__dirname, '../../src/uploads/folders');

  if (!query || !Array.isArray(files)) {
    return res.status(400).send('Invalid request');
  }
  const decodedQuery = decodeURIComponent(query).toLocaleLowerCase();
  const matchingFiles = files.filter(file => {
    const filePath = path.join(destinationFolder, file);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8').toLocaleLowerCase();
      return fileContent.includes(decodedQuery);
    }
    return false;
  });

  res.json({ files: matchingFiles });
});
//C:\MKPackageExplorer\src\uploads\folders\support[]4e-503335-20240315113746\report\README.txt
app.get('/read-file', (req, res) => {
  const filePath = path.join(__dirname, '../../src/uploads/folders/support[]4e-503335-20240315113746/report/README.txt');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Error reading file');
    }
    res.send(data);
  });
});

app.get('/alarm-log', (req, res) => {
  const filePath = path.join(__dirname, '../../src/uploads/folders/support[]4e-503335-20240315113746/report/var/log/ericsson/alarm/private/alarm-legacy-collector.log');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          return res.status(500).send('Error reading file');
      }
      res.send(data);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
