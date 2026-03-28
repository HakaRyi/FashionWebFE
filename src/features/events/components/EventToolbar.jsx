import React from "react";
import { Search } from "lucide-react";
import styles from "../styles/MyEvents.module.scss";

const EventToolbar = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className={styles.toolbar}>
            <div className={styles.searchBox}>
                <Search size={18} />
                <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.filters}>
                <button className={styles.activeFilter}>All</button>
                <button>Active</button>
                <button>Completed</button>
            </div>
        </div>
    );
};

export default EventToolbar;