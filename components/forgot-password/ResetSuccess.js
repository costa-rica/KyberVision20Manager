// /components/forgot-password/ResetSuccess.js
import styles from "../../styles/Register.module.css";
import Image from "next/image";

const ResetSuccess = () => {
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
        <h1 className={styles.title}>Successfully updated your password.</h1>
        <p>Please sign in again.</p>
      </div>
    </main>
  );
};

export default ResetSuccess;
