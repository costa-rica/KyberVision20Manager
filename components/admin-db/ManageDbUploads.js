import { useState, useEffect } from "react";
import styles from "../../styles/AdminDb.module.css";
import TemplateView from "../TemplateView";
import { useDispatch, useSelector } from "react-redux";

export default function ManageDbUploads() {
  const [arrayBackups, setArrayBackups] = useState([]);
  const [arrayRowCountsByTable, setArrayRowCountsByTable] = useState([]);
  const userReducer = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    // fetchBackupList();
    fetchRowCountsByTable();
  }, []);

  // const fetchBackupList = async () => {
  //   console.log(
  //     `API URL: ${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-db/backup-database-list`
  //   );

  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-db/backup-database-list`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${userReducer.token}`,
  //         },
  //       }
  //     );

  //     if (response.status !== 200) {
  //       console.log(`There was a server error: ${response.status}`);
  //       return;
  //     }
  //     const resJson = await response.json();
  //     setArrayBackups(resJson.backups);
  //   } catch (error) {
  //     console.error("Error fetching backups:", error);
  //   }
  // };

  const fetchRowCountsByTable = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-db/db-row-counts-by-table`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userReducer.token}`,
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
      console.error("Error fetching row counts:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("backupFile", file);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-db/import-db-backup`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userReducer.token}`, // Add token to Authorization header
          },
          body: formData,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
      let resJson = null;
      const contentType = response.headers.get("Content-Type");
      if (contentType?.includes("application/json")) {
        console.log("----> contentType includes json");
        resJson = await response.json();
      }

      if (response.status !== 200) {
        console.error("Upload failed:", response.status);
        // alert("Upload failed.");
        const errorMessage =
          resJson?.message || `There was a server error: ${response.status}`;
        alert(errorMessage);
      } else {
        alert("Upload successful!");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred while uploading the file.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      fetchRowCountsByTable();
    }
  };

  return (
    <TemplateView>
      <main className={styles.main}>
        <div className={styles.divMain}>
          <h1>Upload to Database</h1>

          <div className={styles.divImportData}>
            <p>
              Upload a .zip file of your database. The .zip file must include
              .csv files named after the tables.
            </p>
            <ul>
              <li>Only .zip files are accepted.</li>
              <li>Missing tables will be ignored.</li>
              <li>Empty cell values are ok</li>
              <li>
                Must have an id for each row that is not already in the table
              </li>
              <li>No missing columns.</li>
              <li>
                All columns must be in the table, in camelCase - e.g.
                "firstName" where the first letter is lower case but all
                subsequent words begin with uppercase.
              </li>
            </ul>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.divInputGroup}>
                <label htmlFor="dbFileUpload">Upload DB .zip file:</label>
                <input
                  id="dbFileUpload"
                  type="file"
                  accept=".zip"
                  onChange={handleFileChange}
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                Upload
              </button>
            </form>
          </div>

          <div className={styles.divDbDescription}>
            <h1>Row Counts by Table</h1>
            <ul>
              {arrayRowCountsByTable.length > 0 &&
                arrayRowCountsByTable.map((item, index) => (
                  <li key={index}>
                    {item.tableName}: {item.rowCount}
                  </li>
                ))}
            </ul>
          </div>

          {/* Upload Progress Modal */}
          {isUploading && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h2>Uploading...</h2>
                <p>{uploadProgress}%</p>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </TemplateView>
  );
}

// import { useState, useEffect } from "react";
// import styles from "../../styles/AdminDb.module.css";
// import TemplateView from "../TemplateView";
// import { useDispatch, useSelector } from "react-redux";

// export default function ManageDbUploads() {
//   const [arrayBackups, setArrayBackups] = useState([]);
//   const [arrayRowCountsByTable, setArrayRowCountsByTable] = useState([]);
//   const userReducer = useSelector((state) => state.user.value);
//   const dispatch = useDispatch();
//   const [file, setFile] = useState(null);
//   useEffect(() => {
//     fetchBackupList();
//     fetchRowCountsByTable();
//   }, []);

//   const fetchBackupList = async () => {
//     console.log(
//       `API URL: ${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-db/backup-database-list`
//     );

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-db/backup-database-list`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${userReducer.token}`, // Add token to Authorization header
//           },
//         }
//       );

//       if (response.status !== 200) {
//         console.log(`There was a server error: ${response.status}`);
//         return;
//       }
//       const resJson = await response.json();

//       setArrayBackups(resJson.backups);
//     } catch (error) {
//       console.error("Error fetching videos:", error);
//     }
//   };

//   const fetchRowCountsByTable = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-db/db-row-counts-by-table`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${userReducer.token}`, // Add token to Authorization header
//           },
//         }
//       );

//       if (response.status !== 200) {
//         console.log(`There was a server error: ${response.status}`);
//         return;
//       }
//       const resJson = await response.json();
//       setArrayRowCountsByTable(resJson.arrayRowCountsByTable);
//     } catch (error) {
//       console.error("Error fetching videos:", error);
//     }
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       alert("Please select a file to upload.");
//       return;
//     }

//     setIsUploading(true); // Show modal
//     setUploadProgress(0); // Reset progress
//   };

//   return (
//     <TemplateView>
//       <main className={styles.main}>
//         <div className={styles.divMain}>
//           <h1>Upload to database</h1>

//           <div className={styles.divImportData}>
//             <p>
//               Upload a .zip file of your database. .zip file must include .csv
//               files with the name of the table as the filename. Missing tables
//               will be ignored.
//             </p>
//             <form onSubmit={handleSubmit} className={styles.form}>
//               <div className={styles.divInputGroup}>
//                 <label htmlFor="dbFileUpload">Upload Db .zip file:</label>
//                 <input
//                   id="dbFileUpload"
//                   type="file"
//                   accept=".zip"
//                   onChange={handleFileChange}
//                   // required
//                 />
//               </div>

//               <button type="submit" className={styles.submitButton}>
//                 Upload
//               </button>
//             </form>
//           </div>

//           <div className={styles.divDbDescription}>
//             <h1>Row Counts by Table</h1>
//             <ul>
//               {arrayRowCountsByTable.length > 0 &&
//                 arrayRowCountsByTable.map((item, index) => (
//                   <li key={index}>
//                     {item.tableName}: {item.rowCount}
//                   </li>
//                 ))}
//             </ul>
//           </div>
//           {/* <div className={styles.divManageDbBackups}>
//             <h1>Manage DB Backups</h1>
//             <div>
//               <button
//                 className={styles.button}
//                 onClick={() => {
//                   createBackup();
//                 }}
//               >
//                 Create a Backup
//               </button>
//             </div>
//             <ul>
//               {arrayBackups.map((backup, index) => (
//                 <li key={index} className={styles.liBackups}>
//                   <a
//                     href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-db/send-db-backup/${backup}`}
//                   >
//                     {backup}
//                   </a>
//                   <button
//                     className={styles.btnDelete}
//                     onClick={() => {
//                       handleDelete(backup);
//                     }}
//                   >
//                     X
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div> */}
//         </div>
//       </main>
//     </TemplateView>
//   );
// }
