import { useState, useEffect } from "react";
import styles from "../../styles/AdminDb.module.css";
import TemplateView from "../TemplateView";
import { useDispatch, useSelector } from "react-redux";

export default function ManageDbBackups() {
  const [arrayBackups, setArrayBackups] = useState([]);
  const [arrayRowCountsByTable, setArrayRowCountsByTable] = useState([]);
  const userReducer = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  useEffect(() => {
    fetchBackupList();
    fetchRowCountsByTable();
  }, []);

  const fetchBackupList = async () => {
    console.log(
      `API URL: ${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-db/backup-database-list`
    );

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-db/backup-database-list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userReducer.token}`, // Add token to Authorization header
          },
        }
      );

      if (response.status !== 200) {
        console.log(`There was a server error: ${response.status}`);
        return;
      }
      const resJson = await response.json();

      setArrayBackups(resJson.backups);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const createBackup = async () => {
    console.log(
      `API URL: ${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-db/create-database-backup`
    );

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-db/create-database-backup`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userReducer.token}`, // Add token to Authorization header
          },
        }
      );

      if (response.status !== 200) {
        console.log(`There was a server error: ${response.status}`);
        return;
      }
      const resJson = await response.json();
      alert("Backup created successfully!");
      fetchBackupList();
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleDelete = async (backup) => {
    if (window.confirm("Are you sure you want to delete this backup?")) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-db/delete-db-backup/${backup}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userReducer.token}`, // Add token to Authorization header
            },
          }
        );

        if (response.status !== 200) {
          console.log(`There was a server error: ${response.status}`);
          return;
        }
        const resJson = await response.json();
        alert("Backup deleted successfully!");
        fetchBackupList();
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    }
  };

  const fetchRowCountsByTable = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-db/db-row-counts-by-table`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userReducer.token}`, // Add token to Authorization header
          },
        }
      );

      if (response.status !== 200) {
        console.log(`There was a server error: ${response.status}`);
        return;
      }
      const resJson = await response.json();
      setArrayRowCountsByTable(resJson.arrayRowCountsByTable);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <TemplateView>
      <main className={styles.main}>
        <div className={styles.divMain}>
          <h1>Back up database</h1>
          <div>
            <button
              className={styles.button}
              onClick={() => {
                createBackup();
              }}
            >
              Create a Backup
            </button>
          </div>
          <div className={styles.divDbDescription}>
            <h3>Row Counts by Table</h3>
            <ul>
              {arrayRowCountsByTable.length > 0 &&
                arrayRowCountsByTable.map((item, index) => (
                  <li key={index}>
                    {item.tableName}: {item.rowCount}
                  </li>
                ))}
            </ul>
          </div>
          <div className={styles.divManageDbBackups}>
            <h3>Backups</h3>

            <ul>
              {arrayBackups.map((backup, index) => (
                <li key={index} className={styles.liBackups}>
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-db/send-db-backup/${backup}`}
                  >
                    {backup}
                  </a>
                  <button
                    className={styles.btnDelete}
                    onClick={() => {
                      handleDelete(backup);
                    }}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </TemplateView>
  );
}
