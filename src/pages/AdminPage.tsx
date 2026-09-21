import { useState } from 'react';

const initialForm = {
    username: '',
    password: '',
    confirmPassword: '',
    role: 'viewer',
};

export function AdminPage() {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (
        field: keyof typeof form,
        value: string
    ) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: '',
        }));
    };

    const validate = () => {
        const errors: Record<string, string> = {};

        if (!form.username.trim()) {
            errors.username = 'Username is required';
        } else if (form.username.length < 3) {
            errors.username = 'Minimum 3 characters';
        }

        if (!form.password) {
            errors.password = 'Password is required';
        } else if (form.password.length < 6) {
            errors.password = 'Minimum 6 characters';
        }

        if (form.password !== form.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        return errors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setSubmitted(true);
        setForm(initialForm);

        setTimeout(() => {
            setSubmitted(false);
        }, 3000);
    };

    const handleReset = () => {
        setForm(initialForm);
        setErrors({});
        setSubmitted(false);
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Admin Panel
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Create and manage system users.
                </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">
                    Create New User
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Create a new system user.
                </p>

                {submitted && (
                    <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
                        User created successfully!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Username
                            </label>

                            <input
                                type="text"
                                value={form.username}
                                onChange={(e) =>
                                    handleChange('username', e.target.value)
                                }
                                placeholder="e.g. john_doe"
                                className={`w-full rounded-md border px-3 py-2 outline-none ${errors.username
                                        ? 'border-red-500'
                                        : 'border-gray-300 focus:border-blue-500'
                                    }`}
                            />

                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Role
                            </label>

                            <select
                                value={form.role}
                                onChange={(e) =>
                                    handleChange('role', e.target.value)
                                }
                                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                            >
                                <option value="viewer">Viewer</option>
                                <option value="uploader">Uploader</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Password
                            </label>

                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) =>
                                    handleChange('password', e.target.value)
                                }
                                placeholder="Minimum 6 characters"
                                className={`w-full rounded-md border px-3 py-2 outline-none ${errors.password
                                        ? 'border-red-500'
                                        : 'border-gray-300 focus:border-blue-500'
                                    }`}
                            />

                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                value={form.confirmPassword}
                                onChange={(e) =>
                                    handleChange('confirmPassword', e.target.value)
                                }
                                placeholder="Re-enter password"
                                className={`w-full rounded-md border px-3 py-2 outline-none ${errors.confirmPassword
                                        ? 'border-red-500'
                                        : 'border-gray-300 focus:border-blue-500'
                                    }`}
                            />

                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Create User
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            className="rounded-md border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}