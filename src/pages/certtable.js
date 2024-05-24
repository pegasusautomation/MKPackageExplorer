// import "./Table.css";
import "./alarm.css";
import React from "react";
// import licensedata from ".././backend/uploads/folders/mksp1-support_package_2024-02-09T06_04_37_in_progress/mksp1-support_package_2024-02-09T06_04_37/database/envivioCluster/license_server.json"
const Certtable = () => {
  return(
    <div className="table-container">
      <caption style={{fontSize:'30px',marginLeft:'50px'}}><b>Locking Data</b></caption>
      <br></br>
            <br></br>
      {/* <table className="alarm-table" style={{marginLeft:'70px'}}>
        <thead>
          <tr>
            <th>Server ID</th>
            <th>Locking Code</th>
          </tr>
        </thead>
        <tbody>
          {licensedata.map(license => (
              <tr key={license._id.$oid}>
                <td>{license.server_id}</td>
                <td>{license.locking_code}</td>
              </tr>
        ))}
        </tbody>
</table> */}
</div>
);


};

export default Certtable;