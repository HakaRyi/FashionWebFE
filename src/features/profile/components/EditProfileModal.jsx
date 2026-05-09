import React, { useState, useEffect, useMemo } from 'react';
import { X, Camera, Loader2 } from 'lucide-react';
import { profileApi } from '../api/profileApi';
import styles from '../styles/EditProfileModal.module.scss';
import { toast } from 'react-toastify';

const EditProfileModal = ({ profile, isOpen, onClose, onUpdateSuccess }) => {
    const [loading, setLoading] = useState(false);
    const defaultAvatar = useMemo(() =>
        `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.username || 'User')}&background=random&size=128`,
        [profile?.username]
    );
    const [previewUrl, setPreviewUrl] = useState(profile?.avatar || defaultAvatar);
    const [avatarFile, setAvatarFile] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        description: '',
    });

    // Reset form khi mở modal
    useEffect(() => {
        if (profile && isOpen) {
            setFormData({
                username: profile.username || '',
                description: profile.description || '',
            });
            setPreviewUrl(profile.avatar || defaultAvatar);
            setAvatarFile(null);
        }
    }, [profile, isOpen, defaultAvatar]);

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Tạo toast loading
        const toastId = toast.loading('Updating your profile...');

        let isSuccess = false;

        try {
            const data = new FormData();
            data.append('Username', formData.username);
            data.append('Email', profile.email);
            data.append('Description', formData.description);
            if (avatarFile) data.append('Avatar', avatarFile);

            await profileApi.updateProfile(data);

            // Cập nhật toast thành công và đổi kiểu sang 'success'
            toast.update(toastId, {
                render: 'Profile updated successfully!',
                type: 'success',
                isLoading: false,
                autoClose: 3000
            });

            isSuccess = true;
        } catch (error) {
            const status = error.response?.status;
            const msg = error.response?.data?.message;
            let errorMessage = "Update failed. Please try again.";

            if (status === 409) {
                errorMessage = msg.toLowerCase().includes("email")
                    ? "This email is already in use."
                    : "This username is already taken.";
            } else if (status === 401) {
                errorMessage = "Session expired. Please log in again.";
            }

            toast.update(toastId, {
                render: errorMessage,
                type: 'error',
                isLoading: false,
                autoClose: 3000
            });
        } finally {
            setLoading(false);
            if (isSuccess) {
                onUpdateSuccess();
                onClose();
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.header}>
                    <h3>Edit Profile</h3>
                    <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.avatarUpload}>
                        <div className={styles.imageContainer}>
                            <img src={previewUrl} alt="Profile Preview" />
                            <label htmlFor="avatar-input" className={styles.cameraIcon}>
                                <Camera size={16} />
                                <input
                                    id="avatar-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    hidden
                                />
                            </label>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Email (Read-only)</label>
                        <input
                            type="text"
                            value={profile?.email || ''}
                            disabled
                            className={styles.disabled}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Bio / Description</label>
                        <textarea
                            rows="4"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                        <button type="submit" disabled={loading} className={styles.saveBtn}>
                            {loading ? <Loader2 className={styles.spin} size={18} /> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;