"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";

interface FormErrors {
  name?: string;
  email?: string;
  role?: string;
  general?: string;
}

export default function AddUserPage() {
  const [form, setForm] = useState({ name: "", email: "", role: "VIEWER" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Validation functions
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters long";
        if (value.trim().length > 50) return "Name must be less than 50 characters";
        if (!/^[a-zA-Z\s]*$/.test(value)) return "Name can only contain letters and spaces";
        return "";

      case "email":
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Please enter a valid email address";
        if (value.length > 100) return "Email must be less than 100 characters";
        return "";

      case "role":
        if (!value) return "Role is required";
        if (!["ADMIN", "EDITOR", "VIEWER"].includes(value)) return "Please select a valid role";
        return "";

      default:
        return "";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: validateField("name", form.name),
      email: validateField("email", form.email),
      role: validateField("role", form.role),
    };

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.role;
  };

  const handleFieldChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the validation errors before submitting");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await axios.post("/api/users", {
        ...form,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase()
      });
      toast.success("User created successfully!");
      router.push("/users");
    } catch (error) {
      console.error("Error creating user:", error);

      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error || "Something went wrong. Please try again later.";

        setErrors(prev => ({ ...prev, general: message }));
        toast.error(message);
      } else {
        setErrors(prev => ({ ...prev, general: "Network error. Please check your connection." }));
        toast.error("Network error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/users");
  };

  const hasErrors = Object.entries(errors)
    .some(([key, value]) => key !== "general" && value && value !== "");

  return (
    <div className="min-h-screen bg-base-200 items-center justify-center flex py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Card Container */}
        <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary to-primary-focus px-6 py-8">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="btn btn-circle btn-ghost btn-sm text-base-100 hover:bg-base-100/20"
                type="button"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-base-100">Add New User</h1>
                <p className="text-base-100/80 mt-1">Create a new user account with specific role</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {/* General Error Display */}
            {errors.general && (
              <div className="alert alert-error mb-6">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Name Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Full Name</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <input
                  className={`input input-bordered input-lg w-full ${
                    errors.name ? 'input-error' : 'focus:input-primary'
                  }`}
                  placeholder="Enter full name"
                  value={form.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={2}
                  maxLength={50}
                />
                {errors.name && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.name}</span>
                  </label>
                )}
              </div>

              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email Address</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <input
                  className={`input input-bordered input-lg w-full ${
                    errors.email ? 'input-error' : 'focus:input-primary'
                  }`}
                  placeholder="Enter email address"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  required
                  disabled={isLoading}
                  maxLength={100}
                />
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.email}</span>
                  </label>
                )}
              </div>

              {/* Role Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">User Role</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <select
                  className={`select select-bordered select-lg w-full ${
                    errors.role ? 'select-error' : 'focus:select-primary'
                  }`}
                  value={form.role}
                  onChange={(e) => handleFieldChange("role", e.target.value)}
                  disabled={isLoading}
                  required
                >
                  <option value="ADMIN">Administrator</option>
                  <option value="EDITOR">Editor</option>
                  <option value="VIEWER">Viewer</option>
                </select>
                {errors.role && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.role}</span>
                  </label>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-base-200">
                <button
                  type="button"
                  className="btn btn-outline btn-lg px-8"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg px-8"
                  disabled={isLoading || hasErrors}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}