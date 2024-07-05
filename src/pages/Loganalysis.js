import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Loganalysis = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedLineFile, setSelectedLineFile] = useState("");
  const [fileData, setFileData] = useState("");
  const [filteredData, setFilteredData] = useState("");
  const [keyword, setKeyword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isJsonFile, setIsJsonFile] = useState(false);
  const [showTableView, setShowTableView] = useState(false);
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [allKeywords, setAllKeywords] = useState([]);
  const [suggestedKeywords, setSuggestedKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLineSearchPopup, setShowLineSearchPopup] = useState(false);
  const [lineSearchQuery, setLineSearchQuery] = useState("");
  const [lineSearchResults, setLineSearchResults] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [hoveredFile, setHoveredFile] = useState(null); // New state for hovered file

  useEffect(() => {
    const fetchInitialFiles = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/list-files");
        setSearchResults(response.data.files);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Error fetching files");
      }
    };
    fetchInitialFiles();
  }, []);

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const fetchFiles = async (query) => {
    try {
      setLoading(true);
      const response = await axios.get(`/search?query=${query}`);
      setSearchResults(response.data.files);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Error fetching files");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchFiles(query);
  };

  const handleFileSelect = (event) => {
    const file = event.target.value;
    setSelectedFile(file);
    console.log("Selected file:", file);
  };

  useEffect(() => {
    console.log("Filtered data has changed:", filteredData);
  }, [filteredData]);

  const handleSubmit = async () => {
    try {
      if (!selectedFile) {
        console.error("No file selected");
        return;
      }
      console.log("Submitting file:", selectedFile);
      setLoading(true);
      const response = await axios.get(
        `/file-data?file=${encodeURIComponent(selectedFile)}`
      );

      let fileContent = response.data;

      if (typeof fileContent === "object") {
        fileContent = JSON.stringify(fileContent, null, 2);
        setIsJsonFile(true);
      } else {
        setIsJsonFile(false);
      }

      setFileData(fileContent);
      const filteredContent = filterDataByDate(fileContent, fromDate, toDate);
      setFilteredData(filteredContent);
      extractKeywords(filteredContent);
      setIsSubmitted(true);
      setShowKeywordModal(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Error fetching file data");
    }
  };

  const filterDataByDate = (data, fromDate, toDate) => {
    if (!fromDate || !toDate) {
      return data;
    }

    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    const filteredLines = data.split("\n").filter((line) => {
      // Match patterns like "Jan 27 10:05:58" or "[Tue Jan 27 10:05:58 2024]"
      const match = line.match(
        /^(\w{3} \d{2} \d{2}:\d{2}:\d{2}|\[\w{3} \w{3} \d{2} \d{2}:\d{2}:\d{2} \d{4}\])/
      );
      if (match) {
        const dateStr = match[0];

        // Handle both formats by extracting the relevant parts and creating Date objects
        let date;
        if (dateStr.startsWith("[")) {
          // Extract date part for format "[Tue Jan 27 10:05:58 2024]"
          const datePart = dateStr.slice(1, -1); // Remove surrounding brackets
          date = new Date(datePart);
        } else {
          // Assume the format is "Jan 27 10:05:58" and append current year
          date = new Date(dateStr + " " + new Date().getFullYear());
        }

        return date >= fromDateObj && date <= toDateObj;
      }
      return true;
    });

    return filteredLines.join("\n");
  };

  const extractKeywords = (data) => {
    const words = data.match(/\b\w+\b/g);
    const uniqueWords = Array.from(new Set(words));
    setAllKeywords(uniqueWords);
  };

  const handleKeywordChange = (event) => {
    const keyword = event.target.value;
    setKeyword(keyword);
    suggestKeywords(keyword);
  };

  const suggestKeywords = (input) => {
    if (!input) {
      setSuggestedKeywords([]);
    } else {
      const suggestions = allKeywords.filter((word) =>
        word.toLowerCase().startsWith(input.toLowerCase())
      );
      setSuggestedKeywords(suggestions);
    }
  };

  const addKeyword = (keyword) => {
    if (keyword && !selectedKeywords.includes(keyword)) {
      setSelectedKeywords([...selectedKeywords, keyword]);
      setKeyword("");
      setSuggestedKeywords([]);
    }
  };

  const handleRemoveKeyword = (keyword) => {
    setSelectedKeywords(selectedKeywords.filter((kw) => kw !== keyword));
  };

  const handleApplyKeywords = () => {
    setShowKeywordModal(false);
    const filteredByKeywords = filterDataByKeywords(selectedKeywords);
    setFilteredData(filteredByKeywords);
  };

  const filterDataByKeywords = (keywords) => {
    if (!keywords.length) {
      return filteredData;
    }

    const filteredLines = filteredData
      .split("\n")
      .filter((line) =>
        keywords.some((keyword) =>
          line.toLowerCase().includes(keyword.toLowerCase())
        )
      );

    return filteredLines.join("\n");
  };

  const renderContentWithKeywords = (content, keywords) => {
    if (!content || typeof content !== "string") {
      console.error("Content is not a valid string:", content);
      return content;
    }

    if (!keywords || !Array.isArray(keywords)) {
      console.error("Keywords are not a valid array:", keywords);
      return content;
    }

    const uniqueKeywords = Array.from(new Set(keywords)).sort(
      (a, b) => b.length - a.length
    );

    const escapedKeywords = uniqueKeywords.map((keyword) =>
      keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
    );

    const regexPattern = new RegExp(`(${escapedKeywords.join("|")})`, "gi");

    const parts = content.split(regexPattern);

    return parts.map((part, index) =>
      uniqueKeywords.some(
        (keyword) => part.toLowerCase() === keyword.toLowerCase()
      ) ? (
        <mark key={index}>{part}</mark>
      ) : (
        part
      )
    );
  };

  const renderHighlightedContent = () => {
    if (!filteredData) {
      console.error("Filtered data is not available");
      return null;
    }

    const lines = filteredData.split("\n");

    return (
      <div>
        {lines.map((line, index) => (
          <div
            key={index}
            style={{
              color: /ERROR|Error|error/.test(line) ? "red" : "inherit",
            }}
          >
            {renderContentWithKeywords(line, selectedKeywords)}
          </div>
        ))}
      </div>
    );
  };

  const handleKeywordModalOk = () => {
    handleApplyKeywords();
  };

  const handleKeywordModalCancel = () => {
    setShowKeywordModal(false);
  };

  const handleLineSearchSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/search-by-line?query=${encodeURIComponent(lineSearchQuery)}`
      );
      setLineSearchResults(response.data.files);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Error searching lines");
    }
  };


  const handleLineSearchSelect = async (file) => {
    console.log(file);
    setSelectedFile(file);
    setSelectedLineFile(file);
    setShowLineSearchPopup(false);
  };
  
  useEffect(() => {
    if (selectedLineFile) {
      handleSubmit();
    }
  }, [selectedLineFile]);

  return (
    <div>
      <h1 style={{ textAlign: "center", fontSize: "25px" }}>Log Analysis</h1>
      <div style={{ margin: "20px 100px", height: "55px" }}>
        <span style={{ marginRight: "40px" }}>File List: </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search for a file..."
          list="file-suggestions"
          style={{ width: "400px", padding: "5px" }}
          onBlur={handleFileSelect}
        />
        <datalist id="file-suggestions">
          {searchResults.map((file, index) => (
            <option key={index} value={file} />
          ))}
        </datalist>
        <button
          onClick={handleSubmit}
          style={{ marginLeft: "10px", padding: "5px" }}
        >
          Submit
        </button>
        <button
          onClick={() => setShowLineSearchPopup(true)}
          style={{ marginLeft: "10px", padding: "5px" }}
        >
          Search by Line
        </button>
      </div>
      {/* Date pickers */}
      <div style={{ marginRight: "50px", width:"100%",display:"flex"}}>
        <span style={{ marginLeft: "10px" }}>From: </span>
        <DatePicker
          selected={fromDate}
          onChange={handleFromDateChange}
          showTimeSelect
          timeIntervals={10} // Set time intervals to 15 minutes
          dateFormat="Pp"
          selectsStart
          startDate={fromDate}
          endDate={toDate}
          style={{ marginRight: "20px" }}
        />
        <span style={{ marginLeft: "20px"}}>To: </span>
        <DatePicker
          selected={toDate}
          onChange={handleToDateChange}
          showTimeSelect
          timeIntervals={10} // Set time intervals to 15 minutes
          dateFormat="Pp"
          selectsEnd
          startDate={fromDate}
          endDate={toDate}
          minDate={fromDate}
        />
      </div>
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}
      <br />
      <h2 style={{ marginLeft: "10px" }}>File Data</h2>
      <div
        style={{
          marginLeft: "10px",
          height: "360px",
          width: "100%",
          overflow: "auto",
          border: "1px solid black",
          padding: "10px",
        }}
      >
        {renderHighlightedContent()}
      </div>

      {showKeywordModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "5px",
              width: "500px",
            }}
          >
            <h2>Select Keywords</h2>
            <input
              type="text"
              value={keyword}
              onChange={handleKeywordChange}
              placeholder="Enter keyword..."
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <ul>
              {suggestedKeywords.map((kw, index) => (
                <li
                  key={index}
                  onClick={() => addKeyword(kw)}
                  style={{ cursor: "pointer" }}
                >
                  {kw}
                </li>
              ))}
              {selectedKeywords.map((kw, index) => (
                <li key={index} style={{ marginTop: "10px" }}>
                  {kw}
                  <button
                    onClick={() => handleRemoveKeyword(kw)}
                    style={{ marginLeft: "10px", padding: "5px" }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div style={{ textAlign: "right" }}>
              <button
                onClick={handleKeywordModalOk}
                style={{ marginRight: "10px", padding: "5px" }}
              >
                OK
              </button>
              <button
                onClick={handleKeywordModalCancel}
                style={{ padding: "5px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showLineSearchPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "5px",
              width: "600px",
            }}
          >
            <h2>Search by Line</h2>
            <textarea
              value={lineSearchQuery}
              onChange={(e) => setLineSearchQuery(e.target.value)}
              placeholder="Enter a line to search for..."
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <div style={{ textAlign: "right" }}>
              <button
                onClick={() => setShowLineSearchPopup(false)}
                style={{ marginRight: "10px", padding: "5px" }}
              >
                Cancel
              </button>
              <button
                onClick={handleLineSearchSubmit}
                style={{ padding: "5px" }}
              >
                Search
              </button>
            </div>
            <div
              style={{
                minHeight: "10px",
                maxHeight: "300px",
                overflow: "auto",
              }}
            >
              <ul>
                {lineSearchResults.map((file, index) => (
                  <u style={{ color: "darkblue" }}>
                    <li
                      key={index}
                      onClick={() => handleLineSearchSelect(file)}
                      onMouseEnter={() => setHoveredFile(file)} // Set hovered file on mouse enter
                      onMouseLeave={() => setHoveredFile(null)} // Unset hovered file on mouse leave
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          hoveredFile === file ? "Darkgray" : "transparent", // Change background color on hover
                      }}
                    >
                      {file}
                    </li>
                  </u>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loganalysis;
