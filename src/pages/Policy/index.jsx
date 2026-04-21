import React from 'react';
import { ShieldAlert, Star, BookOpen, AlertCircle, TrendingDown, CheckCircle, RotateCcw } from 'lucide-react';
import styles from './Policy.module.scss';

const Policy = () => {

  const penaltyRules = [
    { id: 1, action: "Missing grading below 10% of total assignments", points: "-2 points", type: "Reminder" },
    { id: 2, action: "Missing grading from 10% - 50% of total assignments", points: "-10 points", type: "Violation" },
    { id: 3, action: "Abandoning more than 50% of total assignments", points: "-20 points", type: "Serious Violation" },
    { id: 4, action: "Not completing any grading sessions", points: "-30 points", type: "Severe" },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Expert Reputation Policy</h1>
        <p>Automated system for evaluating responsibility and expertise of graders</p>
      </header>

      <div className={styles.grid}>
        {/* Hệ thống điểm */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Star className={styles.iconGold} />
            <h3>Reputation Score</h3>
          </div>
          <div className={styles.content}>
            <p>The default reputation score is <strong>100</strong>. This score reflects your professionalism.</p>
            <div className={styles.miniFeature}>
              <CheckCircle size={16} /> <span><b>Reward:</b> +5 points for completing 100% of assignments in an event.</span>
            </div>
            <div className={styles.miniFeature}>
              <CheckCircle size={16} /> <span><b>Benefits:</b> A higher score helps increase the weight of your article evaluations.</span>
            </div>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `100%` }}></div>
          </div>
        </div>

        {/* Cơ chế phục hồi */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <RotateCcw className={styles.iconBlue} />
            <h3>Recovery Mechanism</h3>
          </div>
          <div className={styles.content}>
            <p>The system always provides opportunities for experts to improve their reputation score through responsibility:</p>
            <ul className={styles.listList}>
              <li>Automatic point recovery after each successful event completion.</li>
              <li>Accumulate reputation points to earn the title "Trusted Expert".</li>
              <li>Low scores only affect the ranking of recommendations, not access rights.</li>
            </ul>
          </div>
        </div>
      </div>

      <section className={styles.policySection}>
        <div className={styles.sectionTitle}>
          <ShieldAlert />
          <h2>Responsibility Point Deduction Framework</h2>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Behavior (Based on Completion Rate)</th>
                <th>Category</th>
                <th>Deduction Level</th>
              </tr>
            </thead>
            <tbody>
              {penaltyRules.map(rule => (
                <tr key={rule.id}>
                  <td>{rule.action}</td>
                  <td><span className={styles.badge}>{rule.type}</span></td>
                  <td className={styles.penaltyScore}>
                    <TrendingDown size={14} /> {rule.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.note}>
          <AlertCircle size={24} />
          <div>
            <strong>Commitment from the system:</strong>
            <p>
              We <b>do not lock or suspend.</b> expert accounts may be suspended due to insufficient grading. However, if the reputation score is too low, the system will limit the frequency of invitations to major events to ensure fairness for all participants.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Policy;