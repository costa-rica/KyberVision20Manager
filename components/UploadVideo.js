import styles from "../styles/UploadVideo.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setNewVideoId } from "../reducers/user";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import TemplateView from "./TemplateView";
import TableVideos from "./TableVideos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRectangleXmark,
  faCircleMinus,
} from "@fortawesome/free-solid-svg-icons";
export default function UploadVideo() {
  const [file, setFile] = useState(null);
  const [matchId, setMatchId] = useState("");
  const [teamIdAnalyzed, setTeamIdAnalyzed] = useState("");
  const [teamIdOpponent, setTeamIdOpponent] = useState("");
  const [dateOfMatch, setDateOfMatch] = useState("");
  const [videosList, setVideosList] = useState([]);
  const [isUploading, setIsUploading] = useState(false); // Modal state
  const [uploadProgress, setUploadProgress] = useState(0); // Progress percentage
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false); // State to control modal visibility
  const [deleteVideoObj, setDeleteVideoObj] = useState({});
  const userReducer = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!userReducer.token) {
      router.push("/login");
    }
    fetchVideoListApiCall();
  }, [userReducer]);

  const fetchVideoListApiCall = async () => {
    console.log(`API URL: ${process.env.NEXT_PUBLIC_API_BASE_URL}/videos`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos`
    );

    if (response.status === 200) {
      const resJson = await response.json();
      const videosObjArray = resJson.videos.map((elem) => ({
        id: `${elem.id}`,
        name: `${elem.matchName}`,
        date: elem.date,
        matchName: `${elem.matchId}`,
        scripted: false,
        durationOfMatch: elem.durationString,
        filename: elem.filename,
      }));
      setVideosList(videosObjArray);
    } else {
      console.log(`There was a server error: ${response.status}`);
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

    setIsUploading(true); // Show modal
    setUploadProgress(0); // Reset progress

    const formData = new FormData();
    formData.append("video", file);
    formData.append("matchId", matchId);

    const xhr = new XMLHttpRequest();
    const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/upload`;
    xhr.open("POST", api_url);

    if (userReducer.token) {
      xhr.setRequestHeader("Authorization", `Bearer ${userReducer.token}`);
    } else {
      alert("You are not authorized. Please log in.");
      router.push("/login");
      return;
    }

    // Progress handler
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    };

    // Load handler
    xhr.onload = () => {
      setIsUploading(false); // Hide modal
      if (xhr.status === 200) {
        alert("Video uploaded successfully!");
        fetchVideoListApiCall();
        setFile(null);
        setMatchId("");
        setTeamIdAnalyzed("");
        setTeamIdOpponent("");
        setDateOfMatch("");
        e.target.reset();
      } else {
        alert(`Error: ${xhr.status} - ${xhr.statusText}`);
      }
    };

    // Error handler
    xhr.onerror = () => {
      setIsUploading(false); // Hide modal
      alert("An error occurred while uploading the video.");
    };

    xhr.send(formData);
  };

  const handleDelete = async (videoObj) => {
    const videoId = videoObj.id;
    const fetchUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/${videoId}`;
    const response = await fetch(fetchUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userReducer.token}`, // Add token to Authorization header
      },
      // body: JSON.stringify({ videoId: videoObj.id }),
    });
    if (response.status == 200) {
      fetchVideoListApiCall();
      const resJson = await response.json();
      window.alert(resJson.message);
      setDeleteModalIsOpen(false);
    } else {
      window.alert(`There was a server error: ${response.status}`);
    }
  };

  return (
    <TemplateView>
      <div>
        <main className={styles.main}>
          <div className={styles.mainTop}>
            <h1 className={styles.title}>Video Uploader</h1>
          </div>

          {/* Upload Form */}
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="videoFileUpload">Upload Video:</label>
                <input
                  id="videoFileUpload"
                  type="file"
                  accept=".mp4, .mov"
                  onChange={handleFileChange}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="matchId">Match ID:</label>
                <input
                  className={styles.inputField}
                  onChange={(e) => setMatchId(e.target.value)}
                  value={matchId}
                  required
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                Upload
              </button>
            </form>
          </div>

          {/* Video Table */}
          <div className={styles.divTableVideos}>
            <TableVideos
              setDeleteModalIsOpen={setDeleteModalIsOpen}
              setDeleteVideoObj={setDeleteVideoObj}
              videosList={videosList}
            />
          </div>

          {/* Uploading Modal */}
          {isUploading && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <p>Uploading... {uploadProgress}%</p>
                <div className={styles.loadingBar}>
                  <div
                    className={styles.loadingProgress}
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          {deleteModalIsOpen && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <div className={styles.modalTop}>
                  <FontAwesomeIcon
                    icon={faRectangleXmark}
                    onClick={() => setDeleteModalIsOpen(false)}
                    className={styles.closeModalIcon}
                  />
                  <h2>Are you sure?</h2>
                  <div className={styles.divModalFilename}>
                    <div> {deleteVideoObj.filename} </div>

                    <div className={styles.divModalPort}>
                      {deleteVideoObj.matchName}
                    </div>

                    <div>{deleteVideoObj.date}</div>
                  </div>
                </div>

                <button
                  className={styles.btnYesDelete}
                  onClick={() => {
                    console.log(" yes delete me");
                    handleDelete(deleteVideoObj);
                  }}
                >
                  Yes, delete
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </TemplateView>
  );
}

// --------- Chat GPT --------

// import styles from "../styles/UploadVideo.module.css";
// import { useDispatch, useSelector } from "react-redux";
// import { setNewVideoId } from "../reducers/user";
// import { useRouter } from "next/router";
// import { useState, useEffect } from "react";
// import TemplateView from "./TemplateView";
// import TableVideos from "./TableVideos";

// export default function UploadVideo() {
//   const [file, setFile] = useState(null);
//   const [leagueId, setLeagueId] = useState("");
//   const [teamIdAnalyzed, setTeamIdAnalyzed] = useState("");
//   const [teamIdOpponent, setTeamIdOpponent] = useState("");
//   const [dateOfMatch, setDateOfMatch] = useState("");
//   const [videosList, setVideosList] = useState([]);
//   const userReducer = useSelector((state) => state.user.value);
//   const dispatch = useDispatch();
//   const router = useRouter();

//   useEffect(() => {
//     if (!userReducer.token) {
//       router.push("/login");
//     }
//     fetchVideoListApiCall();
//   }, [userReducer]);

//   const fetchVideoListApiCall = async () => {
//     console.log(`API URL: ${process.env.NEXT_PUBLIC_API_BASE_URL}/videos`);

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos`
//     );

//     if (response.status === 200) {
//       const resJson = await response.json();
//       const videosObjArray = resJson.videos.map((elem) => ({
//         id: `${elem.id}`,
//         name: `${elem.matchName}`,
//         date: elem.date,
//         matchName: `${elem.matchId}`,
//         scripted: false,
//         durationOfMatch: elem.durationString,
//         filename: elem.filename,
//       }));
//       setVideosList(videosObjArray);
//     } else {
//       console.log(`There was a server error: ${response.status}`);
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

//     const formData = new FormData();
//     formData.append("video", file);
//     formData.append("matchId", 1);

//     const xhr = new XMLHttpRequest();
//     const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/upload`;
//     xhr.open("POST", api_url);

//     if (userReducer.token) {
//       xhr.setRequestHeader("Authorization", `Bearer ${userReducer.token}`);
//     } else {
//       alert("You are not authorized. Please log in.");
//       router.push("/login");
//       return;
//     }

//     xhr.onload = () => {
//       if (xhr.status === 200) {
//         alert("Video uploaded successfully!");
//         fetchVideoListApiCall();
//         setFile(null);
//         setLeagueId("");
//         setTeamIdAnalyzed("");
//         setTeamIdOpponent("");
//         setDateOfMatch("");
//         e.target.reset();
//       } else {
//         alert(`Error: ${xhr.status} - ${xhr.statusText}`);
//       }
//     };

//     xhr.onerror = () => {
//       alert("An error occurred while uploading the video.");
//     };

//     xhr.send(formData);
//   };

//   return (
//     <TemplateView>
//       <div>
//         <main className={styles.main}>
//           <div className={styles.mainTop}>
//             <h1 className={styles.title}>Video Uploader</h1>
//           </div>

//           {/* Upload Form */}
//           <div className={styles.formContainer}>
//             <form onSubmit={handleSubmit} className={styles.form}>
//               <div className={styles.inputGroup}>
//                 <label htmlFor="videoFileUpload">Upload Video:</label>
//                 <input
//                   id="videoFileUpload"
//                   type="file"
//                   accept=".mp4, .mov"
//                   onChange={handleFileChange}
//                   required
//                 />
//               </div>

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
//                 <label htmlFor="dateOfMatch">Match Date:</label>
//                 <input
//                   type="date"
//                   className={styles.inputField}
//                   value={dateOfMatch}
//                   onChange={(e) => setDateOfMatch(e.target.value)}
//                   required
//                 />
//               </div>

//               <button type="submit" className={styles.submitButton}>
//                 Upload
//               </button>
//             </form>
//           </div>

//           {/* Video Table */}
//           <div className={styles.divTableVideos}>
//             <TableVideos videosList={videosList} />
//           </div>
//         </main>
//       </div>
//     </TemplateView>
//   );
// }

/// ---------- ORiginal NR -----------

// import styles from "../styles/UploadVideo.module.css";
// import { useDispatch, useSelector } from "react-redux";
// import { setNewVideoId } from "../reducers/user";
// import { useRouter } from "next/router";
// import { useState, useEffect } from "react";
// import TemplateView from "./TemplateView";
// import TableVideos from "./TableVideos";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faRectangleXmark,
//   faCircleMinus,
// } from "@fortawesome/free-solid-svg-icons";

// export default function UploadVideo() {
//   const [file, setFile] = useState(null);
//   const [leagueId, setLeagueId] = useState("");
//   const [teamIdAnalyzed, setTeamIdAnalyzed] = useState("");
//   const [teamIdOpponent, setTeamIdOpponent] = useState("");
//   // const [teamHome, setTeamHome] = useState("");
//   // const [teamAway, setTeamAway] = useState("");
//   const [dateOfMatch, setDateOfMatch] = useState("");
//   const [isUploading, setIsUploading] = useState(false); // Modal visibility state
//   const [uploadProgress, setUploadProgress] = useState(0); // Progress percentage
//   const userReducer = useSelector((state) => state.user.value);
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false); // State to control modal visibility
//   const [deleteVideoObj, setDeleteVideoObj] = useState({});
//   const [videosList, setVideosList] = useState([]);

//   useEffect(() => {
//     console.log(
//       `sending video to ${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/upload-video`
//     );

//     if (!userReducer.token) {
//       // Redirect if token exists
//       router.push("/login");
//     }
//     fetchVideoListApiCall();
//   }, [userReducer]); // Run effect if token changes

//   const fetchVideoListApiCall = async () => {
//     console.log(`API URL: ${process.env.NEXT_PUBLIC_API_BASE_URL}/videos`);

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos`
//     );

//     if (response.status === 200) {
//       const resJson = await response.json();

//       // const statuses = {};
//       for (const elem in resJson) {
//         // console.log(`checking in resJson.videos Filename: ${elem.Filename} `);
//         console.log(`elem: ${elem}`);
//       }
//       // setDownloadStatuses(statuses);

//       const videosObjArray = resJson.videos.map((elem, i) => {
//         console.log(`video downloaded filename: ${elem.filename}`);
//         console.log(`video downloaded id: ${elem.id}`);
//         console.log("video downloaded timestamp:");
//         console.log(elem.setTimeStamps);
//         console.log(typeof elem.setTimeStamps);
//         return {
//           id: `${elem.id}`,
//           name: `${elem.matchName}`,
//           date: elem.date,
//           matchName: `${elem.matchId}`,
//           scripted: false,
//           durationOfMatch: elem.durationString,
//           filename: elem.filename,
//         };
//       });
//       setVideosList(videosObjArray);
//     } else {
//       console.log(`There was a server error: ${response.status}`);
//     }
//   };

//   const handleFileChange = (e) => {
//     console.log("in handleFileChange ");
//     const selectedFile = e.target.files[0];
//     console.log(`file: ${selectedFile}`);
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

//     const formData = new FormData();
//     formData.append("video", file);
//     formData.append("matchId", 1);

//     // formData.append("leagueId", leagueId);
//     // formData.append("teamIdAnalyzed", teamIdAnalyzed);
//     // formData.append("teamIdOpponent", teamIdOpponent);
//     // formData.append("dateOfMatch", dateOfMatch);
//     // formData.append("setTimeStamps", []);

//     const xhr = new XMLHttpRequest();

//     const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/upload`;
//     console.log(`sending POST request to ${api_url}`);
//     xhr.open("POST", api_url);

//     // Add the Authorization header with the token
//     if (userReducer.token) {
//       xhr.setRequestHeader("Authorization", `Bearer ${userReducer.token}`);
//     } else {
//       alert("You are not authorized. Please log in.");
//       router.push("/login");
//       return;
//     }

//     // Progress handler
//     xhr.upload.onprogress = (event) => {
//       // console.log("in xhr.upload.onprogress = (event) => {");
//       if (event.lengthComputable) {
//         const progress = Math.round((event.loaded / event.total) * 100);

//         // console.log(`progress: ${progress}`);
//         setUploadProgress(progress); // Update progress
//       }
//     };

//     // Load handler
//     xhr.onload = () => {
//       setIsUploading(false); // Hide modal
//       if (xhr.status === 200) {
//         const response = JSON.parse(xhr.response); // Parse the JSON response
//         console.log("xhr response:", response); // Log the entire response
//         console.log("newVideoId:", response.newVideoId); // Log newVideoId specifically

//         // Optionally dispatch newVideoId to the store
//         dispatch(setNewVideoId(response));

//         if (
//           window.confirm("Video uploaded successfully! Click OK to proceed.")
//         ) {
//           // router.push("/uploader-sets"); // Navigate to /uploader-sets
//           router.push("/uploader"); // Navigate to /uploader-sets
//         }
//         setFile(null);
//         setLeagueId("");
//         setTeamIdAnalyzed("");
//         setTeamIdOpponent("");
//         setDateOfMatch("");
//         e.target.reset();
//       } else {
//         alert(`Error: ${xhr.status} - ${xhr.statusText}`);
//       }
//     };

//     // Error handler
//     xhr.onerror = () => {
//       setIsUploading(false); // Hide modal
//       alert("An error occurred while uploading the video.");
//     };

//     // Send the request
//     xhr.send(formData);
//   };

//   const handleDelete = async (videoObj) => {
//     const fetchUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos`;
//     const response = await fetch(fetchUrl, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userReducer.token}`, // Add token to Authorization header
//       },
//       body: JSON.stringify({ videoId: videoObj.id }),
//     });
//     if (response.status == 200) {
//       fetchVideoListApiCall();
//       const resJson = await response.json();
//       window.alert(resJson.message);
//       setDeleteModalIsOpen(false);
//     } else {
//       window.alert(`There was a server error: ${response.status}`);
//     }
//   };

//   return (
//     <TemplateView>
//       <div>
//         <main className={styles.main}>
//           <div className={styles.mainTop}>
//             <h1 className={styles.title}>Video Uploader </h1>
//           </div>

//           {/* Bottom Section */}
//           <div className={styles.mainBottom}>
//             <form onSubmit={handleSubmit}>
//               {/* File Upload Input */}
//               <div>
//                 <label htmlFor="videoFileUpload">
//                   Upload a Movie (.mp4, .mov):
//                 </label>
//                 <input
//                   id="videoFileUpload"
//                   type="file"
//                   accept=".mp4, .mov"
//                   onChange={handleFileChange}
//                   required
//                 />
//               </div>

//               {/* Other Inputs */}
//               <div>
//                 <label htmlFor="title">League ID:</label>
//                 <input
//                   className={styles.inputText}
//                   onChange={(e) => setLeagueId(e.target.value)}
//                   value={leagueId}
//                   // placeholder="AUC"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="title">Team Analyzed:</label>
//                 <input
//                   className={styles.inputText}
//                   onChange={(e) => setTeamIdAnalyzed(e.target.value)}
//                   value={teamIdAnalyzed}
//                   placeholder="AUC"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="description">Team Opponent:</label>
//                 <input
//                   className={styles.inputText}
//                   onChange={(e) => setTeamIdOpponent(e.target.value)}
//                   value={teamIdOpponent}
//                   placeholder="AUC"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="category">Date:</label>
//                 <input
//                   id="date"
//                   type="date"
//                   value={dateOfMatch}
//                   onChange={(e) => setDateOfMatch(e.target.value)}
//                 />
//               </div>

//               {/* Submit Button */}
//               <button type="submit">Upload</button>
//             </form>
//           </div>
//           <div className={styles.divTableVideos}>
//             <TableVideos
//               setDeleteModalIsOpen={setDeleteModalIsOpen}
//               setDeleteVideoObj={setDeleteVideoObj}
//               videosList={videosList}
//             />
//           </div>
//         </main>
//         {/* Modal for Uploading */}
//         {isUploading && (
//           <div className={styles.modal}>
//             <div className={styles.modalContent}>
//               <p>Uploading... {uploadProgress}%</p>
//               <div className={styles.loadingBar}>
//                 <div
//                   className={styles.loadingProgress}
//                   style={{ width: `${uploadProgress}%` }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         )}
//         {deleteModalIsOpen && (
//           <div className={styles.modalOverlay}>
//             <div className={styles.modalContent}>
//               <div className={styles.modalTop}>
//                 <FontAwesomeIcon
//                   icon={faRectangleXmark}
//                   onClick={() => setDeleteModalIsOpen(false)}
//                   className={styles.closeModalIcon}
//                 />
//                 <h2>Are you sure?</h2>
//                 <div className={styles.divModalFilename}>
//                   <div> {deleteVideoObj.filename} </div>

//                   <div className={styles.divModalPort}>
//                     {deleteVideoObj.matchName}
//                   </div>

//                   <div>{deleteVideoObj.date}</div>
//                 </div>
//               </div>

//               <button
//                 className={styles.btnYesDelete}
//                 onClick={() => {
//                   console.log(" yes delete me");
//                   handleDelete(deleteVideoObj);
//                 }}
//               >
//                 Yes, delete
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </TemplateView>
//   );
// }
