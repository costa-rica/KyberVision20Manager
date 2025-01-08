import styles from "../styles/Register.module.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../reducers/user";
import { useRouter } from "next/router";
import InputPassword from "../components/InputPassword";
import Image from "next/image";

export default function Register() {
  const [email, emailSetter] = useState("");
  const [password, passwordSetter] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.user.value);

  const sendPasswordBackToParent = (passwordFromInputPasswordElement) => {
    console.log(
      `- in sendPasswordBackToParent: ${passwordFromInputPasswordElement} ✅`
    );
    passwordSetter(passwordFromInputPasswordElement);
  };

  const handleClickReg = async () => {
    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    if (password.length < 3) {
      alert("Please enter password with at least 3 chars.");
      return;
    }

    const bodyObj = { email, password };
    // window.alert(`the api url: ${process.env.NEXT_PUBLIC_API_BASE_URL}`);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyObj),
      }
    );
    console.log("received response: ", response.status);
    if (response.status == 200) {
      const resJson = await response.json();
      console.log("Got a sucessful 200 response ✅️");
      console.log(resJson);
      dispatch(loginUser(resJson));
      alert("success ✅️");
      router.push("/uploader");
    } else if (response.status === 400 || response.status === 401) {
      const resJson = await response.json();
      alert(resJson.message);
    } else {
      alert(`There was a server error: ${response.status}`);
    }
    console.log("🚨 after the fetch ");
  };

  return (
    <main className={styles.main}>
      <div className={styles.divMainSub}>
        <div className={styles.divTitles}>
          <Image
            src="/images/kyberVisionLogo01.png"
            width={315}
            height={47}
            alt="Kyber Vision Logo"
          />
          <div>{process.env.NEXT_PUBLIC_API_BASE_URL}</div>
          <h1 className={styles.title}>Register</h1>
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
          <div className={styles.divBtnRegister}>
            <button
              className={styles.btnRegister}
              onClick={() => handleClickReg()}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
