import { useState, useEffect } from "react";
import styles from "../../../styles/tables/Table03Videos.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRectangleXmark,
  faCircleMinus,
} from "@fortawesome/free-solid-svg-icons";

export default function Table03Videos(props) {
  const [videosArray, setVideosArray] = useState([]);

  // useEffect(() => {

  //   // fetchVideoListApiCall();
  // }, []);

  return (
    <div className={styles.main}>
      <table className={styles.tableVideos}>
        <thead>
          <tr>
            <th> Date</th>
            <th className={styles.theadTr}>Video Filename</th>
            <th> Match Name</th>
            <th> Process Status</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {props.videosArray.map((elem, index) => {
            return (
              <tr key={index}>
                <td>{elem.date}</td>
                <td className={styles.tdFilename}>
                  {elem.filename}
                  <div className={styles.divTdVideoId}>
                    (videoId: {elem.id})
                  </div>
                </td>
                <td>{elem.matchName}</td>
                <td>{elem.processingStatus}</td>
                <td className={styles.tdRemove}>
                  {elem.processingStatus === "processed" ? (
                    <div className={styles.divTdRemove}>
                      <FontAwesomeIcon
                        icon={faCircleMinus}
                        onClick={() => {
                          console.log("pressed buttpon");
                          props.setDeleteVideoObj(elem);
                          props.setDeleteModalIsOpen(true);
                        }}
                        className={styles.iconDelete}
                      />
                    </div>
                  ) : (
                    <div> Cannot delete while processing...</div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
