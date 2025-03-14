import styles from "../../styles/MatchesTable.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import TemplateView from "../TemplateView";
import DynamicDbTable from "../subcomponents/DynamicDbTable";

export default function SyncContractTable() {
  const [formData, setFormData] = useState({
    scriptId: "",
    videoId: "",
    deltaTime: "",
  });

  const [syncContractsList, setSyncContractsList] = useState([]);
  const [columns, setColumns] = useState([]);
  const userReducer = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!userReducer.token) {
      router.push("/login");
    }
    fetchSyncContractsList();
  }, [userReducer]);

  const fetchSyncContractsList = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-db/table/SyncContract`,
      {
        headers: { Authorization: `Bearer ${userReducer.token}` },
      }
    );

    if (response.status === 200) {
      const resJson = await response.json();
      setSyncContractsList(resJson.data);

      if (resJson.data.length > 0) {
        setColumns(Object.keys(resJson.data[0])); // Extract column names dynamically
      }
    } else {
      console.log(`Error fetching sync contracts: ${response.status}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sync-contracts/update-or-create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userReducer.token}`,
        },
        body: JSON.stringify(formData),
      }
    );
    console.log(response.status);
    if (response.status === 201 || response.status === 200) {
      alert("SyncContract created successfully!");
      setFormData({
        scriptId: "",
        videoId: "",
        deltaTime: "",
      });
      fetchSyncContractsList();
    } else {
      const errorJson = await response.json();
      alert(`Error: ${errorJson.error || response.statusText}`);
    }
  };

  const handleDelete = async (syncContractId) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sync-contracts/${syncContractId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userReducer.token}` },
      }
    );

    if (response.status === 200) {
      alert("SyncContract deleted successfully!");
      fetchSyncContractsList();
    } else {
      alert(`Error deleting SyncContract: ${response.status}`);
    }
  };

  const handleSelectRow = (id) => {
    const selectedRow = syncContractsList.find((row) => row.id === id);
    if (selectedRow) {
      const { createdAt, updatedAt, ...filteredRow } = selectedRow;
      setFormData(filteredRow);
    }
  };

  return (
    <TemplateView>
      <div>
        <main className={styles.main}>
          <div className={styles.mainTop}>
            <h1 className={styles.title}>Create SyncContract</h1>
            <div>* Note: For new rows do not enter a value for "id"</div>
          </div>

          {/* SyncContract Form */}
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              {Object.keys(formData).map((field) => {
                return (
                  <div key={field} className={styles.inputGroup}>
                    <label htmlFor={field}>{field}:</label>
                    <input
                      type="text"
                      className={styles.inputField}
                      onChange={(e) =>
                        setFormData({ ...formData, [field]: e.target.value })
                      }
                      value={formData[field]}
                      required={field !== "id"}
                    />
                  </div>
                );
              })}
              <button type="submit" className={styles.submitButton}>
                Create SyncContract
              </button>
            </form>
          </div>

          <DynamicDbTable
            columnNames={columns}
            rowData={syncContractsList}
            onDeleteRow={handleDelete}
            selectedRow={handleSelectRow}
          />
        </main>
      </div>
    </TemplateView>
  );
}
