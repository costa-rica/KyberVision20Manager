import styles from "../styles/Login.module.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../reducers/user";
import { useRouter } from "next/router";
import InputPassword from "../components/InputPassword";
import Image from "next/image";

export default function Login() {
  const [email, emailSetter] = useState("");
  const [password, passwordSetter] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const userReducer = useSelector((state) => state.user.value);

  useEffect(() => {
    if (userReducer.token) {
      // Redirect if token exists
      router.push("/admin-db");
    }
  }, [userReducer]); // Run effect if token changes

  const sendPasswordBackToParent = (passwordFromInputPasswordElement) => {
    passwordSetter(passwordFromInputPasswordElement);
  };

  const handleClickLogin = async () => {
    console.log("Login ---> API URL");
    console.log(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`);
    console.log("- handleClickReg 👀");
    const bodyObj = { email, password };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyObj),
      }
    );
    console.log("received response");
    if (response.status == 200) {
      const resJson = await response.json();
      resJson.email=email
      console.log(resJson);
      dispatch(loginUser(resJson));
      console.log(resJson);
      dispatch(loginUser(resJson));
      // router.push("/uploader");
      router.push("/admin-db");
    } else {
      window.alert(`There was a server error: ${response.status}`);
    }
    console.log("🚨 after the fetch ");
  };

  const handleClickToReg = () => router.push("/register"); //eg.history.push('/login');

  return (
    <main className={styles.main}>
      <div className={styles.divMainSub}>
        <div className={styles.divTitles}>
          <Image
            src="/images/KyberV2Shiny.png"
            width={315}
            height={47}
            alt="Kyber Vision Logo"
          />
          <div>{process.env.NEXT_PUBLIC_API_BASE_URL}</div>
          <h1 className={styles.title}>Login</h1>
        </div>
        <div className={styles.divInputsAndBtns}>
          <div className={styles.divSuperInput}>
            <input
              className={styles.inputEmail}
              onChange={(e) => emailSetter(e.target.value)}
              value={email}
              placeholder="email"
            />
          </div>
          <InputPassword sendPasswordBackToParent={sendPasswordBackToParent} />
          <div className={styles.divBtnLogin}>
            <button
              className={styles.btnLogin}
              onClick={() => handleClickLogin()}
            >
              Login
            </button>
          </div>
          <div className={styles.divBtnNotReg}>
            <button
              className={styles.btnNotReg}
              onClick={() => {
                console.log("go to registration page");
                handleClickToReg();
              }}
            >
              Not registered ?
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
