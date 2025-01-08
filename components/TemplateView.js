import styles from "../styles/TemplateView.module.css";
import NavigationBar from "./NavigationBar";

export default function TemplateView({ children }) {
  return (
    <>
      <header className={styles.headerCustom}>
        <NavigationBar />
      </header>
      <main className={styles.mainCustom}>{children}</main>
    </>
  );
}
