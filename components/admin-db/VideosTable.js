import styles from "../../styles/VideosTable.module.css";
import { useDispatch, useSelector } from "react-redux";
// import { setNewVideoId } from "../reducers/user";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import TemplateView from "../TemplateView";
import TableVideos from "../TableVideos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRectangleXmark,
  faCircleMinus,
} from "@fortawesome/free-solid-svg-icons";
export default function VideosTable() {
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
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userReducer.token}`,
        },
      }
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
      if (xhr.status === 201) {
        setUploadProgress(100); // Ensure progress reaches 100%
        setTimeout(() => {
          setIsUploading(false); // Hide modal
          fetchVideoListApiCall(); // Refresh video list
          window.location.reload(); // Refresh the entire page
        }, 2000); // Small delay for user feedback
      } else {
        alert(`Error: ${xhr.status} - ${xhr.statusText}`);
        setIsUploading(false);
      }
    };

    // Error handler
    xhr.onerror = () => {
      setIsUploading(false); // Hide modal
      alert("An error occurred while uploading the video.");
    };

    xhr.send(formData);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!file) {
  //     alert("Please select a file to upload.");
  //     return;
  //   }

  //   setIsUploading(true); // Show modal
  //   setUploadProgress(0); // Reset progress

  //   const formData = new FormData();
  //   formData.append("video", file);
  //   formData.append("matchId", matchId);

  //   const xhr = new XMLHttpRequest();
  //   const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/upload`;
  //   xhr.open("POST", api_url);

  //   if (userReducer.token) {
  //     xhr.setRequestHeader("Authorization", `Bearer ${userReducer.token}`);
  //   } else {
  //     alert("You are not authorized. Please log in.");
  //     router.push("/login");
  //     return;
  //   }

  //   // Progress handler
  //   xhr.upload.onprogress = (event) => {
  //     if (event.lengthComputable) {
  //       const progress = Math.round((event.loaded / event.total) * 100);
  //       setUploadProgress(progress);
  //     }
  //   };

  //   // Load handler
  //   xhr.onload = () => {
  //     setIsUploading(false); // Hide modal
  //     if (xhr.status === 200) {
  //       alert("Video uploaded successfully!");
  //       fetchVideoListApiCall();
  //       setFile(null);
  //       setMatchId("");
  //       setTeamIdAnalyzed("");
  //       setTeamIdOpponent("");
  //       setDateOfMatch("");
  //       e.target.reset();
  //     } else {
  //       alert(`Error: ${xhr.status} - ${xhr.statusText}`);
  //     }
  //   };

  //   // Error handler
  //   xhr.onerror = () => {
  //     setIsUploading(false); // Hide modal
  //     alert("An error occurred while uploading the video.");
  //   };

  //   xhr.send(formData);
  // };

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
            <h1 className={styles.title}>Manage Videos</h1>
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
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                {uploadProgress < 100 ? (
                  <>
                    <p>Uploading... {uploadProgress}%</p>
                    <div className={styles.loadingBar}>
                      <div
                        className={styles.loadingProgress}
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </>
                ) : (
                  <p>
                    Almost finished ... this window will close when totally
                    complete
                  </p>
                )}
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
                    <div> Filename: {deleteVideoObj.filename} </div>

                    <div className={styles.divModalPort}>
                      Match ID: {deleteVideoObj.matchName}
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
