import { useState, useEffect } from "react";
import styles from "../styles/AdminDb.module.css";
import TemplateView from "./TemplateView";
import DynamicDbTable from "./subcomponents/DynamicDbTable";

export default function AdminDb() {
  const [selectedTable, setSelectedTable] = useState("User"); // Default selection
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  // API Base URL from environment variables
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetchData(selectedTable);
  }, [selectedTable]);

  const fetchData = async (tableName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin-db/${tableName}`);
      console.log(`url called: ${API_BASE_URL}/admin-db/${tableName}`);
      const result = await response.json();

      if (result.result && result.data.length > 0) {
        setData(result.data);

        // Extract column names dynamically
        const columnNames = Object.keys(result.data[0]);
        setColumns(columnNames);
      } else {
        setData([]);
        setColumns([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
      setColumns([]);
    }
  };

  return (
    <TemplateView>
      <main className={styles.main}>
        <h1 className={styles.title}>Admin Database</h1>

        {/* Dropdown for selecting table */}
        <div className={styles.dropdownContainer}>
          <select
            className={styles.dropdown}
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
          >
            <option value="User">User</option>
            <option value="Video">Video</option>
            <option value="Action">Action</option>
            <option value="CompetitionContract">CompetitionContract</option>
            <option value="Complex">Complex</option>
            <option value="GroupContract">GroupContract</option>
            <option value="League">League</option>
            <option value="Match">Match</option>
            <option value="OpponentServeTimestamp">
              OpponentServeTimestamp
            </option>
            <option value="Player">Player</option>
            <option value="PlayerContract">PlayerContract</option>
            <option value="Point">Point</option>
            <option value="Script">Script</option>
            <option value="SyncContract">SyncContract</option>
            <option value="Team">Team</option>
          </select>
        </div>

        {/* Dynamic Table */}
        <DynamicDbTable columnNames={columns} rowData={data} />
        {/* <div className={styles.tableContainer}>
          {columns.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((col) => (
                      <td key={col} className={'tdWrapAll'}>{row[col]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No data available</p>
          )}
        </div> */}
      </main>
    </TemplateView>
  );
}

// import styles from '../styles/AdminDb.module.css';
// import TemplateView from './TemplateView';
// export default function AdminDb() {
//   return (
//     <TemplateView>
//       <main className={styles.main}>
//         <h1 className={styles.title}>
//           Admin Database
//         </h1>
//       </main>
//     </TemplateView>
//   );
// }
