import MainLayout from '@/widgets/layouts/MainLayout';
import ExpertSidebar from '@/widgets/Sidebar';
import styles from './ExpertLayout.module.scss';

const ExpertLayout = ({ children }) => {
    return (
        <MainLayout fullWidth={true}>
            <div className={styles.expertWrapper}>
                <aside className={styles.sidebarContainer}>
                    <ExpertSidebar />
                </aside>
                <section className={styles.workspace}>
                    {children}
                </section>
            </div>
        </MainLayout>
    );
};

export default ExpertLayout;