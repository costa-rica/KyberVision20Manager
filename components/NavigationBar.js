import styles from "../styles/NavigationBar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { logoutUser } from "../reducers/user";

export default function NavigationBar() {
  // const user = useSelector((state) => state.user.value);
  const userReducer = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null); // Create a ref for the menu container
  const router = useRouter();
  // const currentPath = router.pathname;
  const toggleMenu = () => {
    // setMenuOpen((prev) => !prev);<--- toggles
    setMenuOpen(true);
  };

  // Handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false); // Close the menu if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const pressedLogoutUser = () => {
    dispatch(logoutUser());
    alert("Logged out");
  };

  return (
    <nav className="nav-custom">
      <div className={styles.divHeaderTop}>
        <div className={styles.divHeaderTopLeft}>
          {/* <h1 className={styles.h1AppName}>The 404 Server Manager</h1> */}
          {/* <h2 className={styles.h2MachineName}>{user.machineName}</h2> */}
          <Image
            src="/images/KyberV2Shiny.png"
            width={315}
            height={47}
            alt="Kyber Vision Logo"
          />
          <h2 className={styles.h2MachineName}>{userReducer.email}</h2>
        </div>
        <div className={styles.divHeaderRight}>
          <button
            className={styles.hamburgerMenu}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <FontAwesomeIcon
              icon={faBars}
              style={{ fontSize: "xx-large", color: "white" }}
            />
          </button>
          <ul
            className={`${styles.divHeaderRightUl} ${
              menuOpen ? styles.menuOpen : ""
            }`}
            ref={menuRef}
          >
            <li className={styles.divHeaderRightLi}>
              <button onClick={() => router.push("/uploader")}>Upload</button>
              <button onClick={() => router.push("/versions")}>Versions</button>
              <button onClick={() => pressedLogoutUser()}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
      {/* <div className={styles.divLine}></div> */}
    </nav>
  );
}
