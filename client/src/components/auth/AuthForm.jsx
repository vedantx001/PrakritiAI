import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';

const initialFormState = {
	fullName: '',
	age: '',
	gender: '',
	email: '',
	password: '',
	confirmPassword: '',
};

const inputBaseClass =
	'w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all';

const inputNoIconBaseClass =
	'w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all';

const AuthForm = ({ mode, onSubmit, loading, serverError, initialValues = {} }) => {
	const isSignup = mode === 'signup';
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		...initialFormState,
		...initialValues,
	});

	const handleChange = (event) => {
		setFormData((prev) => ({
			...prev,
			[event.target.name]: event.target.value,
		}));
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		onSubmit(formData);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			{isSignup && (
				<div className="space-y-1.5">
					<label className="text-sm font-medium text-[var(--text-main)]">Full Name</label>
					<div className="relative group">
						<User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-emerald-600 transition-colors" />
						<input
							type="text"
							name="fullName"
							required
							placeholder="Mary Jane"
							value={formData.fullName}
							onChange={handleChange}
							className={inputBaseClass}
						/>
					</div>
				</div>
			)}

			{isSignup && (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-1.5">
						<label className="text-sm font-medium text-[var(--text-main)]">Age</label>
						<input
							type="number"
							name="age"
							required
							min={0}
							max={150}
							placeholder="24"
							value={formData.age}
							onChange={handleChange}
							className={inputNoIconBaseClass}
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-sm font-medium text-[var(--text-main)]">Gender</label>
						<select
							name="gender"
							required
							value={formData.gender}
							onChange={handleChange}
							className={inputNoIconBaseClass}
						>
							<option value="" disabled>
								Select
							</option>
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>
					</div>
				</div>
			)}

			<div className="space-y-1.5">
				<label className="text-sm font-medium text-[var(--text-main)]">Email Address</label>
				<div className="relative group">
					<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-emerald-600 transition-colors" />
					<input
						type="email"
						name="email"
						required
						placeholder="maryjane@example.com"
						value={formData.email}
						onChange={handleChange}
						className={inputBaseClass}
					/>
				</div>
			</div>

			<div className="space-y-1.5">
				<label className="text-sm font-medium text-[var(--text-main)]">Password</label>
				<div className="relative group">
					<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-emerald-600 transition-colors" />
					<input
						type={showPassword ? 'text' : 'password'}
						name="password"
						required
						placeholder="••••••••"
						value={formData.password}
						onChange={handleChange}
						className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] rounded-xl pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
					/>
					<button
						type="button"
						onClick={() => setShowPassword((prev) => !prev)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)]"
					>
						{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
					</button>
				</div>
			</div>

			{isSignup && (
				<div className="space-y-1.5">
					<label className="text-sm font-medium text-[var(--text-main)]">Confirm Password</label>
					<div className="relative group">
						<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] group-focus-within:text-emerald-600 transition-colors" />
						<input
							type="password"
							name="confirmPassword"
							required
							placeholder="••••••••"
							value={formData.confirmPassword}
							onChange={handleChange}
							className={inputBaseClass}
						/>
					</div>
				</div>
			)}

			{serverError && (
				<p className="text-sm text-red-600 bg-red-50/90 border border-red-200 px-3 py-2 rounded-lg">{serverError}</p>
			)}

			<button
				type="submit"
				disabled={loading}
				className="w-full bg-emerald-600 text-white font-bold rounded-xl py-3.5 shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
			>
				{loading ? (
					<Loader2 className="w-5 h-5 animate-spin" />
				) : (
					<>
						{isSignup ? 'Create Account' : 'Sign In'}
						<ArrowRight className="w-5 h-5" />
					</>
				)}
			</button>
		</form>
	);
};

export default AuthForm;

