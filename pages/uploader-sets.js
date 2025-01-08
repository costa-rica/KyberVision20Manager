import styles from "../styles/UploadVideo.module.css";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import TemplateView from "../components/TemplateView";

export default function UploaderSets() {
  const [sets, setSets] = useState([1, 2, 3]); // Start with 3 sets
  const videoRef = useRef(null); // Reference for the video
  const userReducer = useSelector((state) => state.user.value);
  const router = useRouter();

  useEffect(() => {
    console.log(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/${userReducer.newVideoFilename}`
    );

    if (!userReducer.token) {
      // Redirect if token exists
      router.push("/login");
    }
  }, [userReducer]); // Run effect if token changes
  // Handle adding a new set
  const handleAddSet = () => {
    if (sets.length < 5) {
      setSets([...sets, sets.length + 1]); // Add the next set
    }
  };

  // Get the current timestamp from the video
  const handleTimestamp = (index) => {
    if (videoRef.current) {
      //   const currentTime = Math.floor(videoRef.current.currentTime / 60); // Get minutes
      //   document.getElementById(`set-input-${index}`).value = currentTime; // Set input value
      document.getElementById(`set-input-${index}`).value =
        videoRef.current.currentTime; // Set input value
    }
  };

  // Handle submission
  const handleSubmit = async () => {
    const timestamps = sets.map((set) => {
      const inputValue = Number(
        document.getElementById(`set-input-${set}`).value
      );
      return inputValue;
      //return parseInt(inputValue, 10) * 60; // Convert minutes to seconds
    });

    for (let i = 1; i < timestamps.length; i++) {
      if (timestamps[i] <= timestamps[i - 1]) {
        alert(`Error: Set #${i + 1} must have a time greater than Set #${i}`);
        return;
      }
    }

    const bodyObj = {
      setTimeStampsArray: timestamps,
      videoId: userReducer.newVideoId,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/uploader-video-sets`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userReducer.token}`, // Add token to Authorization header
        },
        body: JSON.stringify(bodyObj),
      }
    );
    console.log("received response");
    if (response.status == 200) {
      const resJson = await response.json();
      console.log(resJson);
      if (
        window.confirm(
          "Video set times successfully added! Click OK to proceed."
        )
      ) {
        router.push("/uploader"); // Navigate to /uploader-sets
      }
    } else {
      window.alert(`There was a server error: ${response.status}`);
    }
    console.log("Timestamps in seconds:", timestamps); // Print to console
  };

  return (
    <TemplateView>
      <div>
        <main className={styles.main}>
          <div className={styles.mainTop}>
            <h1 className={styles.title}>Enter Match Set Start Times </h1>
          </div>

          {/* Bottom Section */}
          <div className={styles.mainBottom}>
            <video
              ref={videoRef}
              controls
              style={{ width: "100%", marginBottom: "20px" }}
            >
              <source
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/videos/${userReducer.newVideoFilename}`}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
            <div>
              Filename: {userReducer.newVideoFilename}
              <br />
              Video ID: {userReducer.newVideoId}
              <br />
              <br />
              <p>
                Enter the match set start times in each input below. They should
                be in seconds from the start of the video.
              </p>
              <h3>Instructions:</h3>
              <ol>
                <li>Set #1 should start 0</li>

                <li>
                  For subsequent steps you can move the timeline of the video to
                  the start of the set and click the green "Get Time" button to
                  the right of the corresponding set.
                </li>
              </ol>
              <br />
            </div>

            {sets.map((set, index) => (
              <div
                key={set}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <label
                  htmlFor={`set-input-${set}`}
                  style={{ marginRight: "10px" }}
                >
                  Set #{set}
                </label>
                <input
                  id={`set-input-${set}`}
                  type="text"
                  placeholder={`Set #${set} time in seconds`}
                  style={{ flex: "1", marginRight: "10px" }}
                />
                <button
                  type="button"
                  onClick={() => handleTimestamp(set)}
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  Get Time
                </button>
              </div>
            ))}

            {sets.length < 5 && (
              <button
                type="button"
                onClick={handleAddSet}
                style={{
                  marginTop: "20px",
                  backgroundColor: "blue",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  cursor: "pointer",
                }}
              >
                Add Set
              </button>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              style={{
                marginTop: "30px",
                backgroundColor: "darkblue",
                color: "white",
                border: "none",
                padding: "10px 20px",
                cursor: "pointer",
                display: "block",
                width: "100%",
              }}
            >
              Submit
            </button>
          </div>
        </main>
      </div>
    </TemplateView>
  );
}
