import React, { useState, useEffect } from 'react';

const Spdetails = () => {
  const [extractedData, setExtractedData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/uploads/folders/support[]4e-503335-20240315113746/report/README.txt');
        const data = await response.text();
        const extractedData = extractData(data);
        setExtractedData(extractedData);
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    };

    fetchData();
  }, []);

  const extractData = (data) => {
    const localPattern = /Local:\s+(\d{4}-\d{2}-\d{2}\s+\(\d{2}-\d{2}-\d{2}\))/;
    const utcPattern = /UTC:\s+(\d{4}-\d{2}-\d{2}\s+\(\d{2}-\d{2}-\d{2}\))/;
    const snPattern = /SN\s*:\s*([\w-]+)/;
    const osPattern = /OS identification\s*:\s*(.*?)\n/;
    const softwarePattern = /name\s*=\s*(.*?)\s*version\s*=\s*(.*?)\n/g;

    const localMatch = data.match(localPattern);
    const utcMatch = data.match(utcPattern);
    const snMatch = data.match(snPattern);
    const osMatch = data.match(osPattern);
    const softwareMatches = [];
    let match;
    while ((match = softwarePattern.exec(data)) !== null) {
      const [, name, version] = match;
      softwareMatches.push({ name: name.trim(), version: version.trim() });
    }

    return {
      local: localMatch ? localMatch[1] : null,
      utc: utcMatch ? utcMatch[1] : null,
      sn: snMatch ? snMatch[1] : null,
      os: osMatch ? osMatch[1] : null,
      software: softwareMatches,
    };
  };

  return (
    <div style={{  padding: '50px' ,margin:'30px'}}>
      <h2><u>Support Package Details:</u></h2>
      <br></br><br></br>
      {extractedData && (
        <div>
          <p><b>Local:</b> {extractedData.local}</p>
          <br></br>
          <p><b>UTC:</b>{extractedData.utc}</p>
          <br></br>
          <p><b>SN:</b> {extractedData.sn}</p>
          <br></br>
          <p><b>OS Identification:</b> {extractedData.os}</p>
          <br></br>
          <h3>Software Versions:</h3>
          <br></br>
          <ul>
            {extractedData.software && extractedData.software.length > 0 ? (
              extractedData.software.map((software, index) => (
                <li key={index}>
                  <strong>{software.name}:</strong> {software.version}
                </li>
              ))
            ) : (
              <li>No software information available</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Spdetails;
