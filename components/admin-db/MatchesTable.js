import styles from "../../styles/MatchesTable.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import TemplateView from "../TemplateView";
import DynamicDbTable from "../subcomponents/DynamicDbTable";

export default function MatchesTable() {
  const [formData, setFormData] = useState({
    leagueId: "",
    teamIdAnalyzed: "",
    teamIdOpponent: "",
    teamIdWinner: "",
    matchDate: "",
    city: "",
  });

  const [matchesList, setMatchesList] = useState([]);
  const [columns, setColumns] = useState([]);
  const userReducer = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    console.log("in useEffect");
    if (!userReducer.token) {
      router.push("/login");
    }
    fetchMatchesList();
  }, [userReducer]);

  const fetchMatchesList = async () => {
    console.log("in fetchMatchesList");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-db/Match`,
      {
        headers: { Authorization: `Bearer ${userReducer.token}` },
      }
    );

    if (response.status === 200) {
      const resJson = await response.json();
      console.log(resJson.data);
      setMatchesList(resJson.data);

      if (resJson.data.length > 0) {
        setColumns(Object.keys(resJson.data[0])); // Extract column names dynamically
      }
    } else {
      console.log(`Error fetching matches: ${response.status}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/matches/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userReducer.token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    if (response.status === 201) {
      alert("Match created successfully!");
      setFormData({
        leagueId: "",
        teamIdAnalyzed: "",
        teamIdOpponent: "",
        teamIdWinner: "",
        matchDate: "",
        city: "",
      });
      fetchMatchesList();
    } else {
      const errorJson = await response.json();
      alert(`Error: ${errorJson.error || response.statusText}`);
    }
  };

  const handleDelete = async (matchId) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/matches/${matchId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${userReducer.token}` },
      }
    );

    if (response.status === 200) {
      alert("Match deleted successfully!");
      fetchMatchesList();
    } else {
      alert(`Error deleting match: ${response.status}`);
    }
  };

  const handleSelectRow = (id) => {
    const selectedRow = matchesList.find((row) => row.id === id);
    if (selectedRow) {
      setFormData(selectedRow);
    }
  };

  return (
    <TemplateView>
      <div>
        <main className={styles.main}>
          <div className={styles.mainTop}>
            <h1 className={styles.title}>Create Match</h1>
          </div>

          {/* Match Form */}
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              {Object.keys(formData).map((field) => {
                const isDateField = field.toLowerCase().includes("date"); // Detects "date" in name
                return (
                  <div key={field} className={styles.inputGroup}>
                    <label htmlFor={field}>{field}:</label>
                    <input
                      type={isDateField ? "date" : "text"} // Sets type dynamically
                      className={styles.inputField}
                      onChange={(e) =>
                        setFormData({ ...formData, [field]: e.target.value })
                      }
                      value={formData[field]}
                      required={field !== "teamIdWinner"}
                    />
                  </div>
                );
              })}
              <button type="submit" className={styles.submitButton}>
                Create Match
              </button>
            </form>
          </div>

          {/* Matches Table */}
          <DynamicDbTable
            columnNames={columns}
            rowData={matchesList}
            onDeleteRow={handleDelete}
            selectedRow={handleSelectRow}
          />
        </main>
      </div>
    </TemplateView>
  );
}
// ------------ ChatGPT update ----------

// import styles from "../../styles/MatchesTable.module.css";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/router";
// import { useState, useEffect } from "react";
// import TemplateView from "../TemplateView";
// import DynamicDbTable from "../subcomponents/DynamicDbTable";

// export default function MatchesTable() {
//   const [formData, setFormData] = useState({
//     leagueId: "",
//     teamIdAnalyzed: "",
//     teamIdOpponent: "",
//     teamIdWinner: "",
//     matchDate: "",
//     city: "",
//   });

//   const [matchesList, setMatchesList] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const userReducer = useSelector((state) => state.user.value);
//   const dispatch = useDispatch();
//   const router = useRouter();

//   useEffect(() => {
//     console.log("in useEffect");
//     if (!userReducer.token) {
//       router.push("/login");
//     }
//     fetchMatchesList();
//   }, [userReducer]);

//   const fetchMatchesList = async () => {
//     console.log("in fetchMatchesList");
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin-db/Match`,
//       {
//         headers: { Authorization: `Bearer ${userReducer.token}` },
//       }
//     );

//     if (response.status === 200) {
//       const resJson = await response.json();
//       console.log(resJson.data);
//       setMatchesList(resJson.data);

//       if (resJson.data.length > 0) {
//         setColumns(Object.keys(resJson.data[0])); // Extract column names dynamically
//       }
//     } else {
//       console.log(`Error fetching matches: ${response.status}`);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/matches/create`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${userReducer.token}`,
//         },
//         body: JSON.stringify(formData),
//       }
//     );

//     if (response.status === 201) {
//       alert("Match created successfully!");
//       setFormData({
//         leagueId: "",
//         teamIdAnalyzed: "",
//         teamIdOpponent: "",
//         teamIdWinner: "",
//         matchDate: "",
//         city: "",
//       });
//       fetchMatchesList();
//     } else {
//       const errorJson = await response.json();
//       alert(`Error: ${errorJson.error || response.statusText}`);
//     }
//   };

//   const handleDelete = async (matchId) => {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/matches/${matchId}`,
//       {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${userReducer.token}` },
//       }
//     );

//     if (response.status === 200) {
//       alert("Match deleted successfully!");
//       fetchMatchesList();
//     } else {
//       alert(`Error deleting match: ${response.status}`);
//     }
//   };

//   const handleSelectRow = (id) => {
//     const selectedRow = matchesList.find((row) => row.id === id);
//     if (selectedRow) {
//       setFormData(selectedRow);
//     }
//   };

//   return (
//     <TemplateView>
//       <div>
//         <main className={styles.main}>
//           <div className={styles.mainTop}>
//             <h1 className={styles.title}>Create Match</h1>
//           </div>

//           {/* Match Form */}
//           <div className={styles.formContainer}>
//             <form onSubmit={handleSubmit} className={styles.form}>
//               {Object.keys(formData).map((field) => (
//                 <div key={field} className={styles.inputGroup}>
//                   <label htmlFor={field}>{field}:</label>
//                   <input
//                     className={styles.inputField}
//                     onChange={(e) =>
//                       setFormData({ ...formData, [field]: e.target.value })
//                     }
//                     value={formData[field]}
//                     required={field !== "teamIdWinner"}
//                   />
//                 </div>
//               ))}
//               <button type="submit" className={styles.submitButton}>
//                 Create Match
//               </button>
//             </form>
//           </div>

//           {/* Matches Table */}
//           <DynamicDbTable
//             columnNames={columns}
//             rowData={matchesList}
//             onDeleteRow={handleDelete}
//             selectedRow={handleSelectRow}
//           />
//         </main>
//       </div>
//     </TemplateView>
//   );
// }

// ----------- ORIGINL ------------------

// import styles from "../../styles/MatchesTable.module.css";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/router";
// import { useState, useEffect } from "react";
// import TemplateView from "../TemplateView";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import DynamicDbTable from "../subcomponents/DynamicDbTable";

// export default function MatchesTable() {
//   const [leagueId, setLeagueId] = useState("");
//   const [teamIdAnalyzed, setTeamIdAnalyzed] = useState("");
//   const [teamIdOpponent, setTeamIdOpponent] = useState("");
//   const [teamIdWinner, setTeamIdWinner] = useState("");
//   const [matchDate, setMatchDate] = useState("");
//   const [city, setCity] = useState("");
//   const [matchesList, setMatchesList] = useState([]);
//   const userReducer = useSelector((state) => state.user.value);
//   const dispatch = useDispatch();
//   const router = useRouter();

//   useEffect(() => {
//     if (!userReducer.token) {
//       router.push("/login");
//     }
//     fetchMatchesList();
//   }, [userReducer]);

//   const fetchMatchesList = async () => {
//     console.log(
//       `Fetching matches from ${process.env.NEXT_PUBLIC_API_BASE_URL}/adminDb/Match`
//     );

//     const response = await fetch(
//       // `${process.env.NEXT_PUBLIC_API_BASE_URL}/matches`,
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/adminDb/Match`,
//       {
//         headers: { Authorization: `Bearer ${userReducer.token}` },
//       }
//     );

//     if (response.status === 200) {
//       const resJson = await response.json();
//       setMatchesList(resJson);
//     } else {
//       console.log(`Error fetching matches: ${response.status}`);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const matchData = {
//       leagueId,
//       teamIdAnalyzed,
//       teamIdOpponent,
//       teamIdWinner,
//       matchDate,
//       city,
//     };

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/matches/create`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${userReducer.token}`,
//         },
//         body: JSON.stringify(matchData),
//       }
//     );

//     if (response.status === 201) {
//       alert("Match created successfully!");
//       setLeagueId("");
//       setTeamIdAnalyzed("");
//       setTeamIdOpponent("");
//       setTeamIdWinner("");
//       setMatchDate("");
//       setCity("");
//       fetchMatchesList(); // Refresh match list
//     } else {
//       const errorJson = await response.json();
//       alert(`Error: ${errorJson.error || response.statusText}`);
//     }
//   };

//   const handleDelete = async (matchId) => {
//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/matches/${matchId}`,
//       {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${userReducer.token}` },
//       }
//     );

//     if (response.status === 200) {
//       alert("Match deleted successfully!");
//       fetchMatchesList(); // Refresh match list
//     } else {
//       alert(`Error deleting match: ${response.status}`);
//     }
//   };

//   return (
//     <TemplateView>
//       <div>
//         <main className={styles.main}>
//           <div className={styles.mainTop}>
//             <h1 className={styles.title}>Create Match</h1>
//           </div>

//           {/* Match Form */}
//           <div className={styles.formContainer}>
//             <form onSubmit={handleSubmit} className={styles.form}>
//               <div className={styles.inputGroup}>
//                 <label htmlFor="leagueId">League ID:</label>
//                 <input
//                   className={styles.inputField}
//                   onChange={(e) => setLeagueId(e.target.value)}
//                   value={leagueId}
//                   required
//                 />
//               </div>
//               <div className={styles.inputGroup}>
//                 <label htmlFor="teamIdAnalyzed">Team Analyzed:</label>
//                 <input
//                   className={styles.inputField}
//                   onChange={(e) => setTeamIdAnalyzed(e.target.value)}
//                   value={teamIdAnalyzed}
//                   required
//                 />
//               </div>
//               <div className={styles.inputGroup}>
//                 <label htmlFor="teamIdOpponent">Team Opponent:</label>
//                 <input
//                   className={styles.inputField}
//                   onChange={(e) => setTeamIdOpponent(e.target.value)}
//                   value={teamIdOpponent}
//                 />
//               </div>
//               <div className={styles.inputGroup}>
//                 <label htmlFor="teamIdWinner">Winning Team (optional):</label>
//                 <input
//                   className={styles.inputField}
//                   onChange={(e) => setTeamIdWinner(e.target.value)}
//                   value={teamIdWinner}
//                 />
//               </div>
//               <div className={styles.inputGroup}>
//                 <label htmlFor="matchDate">Match Date:</label>
//                 <input
//                   type="date"
//                   className={styles.inputField}
//                   value={matchDate}
//                   onChange={(e) => setMatchDate(e.target.value)}
//                   required
//                 />
//               </div>
//               <div className={styles.inputGroup}>
//                 <label htmlFor="city">City:</label>
//                 <input
//                   className={styles.inputField}
//                   onChange={(e) => setCity(e.target.value)}
//                   value={city}
//                   required
//                 />
//               </div>
//               <button type="submit" className={styles.submitButton}>
//                 Create Match
//               </button>
//             </form>
//           </div>

//           {/* Matches Table */}
//           <DynamicDbTable columns={columns} data={matchesList} />
//           {/* <div className={styles.divTable}>
//             <h2>Existing Matches</h2>
//             <table className={styles.table}>
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>League</th>
//                   <th>Analyzed Team</th>
//                   <th>Opponent</th>
//                   <th>Winner</th>
//                   <th>Date</th>
//                   <th>City</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {matchesList.map((match) => (
//                   <tr key={match.id}>
//                     <td>{match.id}</td>
//                     <td>{match.leagueId}</td>
//                     <td>{match.teamIdAnalyzed}</td>
//                     <td>{match.teamIdOpponent || "-"}</td>
//                     <td>{match.teamIdWinner || "-"}</td>
//                     <td>{match.matchDate}</td>
//                     <td>{match.city}</td>
//                     <td>
//                       <button
//                         className={styles.deleteButton}
//                         onClick={() => handleDelete(match.id)}
//                       >
//                         <FontAwesomeIcon icon={faTrash} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div> */}
//         </main>
//       </div>
//     </TemplateView>
//   );
// }
