import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { feedApi } from '@/features/feed';
import { PATHS } from '../../app/routes/paths';
import styles from './SearchResultsPage.module.scss';

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    const [results, setResults] = useState({ users: [], posts: [] });
    const [loading, setLoading] = useState(false);

    const getAvatarUrl = (item) => {
        const avatar = item?.avatarUrl || item?.avatar || item?.avatars?.[0]?.url;
        if (avatar) return avatar;

        const name = item?.userName || item?.displayUserName || 'User';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`;
    };

    useEffect(() => {
        if (query) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const data = await feedApi.globalSearch(query);
                    setResults(data || { users: [], posts: [] });
                } catch (error) {
                    console.error("Search failed:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [query]);

    if (loading) {
        return (
            <div className={styles.loadingState}>
                <div className="animate-pulse">Searching for your style...</div>
            </div>
        );
    }

    if (!query) {
        return (
            <div className={styles.searchContainer}>
                <div className={styles.emptyState}>Please enter a keyword to search.</div>
            </div>
        );
    }

    return (
        <div className={styles.searchContainer}>
            {/* Header */}
            <header className={styles.header}>
                <h1>
                    Results for: <span className={styles.queryHighlight}>"{query}"</span>
                </h1>
                <p className={styles.stats}>
                    Found {results.users?.length || 0} people and {results.posts?.length || 0} posts.
                </p>
            </header>

            <main className={styles.mainContent}>

                {/* LEFT COLUMN: PEOPLE */}
                <section className={styles.peopleColumn}>
                    <h2 className={styles.sectionTitle}>
                        People <span className={styles.dot}></span>
                    </h2>

                    <div className="space-y-4">
                        {results.users?.length > 0 ? (
                            results.users.map(user => (
                                <Link
                                    to={PATHS.EXPERT_PROFILE.replace(':id', user.accountId)}
                                    key={user.accountId}
                                    className={styles.userCard}
                                >
                                    <img
                                        src={getAvatarUrl(user)}
                                        className={styles.avatar}
                                        alt={user.userName}
                                    />
                                    <div className="flex-1 overflow-hidden">
                                        <p className={styles.userName}>{user.userName}</p>
                                        <p className={styles.expertise}>
                                            {user.expertiseField || 'Fashion Enthusiast'}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className={styles.emptyState}>No users found.</div>
                        )}
                    </div>
                </section>

                {/* RIGHT COLUMN: POSTS */}
                <section className={styles.postsColumn}>
                    <h2 className={styles.sectionTitle}>
                        Posts <span className={styles.dot}></span>
                    </h2>

                    <div className={styles.postsGrid}>
                        {results.posts?.length > 0 ? (
                            results.posts.map(post => (
                                <Link
                                    to={PATHS.POST_DETAIL.replace(':id', post.postId)}
                                    key={post.postId}
                                    className={styles.postCard}
                                >
                                    <div className={styles.imageWrapper}>
                                        <img
                                            src={post.images?.[0] || '/default-post.png'}
                                            alt={post.title}
                                        />
                                        {post.isExpertPost && (
                                            <span className={styles.expertBadge}>Expert</span>
                                        )}
                                    </div>

                                    <div className={styles.postContent}>
                                        <h3>{post.title}</h3>
                                        <p className={styles.author}>
                                            by <span>@{post.userName}</span>
                                        </p>

                                        <div className={styles.postFooter}>
                                            <div className={styles.stats}>
                                                <span>❤️ {post.likeCount}</span>
                                                <span>💬 {post.commentCount}</span>
                                            </div>
                                            <span className={styles.viewLink}>View Style →</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className={styles.emptyState}>
                                <p>No posts matching your style.</p>
                                <small>Try Another</small>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SearchResultsPage;