import Navbar from '@/widgets/Navbar';
import styles from './HomeLayout.module.scss';

function HomeLayout({ children }) {
  const isLoggedIn = true;
  return (
    <div className={styles.wrapper}>
      <Navbar isLoggedIn={isLoggedIn} />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}

export default HomeLayout;