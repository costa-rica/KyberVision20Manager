import styles from "../styles/TemplateView.module.css";
import NavigationBar from "./NavigationBar";

export default function TemplateView({
  children,
  onlyVersionsVisible = false,
}) {
  return (
    <>
      <header className={styles.headerCustom}>
        <NavigationBar onlyVersionsVisible={onlyVersionsVisible} />
      </header>
      <main className={styles.mainCustom}>{children}</main>
    </>
  );
}
