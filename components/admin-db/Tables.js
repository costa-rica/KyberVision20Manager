import { useState, useEffect } from "react";
import styles from "../../styles/AdminDb.module.css";
import TemplateView from "../TemplateView";
import DynamicDbTable from "../subcomponents/DynamicDbTable";
import { useSelector } from "react-redux";

export default function Tables() {
  const userReducer = useSelector((state) => state.user.value);
  const [selectedTable, setSelectedTable] = useState("User"); // Default selection
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    fetchData(selectedTable);
  }, [selectedTable]);

  const fetchData = async (tableName) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-db/table/${tableName}`,
        {
          headers: { Authorization: `Bearer ${userReducer.token}` },
        }
      );

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text(); // Log response text for debugging
        throw new Error(`Server Error: ${errorText}`);
      }

      const result = await response.json();
      console.log("Fetched Data:", result);

      if (result.result && Array.isArray(result.data)) {
        setData(result.data);
        setColumns(result.data.length > 0 ? Object.keys(result.data[0]) : []);
      } else {
        setData([]);
        setColumns([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setData([]);
      setColumns([]);
    }
  };

  return (
    <TemplateView>
      <main className={styles.main}>
        <h1>[NEW] Admin Database</h1>
        <div className={styles.divTable}>
          {data.map((item, index) => (
            <div key={index}>{JSON.stringify(item)}</div>
          ))}
        </div>
      </main>
    </TemplateView>
  );
}
