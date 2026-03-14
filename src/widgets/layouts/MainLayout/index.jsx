import Navbar from '../../Navbar';
import styles from './MainLayout.module.scss';

const MainLayout = ({ children, fullWidth = false }) => {
    return (
        <div className={styles.wrapper}>
            <Navbar />
            <main className={`${styles.mainContent} ${fullWidth ? styles.fullWidth : ''}`}>
                {children}
            </main>
        </div>
    );
};

export default MainLayout;