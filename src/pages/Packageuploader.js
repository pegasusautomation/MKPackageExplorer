// import React,{useState}from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faPlus } from '@fortawesome/free-solid-svg-icons'
// import './FileUpload.css'
// import FileItem from './Fileitem'
// import axios from 'axios'

// const Packageuploader = () => {
//     const [files, setFiles] = useState([])

//   const removeFile = (filename) => {
//     setFiles(files.filter(file => file.name !== filename))
//   }
//     const uploadHandler = (event) => {
//         const file = event.target.files[0];
//         if(!file) return;
//         file.isUploading = true;
//         setFiles([...files, file])

//         // upload file
//         const formData = new FormData();
//         formData.append(
//             "newFile",
//             file,
//             file.name
//         )
//         axios.post('http://localhost:8000/upload', formData)
//             .then((res) => {
//                 file.isUploading = false;
//                 setFiles([...files, file])
//             })
//             .catch((err) => {
//                 // inform the user
//                 console.error(err)
//                 removeFile(file.name)
//             });
//     }
//     const deleteFileHandler = (_name) => {
//         axios.delete(`http://localhost:8000/upload?name=${_name}`)
//             .then((res) => removeFile(_name))
//             .catch((err) => console.error(err));
//     }

//     return (
//         <>
//        <h1 style={{fontSize:'25px',textAlign:'center'}}><b>Upload a File</b></h1>
//         <br></br><br></br>
//             <div className="file-card" style={{marginLeft:'70px'}}>
//                 <div className="file-inputs">
//                     <input type="file" onChange={uploadHandler} className='input'/>
//                     <button className='button'>
//                         <i className='i'>
//                             <FontAwesomeIcon icon={faPlus} />
//                         </i>
//                         Upload
//                     </button>
//                 </div>

//                 <p className="main">Supported files</p>
//                 <p className="info">PDF, JPG, json</p>
          
//                 <ul className="file-list">
//             {
//                 files &&
//                 files.map(f => (<FileItem
//                     key={f.name}
//                     file={f}
//                     deleteFile={deleteFileHandler} />))
//             }
//         </ul>

//             </div>
//         </>
//     )
// }

// export default Packageuploader

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios'; // Import axios for making HTTP requests

const Packageuploader = () => {
  const onDrop = useCallback((acceptedFiles) => {
    // Create FormData object to append files/folders
    const formData = new FormData();
    formData.append('folder', acceptedFiles[0]); // Assuming only one folder is dropped

    // Make a POST request to the backend
    axios.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Set content type to multipart/form-data
      }
    }).then(response => {
      // Handle response from the backend if needed
      console.log(response.data);
    }).catch(error => {
      // Handle error if request fails
      console.error('Error uploading folder:', error);
    });
  }, []);

  const {getRootProps, getInputProps} = useDropzone({ onDrop, multiple: false, directory: true });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop a Package here, or click to select a folder</p>
    </div>
  );
};

export default Packageuploader;


