import "../Table.css";
import React ,{ useState } from "react";
import servertable from "./bitrate_hist_mksp1_active.json";
// import { data } from "autoprefixer";


const ITEMS_PER_PAGE = 10;
const Servertable = () => {
  // role=userData.role
  // const handleClick = (e) => {
  //   e.Status === "Running"
  //     ? console.log("Running")
  //     : alert("Your server restarted successfully!");
  // };
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('date');

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset current page when searching

    // Optional: You can apply debounce to limit the frequency of filter calls
    // debounceSearch(value);
  };

  const handleColumnChange = (event) => {
    setSearchColumn(event.target.value);
    setSearchTerm(''); // Clear search term when column changes
    setCurrentPage(1);
  }; 

  const filteredData = servertable.filter((item) => {
    const searchValue = item[searchColumn];

    // Handle filtering by other columns
    if (typeof searchValue === 'string') {
      return searchValue.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (typeof searchValue === 'number' && !isNaN(searchValue)) {
      // Handle filtering for numbers
      return searchValue === parseFloat(searchTerm);
    } else {
      // Handle other data types (e.g., booleans)
      return searchValue === searchTerm;
    }
  });
  
    // Convert the search value to a string
  //   const stringValue = String(searchValue);
  
  //   // Perform case-insensitive search
  //   return stringValue.toLowerCase().includes(searchTerm.toLowerCase());
  // });
  

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length);

  const handlePreviousPage = () => {
    setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages);
  };
  return (
    // CURRENT_USER_TYPE===<div>{userData.role}</div> ?
    <div className="column">
      {/* {servertable ? ( */}
        {/* <table className="table"> */}
          <caption className="caption">
            <b>
              <br></br>BITRATE DETAILS
            </b>
            <br></br>
            </caption>
            <br></br>
            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center'}}>
              <div style={{height:'20px'}}>
            {filteredData.length > 0 && (
            <select value={searchColumn} onChange={handleColumnChange} style={{ marginRight: '140px' }}>
          <option value="date">Date</option>
          <option value="fec_primary.br">fec_primary</option>
          <option value="fec_secondary.br">fec_secondary</option>
          <option value="null.br">null</option>
          <option value="psi.br">psi</option>
        </select>
            )}
            </div>
            <input className="searchstyle"
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ height: '20px', width: '200px', boxSizing: 'border-box' }}
      />
            </div>
          {filteredData.length === 0 && (
        <div style={{ textAlign: 'center', color: 'black' }}>No matching data found.</div>
      ) }
        {filteredData.length > 0 && (
           <table className="table">
          <thead>
          <tr>
            <th>Date</th>
            <th>fec_primary</th>
            <th>fec_secondary</th>
            <th>null</th>
            <th>psi</th>
          </tr>
          </thead>
          <tbody>
          {filteredData.slice(startIndex, endIndex).map((item, index) => (
            <tr key={item.index}>
              <td>{item.date}</td>
              <td>{item.fec_primary.br}</td>
              <td>{item.fec_secondary.br}</td>
              <td>{item.null.br}</td>
              <td>{item.psi.br}</td>
            </tr>
          ))}
        </tbody>
        </table>
        )}
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1 || filteredData.length === 0} style={{ color: currentPage === 1 || filteredData.length === 0 ? 'gray' : 'black', cursor: currentPage === 1 || filteredData.length === 0 ? 'default' : 'pointer' }}>{'<'}</button>
        <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages || filteredData.length === 0} style={{ color: currentPage === totalPages || filteredData.length === 0 ? 'gray' : 'black' , cursor: currentPage === totalPages || filteredData.length === 0 ? 'default' : 'pointer'  }}>{'>'}</button>
      </div>
    </div>
  );
};

export default Servertable;
