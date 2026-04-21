import React from "react";
import { Search, CalendarDays } from "lucide-react";
import styles from "../styles/MyEvents.module.scss";

const EventToolbar = ({
    searchTerm, setSearchTerm,
    statusFilter, setStatusFilter,
    sortOrder, setSortOrder
}) => {
    return (
        <div className={styles.toolbar}>
            <div className={styles.searchBox}>
                <Search size={18} />
                <input
                    type="text"
                    placeholder="Search for events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.filters}>
                {/* Bộ lọc trạng thái */}
                <div className={styles.statusGroups}>
                    {["All", "Active", "Completed"].map((status) => (
                        <button
                            key={status}
                            className={statusFilter === status ? styles.activeFilter : ""}
                            onClick={() => setStatusFilter(status)}
                        >
                            {status === "All" ? "All" : status}
                        </button>
                    ))}
                </div>

                {/* Bộ lọc ngày tháng */}
                <div className={styles.dateSort}>
                    <CalendarDays size={18} />
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className={styles.sortSelect}
                    >
                        <option value="desc">Newest</option>
                        <option value="asc">Oldest</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default EventToolbar;