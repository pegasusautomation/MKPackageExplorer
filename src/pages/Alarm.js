import "./alarm.css";
import React from "react";
import alarmdata from "../../src/backend/uploads/folders/mksp1-support_package_2024-02-09T06_04_37_in_progress/mksp1-support_package_2024-02-09T06_04_37/database/alarm/registry.json"

const Alarm = () => {
    const raisedAlarms = alarmdata.filter(alarm => alarm.state === 'raised');

    return (
        
        <div className="table-container" > {/* Apply a class for centering */}
            <caption style={{fontSize:'30px',marginLeft:'30px'}}><b>Active Alarms</b></caption>
            <br></br>
            <br></br>
            <table className="alarm-table"> 
                <thead>
                    <tr>
                        <th>Alarm Id</th>
                        <th>State</th>
                        <th>Is_Active</th>
                        <th>Info</th>
                    </tr>
                </thead>
                <tbody>
                    {raisedAlarms.map(alarm => (
                        <tr key={alarm._id.$oid}>
                            <td>{alarm.alarm_id}</td>
                            <td>{alarm.state}</td>
                            <td>{alarm.is_active.toString()}</td>
                            <td>{alarm.info}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Alarm;

  //   userData.role==="manager"||userData.role==="admin"?
  //   <div className="column">
  //     {certTable ? (
  //       <table className="table">
  //         <caption className="caption">
  //           <b>
  //             <br></br>
  //             <br></br>CERTIFICATE DETAILS
  //           </b>
  //           <br></br>
  //           <br></br>
  //         </caption>
  //         <thead>
  //           <tr>
  //             {Object.keys(certTable[0]).map((key, index) => (
  //               <th key={index}>{key}</th>
  //             ))}
  //             {/* <th>{Action}</th> */}
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {certTable.map((row, rowIndex) => (
  //             <tr key={rowIndex}>
  //               {Object.values(row).map((cell, cellIndex) => (
  //                 <td key={cellIndex}>{cell}</td>
  //               ))}
  //               {/* <td>
  //                 <button onClick={() => handleClick(row)}>
  //                   {row.Status === "Restart" ? "Running" : "Restart"}
  //                 </button>
  //               </td> */}
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     ) : (
  //       <p>Loading...</p>
  //     )}
  //   </div>
  //   :<div>You are not Authorised to this page</div>
  // );
