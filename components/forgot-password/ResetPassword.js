// /components/forgot-password/ResetPassword.js
import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/ResetPassword.module.css";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

const ResetPassword = ({ token }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!password || password.length < 3) {
      alert("Please enter a password with at least 3 characters.");
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/reset-password/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      }
    );

    if (response.ok) {
      router.push("/forgot-password/reset-successful");
    } else {
      alert("Error resetting password. Please try again.");
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.divTitles}>
        <Image
          src="/images/KyberV2Shiny.png"
          width={315}
          height={47}
          alt="Kyber Vision Logo"
        />
      </div>
      <div className={styles.divMainSub}>
        <h1 className={styles.title}>Enter New Password:</h1>
        <div className={styles.inputContainer}>
          <input
            type={showPassword ? "text" : "password"}
            className={styles.inputPassword}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="New Password"
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            className={styles.eyeIcon}
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>
        <button className={styles.btnReset} onClick={handleResetPassword}>
          Reset Password
        </button>
      </div>
    </main>
  );
};

export default ResetPassword;
// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import styles from "../../styles/Register.module.css";

// const ResetPassword = ({ token }) => {
//   const [password, setPassword] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     if (!token) {
//       alert("Invalid or missing token.");
//       router.push("/forgot-password");
//     }
//   }, [token]);

//   const handleResetPassword = async () => {
//     if (!password || password.length < 3) {
//       alert("Please enter a password with at least 3 characters.");
//       return;
//     }

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/reset-password/${token}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ password }),
//       }
//     );

//     if (response.ok) {
//       router.push("/forgot-password/reset-successful");
//     } else {
//       alert("Error resetting password. Please try again.");
//     }
//   };

//   return (
//     <main className={styles.main}>
//       <div className={styles.divMainSub}>
//         <h1 className={styles.title}>Reset Password</h1>

//         <input
//           type="password"
//           className={styles.inputEmail}
//           onChange={(e) => setPassword(e.target.value)}
//           value={password}
//           placeholder="New Password"
//         />
//         <button className={styles.btnRegister} onClick={handleResetPassword}>
//           Reset Password
//         </button>
//       </div>
//     </main>
//   );
// };

// export default ResetPassword;
