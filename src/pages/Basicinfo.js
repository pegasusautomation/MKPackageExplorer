import React, { useEffect, useState } from 'react';
import axios from 'axios';

const extractDesiredInfo = (text) => {
    const sections = {
      supportPackage: '',
      localTime: '',
      utcTime: '',
      timezone: '',
      browserLocalDate: '',
      full: '',
      sn: '',
      pn: '',
      osIdentification: '',
      mfvpSoftware: '',
      osInformation: '',
      localTimeEnd: '',
      utcTimeEnd: '',
    };
  
    const lines = text.split('\n');
  
    let isMfvpSoftware = false;

    for (let line of lines) {
      if (line.startsWith('Support package')) {
        sections.supportPackage = line;
      } else if (line.startsWith('Local:') && !sections.localTime) {
        sections.localTime = line;
      } else if (line.startsWith('UTC:') && !sections.utcTime) {
        sections.utcTime = line;
      } else if (line.startsWith('TIMEZONE:') && !sections.timezone) {
        sections.timezone = line;
      } else if (line.startsWith('Browser Local Date:') && !sections.browserLocalDate) {
        sections.browserLocalDate = line;
      } else if (line.startsWith('Full :') && !sections.full) {
        sections.full = line;
      } else if (line.startsWith('SN :') && !sections.sn) {
        sections.sn = line;
      } else if (line.startsWith('PN :') && !sections.pn) {
        sections.pn = line;
      } else if (line.startsWith('OS identification :') && !sections.osIdentification) {
        sections.osIdentification = line;
      } else if (line.startsWith('[MFVP_SOFTWARE] :')) {
        isMfvpSoftware = true;
        let index = lines.indexOf(line) + 1;
        while (index < lines.length && !lines[index].startsWith('ServerID =') && !lines[index].startsWith('[OS_INFORMATION] :')) {
          sections.mfvpSoftware += lines[index] + '\n';
          index++;
        }
        isMfvpSoftware = false;  // Stop processing after capturing the section
      } else if (line.startsWith('[OS_INFORMATION] :') && !sections.osInformation) {
        let index = lines.indexOf(line) + 1;
        while (lines[index] && !lines[index].startsWith('Local:')) {
          sections.osInformation += lines[index] + '\n';
          index++;
        }
      } else if (line.startsWith('Local:') && !sections.localTimeEnd) {
        sections.localTimeEnd = line;
      } else if (line.startsWith('UTC:') && !sections.utcTimeEnd) {
        sections.utcTimeEnd = line;
      }
    }
  
    return sections;
  };
  
  const Basicinfo = () => {
    const [fileContent, setFileContent] = useState('');
    const [info, setInfo] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchFileContent = async () => {
        try {
          const response = await axios.get('/read-file');
          setFileContent(response.data);
          const extractedInfo = extractDesiredInfo(response.data);
          setInfo(extractedInfo);
        } catch (err) {
          console.error('Error fetching file content:', err);
          setError('Error fetching file content');
        }
      };
  
      fetchFileContent();
    }, []);
  
    if (error) return <p className="error">{error}</p>;
  
  

    return (
        
        <div style={{width:"1050px",height:"540px",overflow:"auto"}}> {/* Apply a class for centering */}
            <caption style={{fontSize:'30px',marginLeft:'400px',whiteSpace:"nowrap"}}><b>Basic Information</b></caption>
          <br></br>
          {info ? (
        <div>
          <p>{info.supportPackage}</p>
          <br></br>
          <p><strong>Local:</strong> {info.localTime.replace('Local:', '').trim()}</p>
          <br></br>
          <p><strong>UTC:</strong> {info.utcTime.replace('UTC:', '').trim()}</p>
          <br></br>
          <p><strong>TIMEZONE:</strong> {info.timezone.replace('TIMEZONE:', '').trim()}</p>
          <br></br>
          <p><strong>Browser Local Date:</strong> {info.browserLocalDate.replace('Browser Local Date:', '').trim()}</p>
          <br></br>
          <p><strong>Full :</strong> {info.full.replace('Full :', '').trim()}</p>
          <br></br>
          <p><strong>SN :</strong> {info.sn.replace('SN :', '').trim()}</p>
          <br></br>
          <p><strong>PN :</strong> {info.pn.replace('PN :', '').trim()}</p>
          <br></br>
          <p><strong>OS identification :</strong> {info.osIdentification.replace('OS identification :', '').trim()}</p>
          <br></br>
          <h3>[MFVP_SOFTWARE]</h3>
          <br></br>
          <pre>{info.mfvpSoftware.trim()}</pre>
          <br></br>
          <h3>[OS_INFORMATION]</h3>
          <br></br>
          <pre>{info.osInformation.trim()}</pre>
          <br></br>
          <p><strong>Local:</strong> {info.localTimeEnd.replace('Local:', '').trim()}</p>
          <br></br>
          <p><strong>UTC:</strong> {info.utcTimeEnd.replace('UTC:', '').trim()}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
        </div>
    );
};

export default Basicinfo;

  