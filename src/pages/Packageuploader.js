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

import React, { useState, useEffect,useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios'; // Import axios for making HTTP requests
// import "./Packageuploader.css"

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
  const [packageInfo, setPackageInfo] = useState(null);

  useEffect(() => {
    const text = `Support package started: 2024-02-09T06:04:37.812579
Added collector: DatabaseCollector
Added collector: LogsCollector
Added collector: PackagerCollector
Added collector: EncodingLiveCollector
Added collector: AlarmsCollector
Added collector: StreamProcessorCollector
Added collector: KubeCollector
Added collector: HostCollector
Added collector: RabbitMQCollector
Support package ended: 2024-02-09T06:05:19.224497`;

    const lines = text.split('\n');

    let startDate, endDate;

    for (let line of lines) {
      if (line.includes('Support package started')) {
        startDate = line.split(': ')[1];
      } else if (line.includes('Support package ended')) {
        endDate = line.split(': ')[1];
      }
    }

    if (startDate && endDate) {
      setPackageInfo({ startDate, endDate });
    }
  }, []);



  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{marginLeft:'90px'}}>
      {/* added now */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '-5px' }}>
        <p style={{ marginRight: '100px',marginBottom:'-85px' }}><b>Upload Support Package</b></p>
        <div><button {...getRootProps()} style={{
          border: '2px solid #cccccc',
          borderRadius: '8px',
          padding: '20px',
          width: '275px',
          fontSize: '20px',
          cursor: 'pointer',
          margin: '100px',
          marginLeft: '80px',
          alignContent: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          background: 'rgb(105, 88, 154)',
          marginBottom:'20px'
        }}>
          {/* Apply CSS class */}
          <input {...getInputProps()} />
          <p style={{
            position: 'relative',
            top: '50%',
            left: '50%',
            right: '20%',
            transform: 'translate(-50%, -50%)',
            fontSize: '20px'
          }}>Upload Your Package</p>
        </button>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <p style={{ marginRight: '130px'}}><b>Support Package Creation Time</b></p>
        <div style={{ border: '1px solid black', padding: '5px', backgroundColor: 'rgb(105, 88, 154)', color: 'white', marginLeft: '-5px',width:'273px' }}>
          {packageInfo ? packageInfo.endDate : "Loading package info..."}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <p style={{ marginRight: '230px' }}><b>Reported Issue</b></p>
        <div><input style={{ border: '1px solid black', padding: '5px', backgroundColor: 'rgb(105, 88, 154)', color: 'white',marginLeft:'30px',width:'273px' }}>
        </input></div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <p style={{ marginRight: '115px' }}><b>Reported Issue Date and Time</b></p>
        <div><input style={{ border: '1px solid black', padding: '5px', backgroundColor: 'rgb(105, 88, 154)', color: 'white',marginLeft:'24px' ,width:'273px'}}>
        </input></div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <p style={{ marginRight: '40px' }}><b>Reported Issue Date and Time threshold</b></p>
        <div><input style={{ border: '1px solid black', padding: '5px', backgroundColor: 'rgb(105, 88, 154)', color: 'white' ,marginLeft:'16px',width:'273px'}}>
        </input></div>
      </div>
      </div>
    </div>
  );
        };  
export default Packageuploader;


