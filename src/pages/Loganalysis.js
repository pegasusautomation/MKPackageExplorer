import React, { useState, useEffect } from "react";
import axios from 'axios'; // for making HTTP requests

const Loganalysis = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFile, setSelectedFile] = useState('');
    const [fileData, setFileData] = useState('');
    const [filteredData, setFilteredData] = useState(''); // State for filtered data
    const [keyword, setKeyword] = useState(''); // State for the keyword search
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isJsonFile, setIsJsonFile] = useState(false); // State to check if the selected file is a JSON file
    const [showTableView, setShowTableView] = useState(false); // State to toggle table view
    const [showKeywordModal, setShowKeywordModal] = useState(false); // State to toggle keyword modal
    const [selectedKeywords, setSelectedKeywords] = useState([]); // State to keep track of selected keywords
    const [allKeywords, setAllKeywords] = useState([]); // State to store all unique keywords
    const [suggestedKeywords, setSuggestedKeywords] = useState([]); // State for suggested keywords

    useEffect(() => {
        // Fetch the initial list of files
        const fetchInitialFiles = async () => {
            try {
                const response = await axios.get('/list-files');
                setSearchResults(response.data.files);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };
        fetchInitialFiles();
    }, []);

    const fetchFiles = async (query) => {
        try {
            const response = await axios.get(`/search?query=${query}`);
            setSearchResults(response.data.files);
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        fetchFiles(query);
    };

    const handleFileSelect = (event) => {
        const file = event.target.value;
        setSelectedFile(file);
        console.log('Selected file:', file);
    };

    const handleSubmit = async () => {
        try {
            if (!selectedFile) {
                console.error('No file selected');
                return;
            }
            console.log('Submitting file:', selectedFile);
            const response = await axios.get(`/file-data?file=${encodeURIComponent(selectedFile)}`);
            
            let fileContent = response.data;
            
            // Check if the content is an object (which would be the case for JSON files)
            if (typeof fileContent === 'object') {
                fileContent = JSON.stringify(fileContent, null, 2); // Beautify JSON content
                setIsJsonFile(true); // Set the state to true if the file is JSON
            } else {
                setIsJsonFile(false); // Set the state to false if the file is not JSON
            }

            setFileData(fileContent);
            setFilteredData(fileContent); // Initialize filtered data
            extractKeywords(fileContent); // Extract keywords from the file content
            setIsSubmitted(true);
            setShowKeywordModal(true); // Show keyword modal upon submission
        } catch (error) {
            console.error('Error fetching file data:', error);
        }
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
            const suggestions = allKeywords.filter(word => word.toLowerCase().startsWith(input.toLowerCase()));
            setSuggestedKeywords(suggestions);
        }
    };

    const addKeyword = (keyword) => {
        if (keyword && !selectedKeywords.includes(keyword)) {
            setSelectedKeywords([...selectedKeywords, keyword]);
            setKeyword(''); // Clear the input field
            setSuggestedKeywords([]); // Clear suggestions after adding
        }
    };

    const handleRemoveKeyword = (keyword) => {
        setSelectedKeywords(selectedKeywords.filter(kw => kw !== keyword));
    };

    const handleApplyKeywords = () => {
        setShowKeywordModal(false);
        filterDataByKeywords(selectedKeywords);
    };

    const filterDataByKeywords = (keywords) => {
        if (!keywords.length) {
            setFilteredData(fileData); // Reset to original file data if no keywords
        } else {
            const filteredLines = fileData
                .split('\n')
                .filter(line => keywords.some(keyword => line.toLowerCase().includes(keyword.toLowerCase())));
            setFilteredData(filteredLines.join('\n'));
        }
    };

    const renderTable = (data) => {
        try {
            let jsonData = JSON.parse(data);
    
            // Flatten nested objects
            const flattenObject = (obj, prefix = '') => {
                return Object.keys(obj).reduce((acc, key) => {
                    const pre = prefix.length ? prefix + '.' : '';
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        Object.assign(acc, flattenObject(obj[key], pre + key));
                    } else {
                        // Explicitly convert boolean values to strings
                        acc[pre + key] = typeof obj[key] === 'boolean' ? obj[key].toString() : obj[key];
                    }
                    return acc;
                }, {});
            };
    
            const flattenedData = flattenObject(jsonData);
    
            const columns = Object.keys(flattenedData);
            return (
                <table border="1">
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {columns.map((column, index) => (
                                <td key={index}>{flattenedData[column]}</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            );
        } catch (error) {
            console.error("Error rendering table:", error);
            return <p>Error rendering table: {error.message}</p>;
        }
    };

    return (
        <div>
            <h1 style={{ marginLeft: '500px', fontSize: '25px' }}>Log Analysis</h1>
            <br />
            <div style={{ marginLeft: '100px' }}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search for a file..."
                    list="file-suggestions"
                    style={{ width: '400px' }}
                    onBlur={handleFileSelect}
                />
                <datalist id="file-suggestions">
                    {searchResults.map((file, index) => (
                        <option key={index} value={file} />
                    ))}
                </datalist>
                <button onClick={handleSubmit}>Submit</button>
                {isSubmitted && (
                    <>
                        <input
                            type="text"
                            value={keyword}
                            onChange={handleKeywordChange}
                            placeholder="Search within file..."
                            style={{ marginLeft: '10px' }}
                        />
                        {isJsonFile && (
                            <button onClick={() => setShowTableView(!showTableView)} style={{ marginLeft: '10px' }}>
                                {showTableView ? "Hide Table View" : "Table View"}
                            </button>
                        )}
                    </>
                )}
            </div>
            <br />
            <h2 style={{ marginLeft: '50px' }}>File Data</h2>
            <br />
            <div style={{ marginLeft: '50px', height: '410px', width: '1000px', overflow: 'auto', border: '1px solid black' }}>
                {!showTableView && <pre>{filteredData}</pre>}
                {showTableView && renderTable(filteredData)}
            </div>

            {showKeywordModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', width: '500px' }}>
                        <h2>Select Keywords</h2>
                        <input
                            type="text"
                            value={keyword}
                            onChange={handleKeywordChange}
                            placeholder="Enter keyword..."
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                        <ul>
                            {suggestedKeywords.map((kw, index) => (
                                <li key={index} onClick={() => addKeyword(kw)}>{kw}</li>
                            ))}
                        </ul>
                        <button onClick={() => addKeyword(keyword)}>Add Keyword</button>
                        <ul>
                            {selectedKeywords.map((kw, index) => (
                                <li key={index}>
                                    {kw}
                                    <button onClick={() => handleRemoveKeyword(kw)} style={{ marginLeft: '10px' }}>Remove</button>
                                </li>
                            ))}
                        </ul>
                        <div style={{ textAlign: 'right' }}>
                            <button onClick={() => setShowKeywordModal(false)} style={{ marginRight: '10px' }}>Cancel</button>
                            <button onClick={handleApplyKeywords}>OK</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Loganalysis;