import { useState, useEffect } from "react";
import styles from "../../styles/AdminDb.module.css";
import TemplateView from "../TemplateView";
import { useSelector } from "react-redux";
import Table01 from "../subcomponents/tables/Table01";
import { createColumnHelper } from "@tanstack/react-table";

export default function Tables() {
  const userReducer = useSelector((state) => state.user.value);
  const [selectedTable, setSelectedTable] = useState("User"); // Default selection
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState(null);

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
        setTableData(result.data);
        console.log("----Table Data----");
        console.log(result.data);
        console.log("-------------    ----");
        // setColumns(result.data.length > 0 ? Object.keys(result.data[0]) : []);
        // setTableData(result.data);
      } else {
        setTableData([]);
        setColumns([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setTableData([]);
      setColumns([]);
    }
  };

  useEffect(() => {
    if (tableData.length === 0) return;

    const columnHelper = createColumnHelper();

    const dynamicCols = Object.keys(tableData[0]).map((key) =>
      columnHelper.accessor(key, {
        id: key,
        header: () => key.toUpperCase(),
        enableSorting: true,
        cell: (info) => info.getValue(),
      })
    );

    console.log("----Dynamic Cols BEFORE setColumns----");
    console.log(dynamicCols);
    console.log("---------------------------------------");

    setColumns(dynamicCols);
  }, [tableData]);
  //   const columnHelper = createColumnHelper();
  //   const columnsForTable = [
  //     columnHelper.accessor("id", {
  //       header: "ID",
  //       enableSorting: true,
  //       cell: ({ row }) => (
  //         <button
  //           onClick={() => handleSelectRow(row.original.id)}
  //           style={{
  //             fontSize: "10px",
  //           }}
  //         >
  //           {row.original.id}
  //         </button>
  //       ),
  //     }),
  //     columnHelper.accessor("id", {
  //       header: "ID",
  //       enableSorting: true,
  //     }),
  //     columnHelper.display({
  //       id: "delete",
  //       header: "Delete",
  //       cell: ({ row }) => (
  //         <button
  //           className={styles.deleteButton}
  //           onClick={() => handleDelete(row.original.id)}
  //         >
  //           X
  //         </button>
  //       ),
  //     }),
  //   ];

  const handleDelete = async (id) => {
    console.log("Deleting script with ID:", id);
    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/scripts/${scriptId}`,
    //   {
    //     method: "DELETE",
    //     headers: { Authorization: `Bearer ${userReducer.token}` },
    //   }
    // );

    // if (response.status === 204) {
    //   alert("Script deleted successfully!");
    //   fetchScriptsArray();
    // } else {
    //   alert(`Error deleting Script: ${response.status}`);
    // }
  };

  const handleSelectRow = (id) => {
    console.log("Selected row with ID:", id);
    // const selectedRow = data.find((row) => row.id === id);
    // if (selectedRow) {
    //   const { createdAt, updatedAt, ...filteredRow } = selectedRow;
    // //   setFormData(filteredRow);
    // }
  };

  return (
    <TemplateView>
      <main className={styles.main}>
        <h1>[NEW] Admin Database</h1>

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

        <div className={styles.divTable}>
          {columns && (
            <Table01
              columns={columns}
              data={tableData}
              onDeleteRow={handleDelete}
              selectedRow={handleSelectRow}
            />
          )}
          {/* <Table01
            columns={columns}
            data={tableData}
            onDeleteRow={handleDelete}
            selectedRow={handleSelectRow}
          /> */}
          {/* {data.map((item, index) => (
            <div key={index}>{JSON.stringify(item)}</div>
          ))} */}
        </div>
      </main>
    </TemplateView>
  );
}
