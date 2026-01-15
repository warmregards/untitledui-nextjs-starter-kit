"use client";

import { useState } from "react";
import { Building2, Eye, EyeOff, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

// ============================================================================
// Mock Data (from invite link)
// ============================================================================

const INVITE_DATA = {
    companyName: "PropertyHub Inc.",
    companyLogo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
    inviterName: "Marcus Thompson",
    inviterEmail: "marcus@propertyhub.com",
    role: "Inspector",
};

// ============================================================================
// Component
// ============================================================================

export default function AcceptInvitePage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        console.log("Accept invite:", formData);
    };

    const passwordsMatch =
        formData.password.length > 0 &&
        formData.confirmPassword.length > 0 &&
        formData.password === formData.confirmPassword;

    return (
        <div>
            {/* Company Branding */}
            <div className="mb-8 flex flex-col items-center text-center">
                <div className="mb-4 size-16 overflow-hidden rounded-xl bg-gray-100 ring-2 ring-gray-200">
                    <img
                        src={INVITE_DATA.companyLogo}
                        alt={INVITE_DATA.companyName}
                        className="size-full object-cover"
                    />
                </div>
                <h1 className="text-display-xs font-semibold text-primary">
                    Join {INVITE_DATA.companyName} on Coreverus
                </h1>
                <p className="mt-2 text-sm text-tertiary">
                    You have been invited by{" "}
                    <span className="font-medium text-secondary">{INVITE_DATA.inviterName}</span> to
                    join as an {INVITE_DATA.role}.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-secondary">Full Name</label>
                    <Input
                        placeholder="Enter your full name"
                        icon={User}
                        value={formData.fullName}
                        onChange={(value) =>
                            setFormData((prev) => ({ ...prev, fullName: value.toString() }))
                        }
                    />
                </div>

                {/* Create Password */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-secondary">Create Password</label>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={(value) =>
                                setFormData((prev) => ({ ...prev, password: value.toString() }))
                            }
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                        </button>
                    </div>
                    <p className="text-xs text-tertiary">Must be at least 8 characters.</p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-secondary">Confirm Password</label>
                    <div className="relative">
                        <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(value) =>
                                setFormData((prev) => ({ ...prev, confirmPassword: value.toString() }))
                            }
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="size-5" />
                            ) : (
                                <Eye className="size-5" />
                            )}
                        </button>
                    </div>
                    {formData.confirmPassword.length > 0 && (
                        <p
                            className={`text-xs ${passwordsMatch ? "text-success-600" : "text-error-600"}`}
                        >
                            {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <Button color="primary" size="lg" className="w-full" type="submit">
                    Join Team
                </Button>

                {/* Terms */}
                <p className="text-center text-sm text-tertiary">
                    By joining, you agree to our{" "}
                    <Link href="#" className="font-medium text-brand-600 hover:text-brand-700">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="font-medium text-brand-600 hover:text-brand-700">
                        Privacy Policy
                    </Link>
                    .
                </p>
            </form>

            {/* Already have an account */}
            <p className="mt-8 text-center text-sm text-tertiary">
                Already have an account?{" "}
                <Link href="/sign-in" className="font-semibold text-brand-600 hover:text-brand-700">
                    Sign in instead
                </Link>
            </p>
        </div>
    );
}
