import styles from "../styles/Versions.module.css";
import TemplateView from "../components/TemplateView";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

function VersionsOBE() {
  const userReducer = useSelector((state) => state.user.value);
  const router = useRouter();
  const { onlyVersionsVisible } = router.query;
  const onlyVersionsVisibleBool = onlyVersionsVisible === "true";
  // console.log("onlyVersionsVisible", onlyVersionsVisible);

  return (
    <TemplateView onlyVersionsVisible={onlyVersionsVisibleBool}>
      <div>
        <main className={styles.main}>
          <div className={styles.divMain}>
            <div className={styles.divVersion}>
              <h2 className={styles.title}>Version 0.6.0</h2>
              <h3>
                <p>
                  Download from Expo Go{" "}
                  <a href="https://expo.dev/preview/update?message=added%20font%20to%20other%20screens%3B%20modifs%20Scripting%20Portrait&updateRuntimeVersion=1.0.0&createdAt=2025-01-11T10%3A51%3A40.756Z&slug=exp&projectId=19bda6d6-1261-4ffc-9425-4e157bd11f4b&group=d469754a-d038-4726-aa79-ba9543efc788">
                    2025-01-11 release
                  </a>
                </p>
              </h3>
              <div>
                <h3>Next Steps</h3>
                <ul>
                  <li>Quality score not working </li>
                  <ul>
                    <li>probably implement device database to store quailty</li>
                  </ul>
                </ul>
              </div>

              <div>
                <h3>Accomplished</h3>
                <ul>
                  <li>Added new font: Apfel Grotesk</li>
                  <li>Timeline Landscape issues fixed</li>
                </ul>
              </div>
              {/* <div>
                <h3>Demo</h3>
                <ul>
                  <li>
                    Demo on iOS requires button to rotate to landscape Landscape
                  </li>
                  <li>
                    Android but no rotate button. Android adjusts orientation
                    automatically.
                  </li>
                </ul>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div>
                    <h4>iOS</h4>
                    <video
                      controls
                      style={{ width: "100%", marginBottom: "20px" }}
                    >
                      <source
                        src={`https://api.kv05.dashanddata.com/videos/demo/KV0.5.1.mp4`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div>
                    <h4>Android</h4>
                    <video
                      controls
                      style={{ width: "100%", marginBottom: "20px" }}
                    >
                      <source
                        src={`https://api.kv05.dashanddata.com/videos/demo/KV0.5.1android.mp4`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div> */}
            </div>
            <div className={styles.divVersion}>
              <h2 className={styles.title}>Version 0.5.1</h2>
              <h3>
                <p>
                  Download from Expo Go{" "}
                  <a href="https://expo.dev/preview/update?message=added%20controls%20to%20landscape%3B%20removed%20colors%20for%20dev&updateRuntimeVersion=1.0.0&createdAt=2025-01-04T08%3A18%3A59.415Z&slug=exp&projectId=a682a210-65f1-4eb4-afd8-8ab35c4da062&group=54da8b5e-2d8b-46f3-8572-6dd638a0eae2">
                    2025-01-04 release
                  </a>
                </p>
              </h3>
              <div>
                <h3>Next Steps</h3>
                <ul>
                  <li>Landscape needs work</li>
                  <ul>
                    <li>
                      Width dimensions seem to extend beyone the height of the
                      screen. Making closeing and opening difficult to implement
                    </li>
                  </ul>
                </ul>
              </div>

              <div>
                <h3>Accomplished</h3>
                <ul>
                  <li>Landscape implemented for ios and Android</li>
                  <li>Timeline Landscape issues fixed</li>
                </ul>
              </div>
              <div>
                <h3>Demo</h3>
                <ul>
                  <li>
                    Demo on iOS requires button to rotate to landscape Landscape
                  </li>
                  <li>
                    Android but no rotate button. Android adjusts orientation
                    automatically.
                  </li>
                </ul>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div>
                    <h4>iOS</h4>
                    <video
                      controls
                      style={{ width: "100%", marginBottom: "20px" }}
                    >
                      <source
                        src={`https://api.kv05.dashanddata.com/videos/demo/KV0.5.1.mp4`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  <div>
                    <h4>Android</h4>
                    <video
                      controls
                      style={{ width: "100%", marginBottom: "20px" }}
                    >
                      <source
                        src={`https://api.kv05.dashanddata.com/videos/demo/KV0.5.1android.mp4`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.divVersion}>
              <h2 className={styles.title}>Version 0.5.0</h2>
              <h3>
                <p>
                  Download from Expo Go{" "}
                  <a href="https://expo.dev/preview/update?message=Portrait%20mode%20scripting%20looks%20ok&updateRuntimeVersion=1.0.0&createdAt=2025-01-03T17%3A10%3A12.024Z&slug=exp&projectId=a682a210-65f1-4eb4-afd8-8ab35c4da062&group=492b26a4-2835-4e07-a63c-1f13e34d9f08">
                    2025-01-03 release
                  </a>
                </p>
              </h3>
              <div>
                <h3>Next Steps</h3>
                <ul>
                  <li>Landscape needs work</li>
                  <ul>
                    <li>
                      Custom Timeline Gestures not advancing play.currentTime
                    </li>
                    <li>
                      Custom Timeline not displaying action timestamps circles
                    </li>
                  </ul>
                  <li>
                    Ensure Android auto orient functions correctly resize styles
                  </li>
                </ul>
              </div>

              <div>
                <h3>Accomplished</h3>
                <ul>
                  <li>termenology scripts is now actions</li>
                  <li>
                    Portriat orientation displays timeline with markers for
                    actions
                  </li>
                  <li>
                    New database structure: where actions is the primary table
                    storing the timestamps and relative information
                  </li>
                  <ul>
                    <li>Scripts</li>
                    <li>Actions</li>
                    <li>Videos</li>
                  </ul>
                  <li>Actions downloaded from API when video selected</li>
                  <li>
                    Delete script (all actions) button and connected to API
                  </li>
                  <li>Register new actions button and connected to API</li>
                </ul>
              </div>
            </div>
            <div className={styles.divVersion}>
              <h2 className={styles.title}>Version 0.2.0</h2>
              <h3>
                Download from Expo Go{" "}
                <a href="https://expo.dev/preview/update?message=probably%20need%20to%20redo%20landscape%20altogether&updateRuntimeVersion=1.0.0&createdAt=2025-01-03T10%3A56%3A44.595Z&slug=exp&projectId=a682a210-65f1-4eb4-afd8-8ab35c4da062&group=f5b4d6f6-812f-4ed7-ab85-0b37cfdd2d43">
                  2024-12-28 release
                </a>
              </h3>
              <div>
                <h3>Next Steps</h3>
                <ul>
                  <li>Login automatic</li>
                  <li>Custom Timeline</li>
                  <li>Videos Downloaded</li>
                </ul>
              </div>
              <div>
                <h3>Accomplished</h3>
                <ul>
                  <li>Login automatic</li>
                  <li>Custom Timeline</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </TemplateView>
  );
}

export default Versions;
