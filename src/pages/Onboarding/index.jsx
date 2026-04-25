import React from 'react';
import { useOnboarding } from '@/features/accounts';
import styles from './Onboarding.module.scss';

const Onboarding = () => {
    const {
        step,
        setStep,
        loading,
        formData,
        isAddingOther,
        setIsAddingOther,
        customStyle,
        setCustomStyle,
        customHex,
        customBrand,
        setCustomBrand,
        handleAddBrand,
        filteredBrands,
        STYLE_OPTIONS,
        COLOR_OPTIONS,
        MATERIAL_OPTIONS,
        isStep1Incomplete,
        isStep1PartiallyEmpty,
        handleChange,
        handleTogglePreference,
        handleAddCustomStyle,
        handleCustomColorChange,
        handleComplete
    } = useOnboarding();

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {/* Thanh chỉ số bước */}
                <div className={styles.stepIndicator}>
                    <div className={`${styles.dot} ${step === 1 ? styles.active : ''}`} />
                    <div className={`${styles.dot} ${step === 2 ? styles.active : ''}`} />
                </div>

                {/* BƯỚC 1: THÔNG TIN CÁ NHÂN */}
                {step === 1 && (
                    <div className={styles.content}>
                        <div className={styles.header}>
                            <h2>Personal Information</h2>
                            <p>Help us tailor the best experience for you</p>
                        </div>

                        {isStep1PartiallyEmpty && formData.gender && (
                            <div className={styles.softWarning}>
                                <span>Providing height and weight helps us suggest the perfect fit for you.</span>
                            </div>
                        )}

                        <div className={styles.formSection}>
                            <div className={styles.field}>
                                <label>Gender <span>*</span></label>
                                <select name="gender" value={formData.gender || ""} onChange={handleChange}>
                                    <option value="">Select Gender</option>
                                    <option value="1">Male</option>
                                    <option value="2">Female</option>
                                    <option value="3">Other</option>
                                </select>
                            </div>

                            <div className={styles.grid}>
                                <div className={styles.field}>
                                    <label>Height (cm)</label>
                                    <input type="number" name="height"
                                        min="0"
                                        placeholder="e.g. 170" value={formData.height || ""} onChange={handleChange} />
                                </div>
                                <div className={styles.field}>
                                    <label>Weight (kg)</label>
                                    <input type="number" name="weight"
                                        min="0"
                                        placeholder="e.g. 60" value={formData.weight || ""} onChange={handleChange} />
                                </div>
                            </div>

                            <div className={styles.threeColumns}>
                                <div className={styles.field}>
                                    <label>Bust</label>
                                    <input type="number" name="bust"
                                        min="0"
                                        placeholder="cm" value={formData.bust || ""}
                                        onChange={handleChange} />
                                </div>
                                <div className={styles.field}>
                                    <label>Waist</label>
                                    <input type="number" name="waist"
                                        min="0"
                                        placeholder="cm" value={formData.waist || ""}
                                        onChange={handleChange} />
                                </div>
                                <div className={styles.field}>
                                    <label>Hip</label>
                                    <input type="number" name="hip"
                                        min="0"
                                        placeholder="cm" value={formData.hip || ""}
                                        onChange={handleChange} />
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label>Skin Tone</label>
                                <select name="skinTone" value={formData.skinTone} onChange={handleChange}>
                                    <option value="">Select Skin Tone</option>
                                    <option value="Fair">Fair</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Olive">Olive</option>
                                    <option value="Dark">Dark</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.footer}>
                            <div />
                            <button
                                className={styles.btnPrimary}
                                disabled={isStep1Incomplete}
                                onClick={() => setStep(2)}
                            >
                                Next Step
                            </button>
                        </div>
                    </div>
                )}

                {/* BƯỚC 2: SỞ THÍCH PHONG CÁCH */}
                {step === 2 && (
                    <div className={styles.content}>
                        <div className={styles.header}>
                            <h2>Your Style Preferences</h2>
                            <p>Select the vibes you're interested in</p>
                        </div>

                        <div className={styles.formSection}>
                            {/* Section: Styles */}
                            <div className={styles.preferenceGroup}>
                                <h4>Favorite Styles & Materials</h4>
                                <div className={styles.tagCloud}>
                                    {STYLE_OPTIONS.map(s => (
                                        <div
                                            key={s}
                                            className={`${styles.tag} ${formData.favoriteStyles.includes(s) ? styles.selected : ''}`}
                                            onClick={() => handleTogglePreference('favoriteStyles', s)}
                                        >
                                            {s}
                                        </div>
                                    ))}

                                    {/* Render custom styles đã add */}
                                    {formData.favoriteStyles.filter(s => !STYLE_OPTIONS.includes(s)).map(s => (
                                        <button
                                            key={s}
                                            className={`${styles.tag} ${styles.selected}`}
                                            onClick={() => handleTogglePreference('favoriteStyles', s)}
                                        >
                                            {s} <span className={styles.removeTag}>×</span>
                                        </button>
                                    ))}

                                    {!isAddingOther ? (
                                        <button className={styles.btnAddOther} onClick={() => setIsAddingOther(true)}>
                                            + Add Other
                                        </button>
                                    ) : (
                                        <div className={styles.customInputGroup}>
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="e.g. Silk, Techwear..."
                                                value={customStyle}
                                                onChange={(e) => setCustomStyle(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomStyle()}
                                                onBlur={() => !customStyle && setIsAddingOther(false)}
                                            />
                                            <button onClick={handleAddCustomStyle}>Add</button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section: Materials */}
                            <div className={styles.preferenceGroup}>
                                <h4>Favorite Materials</h4>
                                <div className={styles.tagCloud}>
                                    {MATERIAL_OPTIONS.map(m => (
                                        <div
                                            key={m}
                                            className={`${styles.tag} ${formData.favoriteMaterials.includes(m) ? styles.selected : ''}`}
                                            onClick={() => handleTogglePreference('favoriteMaterials', m)}
                                        >
                                            {m}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={styles.footer}>
                            <button className={styles.btnBack} onClick={() => setStep(1)}>Back</button>
                            <button className={styles.btnPrimary} onClick={() => setStep(3)}>Next: Brands & Colors</button>
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div className={styles.content}>
                        <div className={styles.header}>
                            <h2>Final Touches</h2>
                            <p>Almost done! Tell us your brand and color taste</p>
                        </div>
                        <div className={styles.formSection}>
                            {/* BRAND SEARCH SECTION */}
                            <div className={styles.preferenceGroup}>
                                <h4>Favorite Brands</h4>
                                <div className={styles.searchContainer}>
                                    <input
                                        type="text"
                                        placeholder="Search brands (e.g. Nike, Zara...)"
                                        value={customBrand}
                                        onChange={(e) => setCustomBrand(e.target.value)}
                                    />
                                    {filteredBrands.length > 0 && (
                                        <ul className={styles.suggestions}>
                                            {filteredBrands.map(b => (
                                                <li key={b} onClick={() => { handleAddBrand(b); setCustomBrand(''); }}>
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className={styles.tagCloud} style={{ marginTop: '12px' }}>
                                    {formData.favoriteBrands.map(brand => (
                                        <button key={brand} className={`${styles.tag} ${styles.selected}`} onClick={() => handleTogglePreference('favoriteBrands', brand)}>
                                            {brand} <span className={styles.removeTag}>×</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* COLORS SECTION */}
                            <div className={styles.preferenceGroup}>
                                <h4>Preferred Colors</h4>
                                <div className={styles.colorGrid}>
                                    {COLOR_OPTIONS.map(c => (
                                        <div
                                            key={c.name}
                                            className={`${styles.colorCircleWrapper} ${formData.favoriteColors.includes(c.name) ? styles.selectedColor : ''}`}
                                            onClick={() => handleTogglePreference('favoriteColors', c.name)}
                                        >
                                            <div
                                                className={styles.colorCircle}
                                                style={{
                                                    backgroundColor: c.hex,
                                                    border: c.name === 'White' ? '1px solid #ddd' : 'none'
                                                }}
                                            />
                                            <span>{c.name}</span>
                                        </div>
                                    ))}
                                    <div className={styles.customPickerWrapper}>
                                        <div className={styles.pickerInput}>
                                            <input type="color" value={customHex} onChange={handleCustomColorChange} />
                                        </div>
                                        <span>Custom</span>
                                    </div>
                                </div>

                                <div className={styles.selectedCustomTags}>
                                    {formData.favoriteColors.map(name => (
                                        <div key={name} className={styles.colorTag}>
                                            {name}
                                            <span onClick={() => handleTogglePreference('favoriteColors', name)}>×</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={styles.footer}>
                            <button className={styles.btnBack} onClick={() => setStep(2)}>Back</button>
                            <div className={styles.actions}>
                                <button className={styles.btnSkip} onClick={handleComplete}>Skip</button>
                                <button className={styles.btnPrimary} onClick={handleComplete} disabled={loading}>
                                    {loading ? "Saving..." : "Finish"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Onboarding;