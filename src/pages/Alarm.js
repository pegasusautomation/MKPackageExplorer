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
        <div style={{ textAlign: 'center' }}>
            <caption style={{ fontSize: '30px', marginLeft: '30px' }}>
                <b>Alarms</b>
            </caption>
            <select onChange={handleAlarmSelect} value={selectedAlarmId} style={{ marginTop: '20px' }}>
                <option value="" disabled>Select Alarm ID</option>
                {Object.keys(alarms).map(alarmId => (
                    <option key={alarmId} value={alarmId}>{alarmId}</option>
                ))}
            </select>
            {selectedAlarmId && alarms[selectedAlarmId] && (
                <div style={{ textAlign: 'left', marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
                    {alarms[selectedAlarmId].map((alarm, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <p><b>mediakind.legacy.alarm.collector.notifications:</b> {alarm.message}</p>
                            <p><b>Timestamp:</b> {alarm.timestamp}</p>
                            <p><b>Alarm id:</b> {alarm.alarmId}</p>
                            <p><b>State:</b> {alarm.state}</p>
                            <p><b>Date:</b> {alarm.date}</p>
                            <p><b>Label:</b> {alarm.label}</p>
                            <p><b>Additional Info:</b> {alarm.additionalInformation || alarm.additionalInfo}</p>
                            <p><b>Severity:</b> {alarm.severity}</p>
                            <hr />
                        </div>
                    ))}
                </div>
            )}
            {/* <pre style={{ textAlign: 'left', marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
                {logData}
            </pre> */}
        </div>
    );
};

export default Alarm;
