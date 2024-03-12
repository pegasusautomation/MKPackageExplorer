import React, { useState } from 'react';

function Uptime() {
    const [desiredDate, setDesiredDate] = useState('');
  const [desiredTime, setDesiredTime] = useState('');
  const [resultDate, setResultDate] = useState(null);
  const [uptimeTime, setUptimeTime] = useState(null);
  const [uptimeHours, setUptimeHours] = useState(null);
  const [uptimeDays, setUptimeDays] = useState(null);

  const handleDateChange = (event) => {
    setDesiredDate(event.target.value);
  };

  const handleTimeChange = (event) => {
    setDesiredTime(event.target.value);
  };

  const calculateUptime = () => {
    // const dateString = "mksp1-support_package_2024-02-09T06_04_37";
    const uptimeText = "06:05:17 up 2 days, 16:37, 0 users, load average: 1.26, 1.21, 1.25";

    // Extract uptime time
    const uptimeTimeRegex = /\d+:\d+:\d+/;
    const uptimeTimeMatch = uptimeText.match(uptimeTimeRegex);
    if (uptimeTimeMatch) {
      setUptimeTime(uptimeTimeMatch[0]);
    }

    // Extract uptime duration
    const uptimeRegex = /up (\d+) days, (\d+):(\d+)/;
    const uptimeMatch = uptimeText.match(uptimeRegex);
    if (uptimeMatch) {
      const days = parseInt(uptimeMatch[1]);
      const hours = parseInt(uptimeMatch[2]);
      const minutes = parseInt(uptimeMatch[3]);

      // Calculate total uptime duration in hours and days
      const totalHours = days * 24 + hours + (minutes / 60);
      const totalDays = days + (hours / 24) + (minutes / (24 * 60));

      setUptimeHours(totalHours);
      setUptimeDays(totalDays);

      // Calculate resulting date
      const date = new Date(desiredDate + 'T' + desiredTime.replace('_', ':'));
      const timeDiff = date.getTime() - totalDays * 24 * 60 * 60 * 1000;
      const resultDate = new Date(timeDiff);
      setResultDate(resultDate);
    }
  };
  
    return (
      <div style={{margin:'100px',alignContent:'center',justifyContent:'center'}}>
        <div> 
       
            <br></br>
          <label htmlFor="dateInput">Enter the issue Date:</label>
          <br></br>
          <input type="date" id="dateInput" value={desiredDate} onChange={handleDateChange} style={{width:'120px'}}/>
        </div>
        <br></br>
        <div>
          <label htmlFor="timeInput">Enter the issue Time:</label>
          <br></br>
          <input type="time" id="timeInput" value={desiredTime} onChange={handleTimeChange} style={{width:'120px'}}/>
        </div>
        <br></br>
        <button onClick={calculateUptime} style={{width:'120px'}}>Calculate Uptime</button>
        <br></br><br></br>
        {resultDate && (
          <div>
            <p>Total uptime (in hours):<b style={{color:'green'}}>{uptimeHours.toFixed(2)}</b></p>
            <p>Total uptime (in days):<b style={{color:'green'}}>{uptimeDays.toFixed(2)}</b></p>
            <p><b>SERVER UP FROM : </b><b style={{color:'green'}}>{resultDate.toISOString().slice(0, 10)},{uptimeTime}</b></p>
          </div>
        )}
      </div>
    );
  }
export default Uptime;
