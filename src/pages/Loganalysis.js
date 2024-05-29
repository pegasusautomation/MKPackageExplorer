import React, { useState, useEffect } from "react";
import axios from 'axios'; // for making HTTP requests

const Loganalysis = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFile, setSelectedFile] = useState('');
    const [fileData, setFileData] = useState('');
    const [filteredData, setFilteredData] = useState('');
    const [keyword, setKeyword] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isJsonFile, setIsJsonFile] = useState(false);
    const [showTableView, setShowTableView] = useState(false);
    const [showKeywordModal, setShowKeywordModal] = useState(false);
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [allKeywords, setAllKeywords] = useState([]);
    const [suggestedKeywords, setSuggestedKeywords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInitialFiles = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/list-files');
                setSearchResults(response.data.files);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError('Error fetching files');
            }
        };
        fetchInitialFiles();
    }, []);

    const fetchFiles = async (query) => {
        try {
            setLoading(true);
            const response = await axios.get(`/search?query=${query}`);
            setSearchResults(response.data.files);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError('Error fetching files');
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
            setLoading(true);
            const response = await axios.get(`/file-data?file=${encodeURIComponent(selectedFile)}`);
            
            let fileContent = response.data;
            
            if (typeof fileContent === 'object') {
                fileContent = JSON.stringify(fileContent, null, 2);
                setIsJsonFile(true);
            } else {
                setIsJsonFile(false);
            }

            setFileData(fileContent);
            setFilteredData(fileContent);
            extractKeywords(fileContent);
            setIsSubmitted(true);
            setShowKeywordModal(true);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError('Error fetching file data');
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
            setKeyword('');
            setSuggestedKeywords([]);
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
            setFilteredData(fileData);
        } else {
            const filteredLines = fileData
                .split('\n')
                .filter(line => keywords.some(keyword => line.toLowerCase().includes(keyword.toLowerCase())));
            setFilteredData(filteredLines.join('\n'));
        }
    };

    const renderContentWithKeywords = (content) => {
        // Split the content into words
        const words = content.split(/\b/);
        
        // Map over each word and apply highlighting if it matches any selected keyword
        return words.map((word, index) => {
            // Convert both word and keywords to lowercase for case-insensitive matching
            const lowerCaseWord = word.toLowerCase();
            const isKeyword = selectedKeywords.some(keyword => lowerCaseWord.includes(keyword.toLowerCase()));
            if (isKeyword) {
                if (word === "connector" || word === "connector" ) {
                    return <span key={index} style={{ color: 'red' }}>{word}</span>;
                } else {
                    return <span key={index} style={{ backgroundColor: 'yellow' }}>{word}</span>;
                }
            } else {
                return word;
            }
        });
    };

    const renderHighlightedContent = () => {
        if (showTableView) {
            try {
                let jsonData = JSON.parse(filteredData);
                const flattenObject = (obj, prefix = '') => {
                    return Object.keys(obj).reduce((acc, key) => {
                        const pre = prefix.length ? prefix + '.' : '';
                        if (typeof obj[key] === 'object' && obj[key] !== null) {
                            Object.assign(acc, flattenObject(obj[key], pre + key));
                        } else {
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
                                    <td key={index}>
                                        {renderContentWithKeywords(flattenedData[column])}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                );
            } catch (error) {
                console.error("Error rendering table:", error);
                return <p>Error rendering table: {error.message}</p>;
            }
        } else {
            // For plain text view
            return <pre>{renderContentWithKeywords(filteredData)}</pre>;
        }
    };

    return (
        <div>
            <h1 style={{ textAlign: 'center', fontSize: '25px' }}>Log Analysis</h1>
            <div style={{ margin: '20px 100px' }}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search for a file..."
                    list="file-suggestions"
                    style={{ width: '400px', padding: '5px' }}
                    onBlur={handleFileSelect}
                />
                <datalist id="file-suggestions">
                    {searchResults.map((file, index) => (
                        <option key={index} value={file} />
                    ))}
                </datalist>
                <button onClick={handleSubmit} style={{ marginLeft: '10px', padding: '5px' }}>Submit</button>
                {isSubmitted && (
                    <>
                        <input
                            type="text"
                            value={keyword}
                            onChange={handleKeywordChange}
                            placeholder="Search within file..."
                            style={{ marginLeft: '10px', padding: '5px' }}
                        />
                        {isJsonFile && (
                            <button onClick={() => setShowTableView(!showTableView)} style={{ marginLeft: '10px', padding: '5px' }}>
                                {showTableView ? "Hide Table View" : "Table View"}
                            </button>
                        )}
                    </>
                )}
            </div>
            {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
            {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}
            <h2 style={{ marginLeft: '50px' }}>File Data</h2>
            <div style={{ marginLeft: '50px', height: '410px', width: '1000px', overflow: 'auto', border: '1px solid black', padding: '10px' }}>
                {renderHighlightedContent()}
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
                                <li key={index} onClick={() => addKeyword(kw)} style={{ cursor: 'pointer' }}>{kw}</li>
                            ))}
                            {selectedKeywords.map((kw, index) => (
                                <li key={index} style={{ marginTop: '10px' }}>
                                    {kw}
                                    <button onClick={() => handleRemoveKeyword(kw)} style={{ marginLeft: '10px', padding: '5px' }}>Remove</button>
                                </li>
                            ))}
                        </ul>
                        <div style={{ textAlign: 'right' }}>
                            <button onClick={() => setShowKeywordModal(false)} style={{ marginRight: '10px', padding: '5px' }}>Cancel</button>
                            <button onClick={handleApplyKeywords} style={{ padding: '5px' }}>OK</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Loganalysis;
