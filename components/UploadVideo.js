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
  const [leagueId, setLeagueId] = useState("");
  const [teamIdAnalyzed, setTeamIdAnalyzed] = useState("");
  const [teamIdOpponent, setTeamIdOpponent] = useState("");
  // const [teamHome, setTeamHome] = useState("");
  // const [teamAway, setTeamAway] = useState("");
  const [dateOfMatch, setDateOfMatch] = useState("");
  const [isUploading, setIsUploading] = useState(false); // Modal visibility state
  const [uploadProgress, setUploadProgress] = useState(0); // Progress percentage
  const userReducer = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const router = useRouter();

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false); // State to control modal visibility
  const [deleteVideoObj, setDeleteVideoObj] = useState({});
  const [videosList, setVideosList] = useState([]);

  useEffect(() => {
    console.log(
      `sending video to ${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/upload-video`
    );

    if (!userReducer.token) {
      // Redirect if token exists
      router.push("/login");
    }
    fetchVideoListApiCall();
  }, [userReducer]); // Run effect if token changes

  const fetchVideoListApiCall = async () => {
    console.log(`API URL: ${process.env.NEXT_PUBLIC_API_BASE_URL}/videos`);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos`
    );

    if (response.status === 200) {
      const resJson = await response.json();

      // const statuses = {};
      for (const elem of resJson.videos) {
        console.log(`checking for: ${elem.filename} `);
      }
      // setDownloadStatuses(statuses);

      const videosObjArray = resJson.videos.map((elem, i) => {
        console.log(`creating object for: ${elem.filename}`);
        console.log(" -- What is the setTimeStamps ?");
        console.log(elem.setTimeStamps);
        console.log(typeof elem.setTimeStamps);
        return {
          id: `${elem.id}`,
          name: `${elem.matchName}`,
          date: elem.date,
          matchName: `${elem.matchName}`,
          scripted: false,
          durationOfMatch: elem.durationString,
          filename: elem.filename,
        };
      });
      setVideosList(videosObjArray);
    } else {
      console.log(`There was a server error: ${response.status}`);
    }
  };

  const handleFileChange = (e) => {
    console.log("in handleFileChange ");
    const selectedFile = e.target.files[0];
    console.log(`file: ${selectedFile}`);
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
    formData.append("leagueId", leagueId);
    formData.append("teamIdAnalyzed", teamIdAnalyzed);
    formData.append("teamIdOpponent", teamIdOpponent);
    formData.append("dateOfMatch", dateOfMatch);
    // formData.append("setTimeStamps", []);

    const xhr = new XMLHttpRequest();

    const api_url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/upload-video`;
    console.log(`sending POST request to ${api_url}`);
    xhr.open("POST", api_url);

    // Add the Authorization header with the token
    if (userReducer.token) {
      xhr.setRequestHeader("Authorization", `Bearer ${userReducer.token}`);
    } else {
      alert("You are not authorized. Please log in.");
      router.push("/login");
      return;
    }

    // Progress handler
    xhr.upload.onprogress = (event) => {
      console.log("in xhr.upload.onprogress = (event) => {");
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);

        console.log(`progress: ${progress}`);
        setUploadProgress(progress); // Update progress
      }
    };

    // Load handler
    xhr.onload = () => {
      setIsUploading(false); // Hide modal
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.response); // Parse the JSON response
        console.log("xhr response:", response); // Log the entire response
        console.log("newVideoId:", response.newVideoId); // Log newVideoId specifically

        // Optionally dispatch newVideoId to the store
        dispatch(setNewVideoId(response));

        if (
          window.confirm("Video uploaded successfully! Click OK to proceed.")
        ) {
          // router.push("/uploader-sets"); // Navigate to /uploader-sets
          router.push("/uploader"); // Navigate to /uploader-sets
        }
        setFile(null);
        setLeagueId("");
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

    // Send the request
    xhr.send(formData);
  };

  const handleDelete = async (videoObj) => {
    const fetchUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos`;
    const response = await fetch(fetchUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userReducer.token}`, // Add token to Authorization header
      },
      body: JSON.stringify({ videoId: videoObj.id }),
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
            <h1 className={styles.title}>Video Uploader </h1>
          </div>

          {/* Bottom Section */}
          <div className={styles.mainBottom}>
            <form onSubmit={handleSubmit}>
              {/* File Upload Input */}
              <div>
                <label htmlFor="videoFileUpload">
                  Upload a Movie (.mp4, .mov):
                </label>
                <input
                  id="videoFileUpload"
                  type="file"
                  accept=".mp4, .mov"
                  onChange={handleFileChange}
                  required
                />
              </div>

              {/* Other Inputs */}
              <div>
                <label htmlFor="title">League ID:</label>
                <input
                  className={styles.inputText}
                  onChange={(e) => setLeagueId(e.target.value)}
                  value={leagueId}
                  // placeholder="AUC"
                />
              </div>
              <div>
                <label htmlFor="title">Team Analyzed:</label>
                <input
                  className={styles.inputText}
                  onChange={(e) => setTeamIdAnalyzed(e.target.value)}
                  value={teamIdAnalyzed}
                  placeholder="AUC"
                />
              </div>
              <div>
                <label htmlFor="description">Team Opponent:</label>
                <input
                  className={styles.inputText}
                  onChange={(e) => setTeamIdOpponent(e.target.value)}
                  value={teamIdOpponent}
                  placeholder="AUC"
                />
              </div>
              <div>
                <label htmlFor="category">Date:</label>
                <input
                  id="date"
                  type="date"
                  value={dateOfMatch}
                  onChange={(e) => setDateOfMatch(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button type="submit">Upload</button>
            </form>
          </div>
          <div className={styles.divTableVideos}>
            <TableVideos
              setDeleteModalIsOpen={setDeleteModalIsOpen}
              setDeleteVideoObj={setDeleteVideoObj}
              videosList={videosList}
            />
          </div>
        </main>
        {/* Modal for Uploading */}
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
      </div>
    </TemplateView>
  );
}
