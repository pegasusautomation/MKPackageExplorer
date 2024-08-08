import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Alarm = () => {
    const [logData, setLogData] = useState('');
    const [alarms, setAlarms] = useState({});
    const [selectedAlarmId, setSelectedAlarmId] = useState('');

    useEffect(() => {
        // Fetch the log data from the server
        axios.get('/alarm-log')
            .then(response => {
                const data = response.data;
                console.log('Fetched log data:', data); // Debugging log
                setLogData(data);

                // Parse log data
                const parsedAlarms = parseLogData(data);
                console.log('Parsed Alarms:', parsedAlarms); // Debugging log
                setAlarms(parsedAlarms);
            })
            .catch(error => {
                console.error('Error fetching log data:', error);
            });
    }, []);

    // Function to parse the log data
    const parseLogData = (logData) => {
        const alarms = {};
        const logEntries = logData.split('\n');

        logEntries.forEach(entry => {
            try {
                const timestampEndIdx = entry.indexOf(' [INFO]');
                if (timestampEndIdx === -1) return;

                const timestamp = entry.substring(0, timestampEndIdx);
                const messageStartIdx = timestampEndIdx + 7; // Skip past ' [INFO]'
                const messageEndIdx = entry.indexOf('{', messageStartIdx);
                if (messageEndIdx === -1) return;

                const message = entry.substring(messageStartIdx, messageEndIdx).trim();
                // Extract the JSON string and replace single quotes with double quotes
                let alarmInfoStr = entry.substring(messageEndIdx);
                alarmInfoStr = alarmInfoStr
                    .replace(/'/g, '"')
                    .replace(/\bTrue\b/g, 'true')
                    .replace(/\bFalse\b/g, 'false');

                const alarmInfo = JSON.parse(alarmInfoStr);
                if (!alarms[alarmInfo.alarmId]) {
                    alarms[alarmInfo.alarmId] = [];
                }
                alarms[alarmInfo.alarmId].push({
                    timestamp,
                    message: message.replace('mediakind.legacy.alarm.collector.notifications: ', ''), // Remove redundant part
                    ...alarmInfo
                });
            } catch (e) {
                console.error('Error parsing log entry:', e, entry);
            }
        });

        return alarms;
    };

    // Handle alarm selection from the dropdown
    const handleAlarmSelect = (event) => {
        const alarmId = event.target.value;
        console.log('Selected Alarm ID:', alarmId); // Debugging log
        setSelectedAlarmId(alarmId);
    };

    return (
        <div style={{ textAlign: 'left',width:"85vw",marginRight:"100px"}}>
            <caption style={{ fontSize: '30px', marginLeft: '500px' }}>
                <b>Alarms</b>
            </caption>
            <label><b>AlarmID :</b></label>
            <select onChange={handleAlarmSelect} value={selectedAlarmId} style={{ marginTop: '20px',marginLeft:"15px", height:"30px",}}>
                <option value="" disabled>Select Alarm ID</option>
                {Object.keys(alarms).map(alarmId => (
                    <option key={alarmId} value={alarmId}>{alarmId}</option>
                ))}
            </select>
            {selectedAlarmId === '' ? (
                <div style={{ textAlign: 'center', marginTop: '50px', padding: '10px', border: '1px solid black', height: "50px" }}>
                    <p> No content, Please proceed to select the alarmID from the available options</p>
                </div>
            ) : alarms[selectedAlarmId] ? (
                <div style={{ textAlign: 'left', marginTop: '20px', border: '1px solid black', maxHeight: "450px", overflow: "auto",position:"relative" }}>
                    <table style={{ width: '100%',  boxSizing: 'border-box' }}>
                        <thead>
                            <tr style={{ background: '#908fb0', height: '30px'}}>
                                <th style={{padding: '8px', position: 'sticky', top: 0, zIndex: 2,backgroundColor:'#908fb0',border: '1px solid black',fontSize: '12px',}}>Date</th>
                                <th style={{padding: '8px', position: 'sticky', top: 0, zIndex: 2,backgroundColor:'#908fb0',border: '1px solid black',fontSize: '12px',}}>AlarmID</th>
                                <th style={{padding: '8px', position: 'sticky', top: 0, zIndex: 2,backgroundColor:'#908fb0',border: '1px solid black',fontSize: '12px',}}>Label</th>      
                                <th style={{padding: '8px', position: 'sticky', top: 0, zIndex: 2,backgroundColor:'#908fb0',border: '1px solid black',fontSize: '12px',}}>Timestamp</th>
                                <th style={{padding: '8px', position: 'sticky', top: 0, zIndex: 2,backgroundColor:'#908fb0',border: '1px solid black',fontSize: '12px',}}>Message</th>
                                <th style={{padding: '8px', position: 'sticky', top: 0, zIndex: 2,backgroundColor:'#908fb0',border: '1px solid black',fontSize: '12px',}}>State</th>
                                <th style={{padding: '8px', position: 'sticky', top: 0, zIndex: 2,backgroundColor:'#908fb0',border: '1px solid black',fontSize: '12px',}}>Additional Info</th>
                                <th style={{padding: '8px', position: 'sticky', top: 0, zIndex: 2,backgroundColor:'#908fb0',border: '1px solid black',fontSize: '12px',}}>Severity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alarms[selectedAlarmId].map((alarm, index) => (
                                <tr key={index}>
                                    <td style={{fontSize: '10px',}}>{alarm.date}</td>
                                    <td style={{fontSize: '10px',}}>{alarm.alarmId}</td>
                                    <td style={{fontSize: '10px',}}>{alarm.label}</td>
                                    <td style={{fontSize: '10px',}}>{alarm.timestamp}</td>
                                    <td style={{fontSize: '10px',}}>{alarm.message}</td>
                                    <td style={{fontSize: '10px',}}>{alarm.state}</td>
                                    <td style={{fontSize: '10px',}}>{alarm.additionalInformation || alarm.additionalInfo}</td>
                                    <td style={{fontSize: '10px',}}>{alarm.severity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{ textAlign: 'center', marginTop: '50px', padding: '10px', border: '1px solid black', height: "50px" }}>
                    <p>No content available for the selected Alarm ID</p>
                </div>
            )}
            {/* <pre style={{ textAlign: 'left', marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
                {logData}
            </pre> */}
        </div>
    );
};

export default Alarm;
