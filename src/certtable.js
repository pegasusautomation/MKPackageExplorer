import "./Table.css";
import React from "react";
// import certTable from "./certdata.json";

const Certtable = ({userData}) => {
//   const handleClick = (e) => {
//     e.Status === "Running"
//       ? console.log("Running")
//       : alert("Your server restarted successfully!");
//   };
    return <table className="hopmepage">
    <b>Licence Details</b><br></br>
    </table>;

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
};

export default Certtable;