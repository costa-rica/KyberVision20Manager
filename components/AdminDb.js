import { useState, useEffect } from "react";
import styles from "../styles/AdminDb.module.css";
import TemplateView from "./TemplateView";
import DynamicDbTable from "./subcomponents/DynamicDbTable";
import { useSelector } from "react-redux";

export default function AdminDb() {
  const userReducer = useSelector((state) => state.user.value);
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
      const response = await fetch(
        `${API_BASE_URL}/admin-db/table/${tableName}`,
        {
          headers: { Authorization: `Bearer ${userReducer.token}` },
        }
      );
      console.log(`url called: ${API_BASE_URL}/admin-db/table/${tableName}`);
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
        <div className={styles.divMain}>
          <h1>Admin Database</h1>

          <div className={styles.divLinks}>
            <ul>
              <li>
                <a href="/admin-db/manage-db-backups">Manage DB Backups</a>
              </li>
              <li>
                <a href="/admin-db/manage-db-uploads">Manage DB Uploads</a>
              </li>
            </ul>
          </div>

          {/* Dropdown for selecting table */}
          <div className={styles.divDropdown}>
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
          </div>
          {/* Dynamic Table */}
          <DynamicDbTable columnNames={columns} rowData={data} />
        </div>
      </main>
    </TemplateView>
  );
}
