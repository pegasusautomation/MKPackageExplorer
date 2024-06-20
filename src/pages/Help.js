import React from "react";
 
const Help = () => {
    return <table className="hopmepage" style={{paddingLeft: "40px"}}><br></br><b style={{ fontSize: '1.2em' }}>MK Support Package Analyzer</b><br>
    </br><br></br>
    This tool aims to simplify the process of analyzing support packages by providing intuitive search and analysis features. <br></br>
    Whether you're troubleshooting errors or conducting detailed inspections, our Support Package Analyzer offers the tools you need for effective package management.
    <br></br>
    <br></br>
    <b>Features:</b>
    <br></br>
    <div style={{paddingLeft: "50px", maxHeight:"400px", overflow:"auto"}}>
     <br></br>
     <b>1. Upload support packge:</b>
     <br></br>
     <br></br>
     <div style={{paddingLeft:"40px"}}>
     Download the package from the specified source.
     <br></br>
    Unzip the downloaded package file (package.Zip).
    <br></br>
    Extract the report needed for analysis.
    <br></br>
    Upload the extracted file in the "Upload Support Package" tab.
    <br></br>
    Navigate to "loganalysis" section to start analysing the package.
    <br></br>
    <br></br>
    </div>
    <b>2. Listing all files of uploaded Package:</b>
     <br></br>
     <br></br>
     <div style={{paddingLeft:"40px"}}>
     Type the file name in the search bar to locate the required file.
    <br></br>
    Choose the file from the search results.
    <br></br>
    Click on the "submit" button to view detailed data and analysis of the selected file.
    <br></br>
    <br></br>
    </div>
    <b>3. Search files by line:</b>
     <br></br>
     <br></br>
     <div style={{paddingLeft:"40px"}}>
     Type line in "Search by Line" search bar and click on "search" to list files.
    <br></br>
    Choose the file from the search results.
    <br></br>
    Click on file to view detailed data and analysis of the selected file.
    <br></br>
    <br></br>
    </div>
    <b>4. Search file data by keywords:</b>
     <br></br>
     <br></br>
     <div style={{paddingLeft:"40px"}}>
     After selecting a particular file, a "Select Keywords" pop up will appear.
    <br></br>
    Type a keyword to search in selected file.
    <br></br>
    Click on "Ok" button to view lines having that particular keyword.
    <br></br>
    <br></br>
    </div>
    <b>5. Filter data for specified time range:</b>
     <br></br>
     <br></br>
     <div style={{paddingLeft:"40px"}}>
     To filter data for a specified time range, access "From" and "To" for starting and ending time.
    <br></br>
    Select time manually or set time from the Calender.
    <br></br>
    Click on the "submit" button to view the file data for respective time range.
    <br></br>
    <br></br>
    </div>
    </div>
    </table>;
};
 
export default Help;