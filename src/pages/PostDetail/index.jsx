import { useParams } from 'react-router-dom';
import styles from '@/features/feed/styles/PostDetailPage.module.scss';
import { PostContent } from '@/features/feed';

const PostDetailPage = () => {
    const { id } = useParams();

    return (
        <div className={styles.pageContainer}>
            <PostContent id={id} mode="page" />
        </div>
    );
};

export default PostDetailPage;