import React, { useEffect, useMemo, useState } from 'react';
import { User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../context/useAuth';
import { updateProfile } from '../../../services/authService';
import { buildGenderAvatarUrl } from '../../../utils/avatar';

const UserProfile = () => {
  const { user, token, refreshProfile } = useAuth();
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    gender: 'male',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) return;
    // Ensure we have freshest profile fields (age/gender/etc.) from DB.
    refreshProfile?.().catch(() => {
      // ignore
    });
  }, [token, refreshProfile]);

  useEffect(() => {
    setForm({
      name: user?.name || user?.fullName || '',
      email: user?.email || '',
      age: user?.age ?? '',
      gender: user?.gender || 'male',
      password: '',
      confirmPassword: '',
    });
  }, [user]);

  const displayName = user?.name || user?.fullName || 'User';
  const displayRole = user?.role ? String(user.role).toUpperCase() : 'MEMBER';

  const avatarUrl = useMemo(
    () => buildGenderAvatarUrl({ name: displayName, gender: user?.gender }),
    [displayName, user?.gender]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const trimmedName = String(form.name || '').trim();
    const trimmedEmail = String(form.email || '').trim();
    const parsedAge = Number(form.age);
    const normalizedGender = String(form.gender || '').trim().toLowerCase();

    if (!trimmedName) {
      setErrorMessage('Full name is required.');
      return;
    }

    if (!trimmedEmail) {
      setErrorMessage('Email is required.');
      return;
    }

    if (!Number.isFinite(parsedAge) || parsedAge < 0 || parsedAge > 150) {
      setErrorMessage('Please enter a valid age (0-150).');
      return;
    }

    if (!['male', 'female'].includes(normalizedGender)) {
      setErrorMessage('Please select a valid gender.');
      return;
    }

    setIsSaving(true);
    try {
      const updates = {
        name: trimmedName,
        email: trimmedEmail,
        age: parsedAge,
        gender: normalizedGender,
      };

      const nextPassword = String(form.password || '').trim();
      const nextConfirmPassword = String(form.confirmPassword || '').trim();

      if (nextPassword) {
        if (nextPassword !== nextConfirmPassword) {
          setErrorMessage('New Password and Confirm Password do not match.');
          setIsSaving(false);
          return;
        }
        updates.password = nextPassword;
      }

      await updateProfile({ token, updates });
      await refreshProfile?.();
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      setSuccessMessage('Profile updated.');
    } catch (error) {
      setErrorMessage(error?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[var(--bg-primary)]">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-[var(--text-main)] mb-2">My Profile</h1>
        <p className="text-sm text-[var(--text-muted)]">View and update your account details.</p>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-[var(--bg-secondary)] ring-1 ring-[var(--border-color)] shadow-sm overflow-hidden flex items-center justify-center">
            {!avatarFailed && avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${displayName} profile`}
                className="h-full w-full object-cover"
                onError={() => setAvatarFailed(true)}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-[var(--text-brand)]">
                <User size={22} />
              </div>
            )}
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-[var(--text-main)]">{displayName}</span>
            <span className="text-sm text-[var(--text-muted)]">{displayRole}</span>
          </div>
        </div>


        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs text-[var(--text-muted)]">Full Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="mt-1 w-full px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)] focus:border-transparent"
                placeholder="Your name"
                autoComplete="name"
              />
            </label>

            <label className="block">
              <span className="text-xs text-[var(--text-muted)]">Email Address</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="mt-1 w-full px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)] focus:border-transparent"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label className="block">
              <span className="text-xs text-[var(--text-muted)]">Gender</span>
              <select
                value={form.gender}
                onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value }))}
                className="mt-1 w-full px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)] focus:border-transparent"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs text-[var(--text-muted)]">Age</span>
              <input
                type="number"
                min={0}
                max={150}
                value={form.age}
                onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value }))}
                className="mt-1 w-full px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)] focus:border-transparent"
                placeholder="Your age"
                autoComplete="off"
              />
            </label>

            <label className="block">
              <span className="text-xs text-[var(--text-muted)]">New Password (optional)</span>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)] focus:border-transparent pr-10"
                  placeholder="Leave blank to keep current"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <label className="block">
              <span className="text-xs text-[var(--text-muted)]">Confirm Password</span>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                className="mt-1 w-full px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--text-brand)] focus:border-transparent"
                placeholder="Confirm your new password"
                autoComplete="new-password"
              />
            </label>

            <div className="sm:col-span-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
              <p className="text-xs text-[var(--text-muted)]">Role</p>
              <p className="text-sm font-medium text-[var(--text-main)]">{displayRole}</p>
            </div>
          </div>

          {(errorMessage || successMessage) && (
            <div className="mt-4">
              {errorMessage ? (
                <p className="text-sm text-red-500">{errorMessage}</p>
              ) : (
                <p className="text-sm text-[var(--text-brand)]">{successMessage}</p>
              )}
            </div>
          )}

          <div className="mt-6 flex items-center justify-end">
            <button
              type="submit"
              disabled={!token || isSaving}
              className="px-5 py-2.5 rounded-xl bg-[var(--text-brand)] text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default UserProfile;
