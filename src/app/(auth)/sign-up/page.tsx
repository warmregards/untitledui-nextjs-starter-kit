"use client";

import { useState } from "react";
import { Building, Eye, EyeOff, Mail, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

export default function SignUpPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        companyName: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Sign up:", formData);
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-display-xs font-semibold text-primary">Start your 14-day free trial</h1>
                <p className="mt-2 text-sm text-tertiary">
                    Create your organization account and start managing inspections.
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

                {/* Company Name */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-secondary">Company Name</label>
                    <Input
                        placeholder="Your company name"
                        icon={Building}
                        value={formData.companyName}
                        onChange={(value) =>
                            setFormData((prev) => ({ ...prev, companyName: value.toString() }))
                        }
                    />
                    <p className="text-xs text-tertiary">
                        This will be the name of your organization in Coreverus.
                    </p>
                </div>

                {/* Work Email */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-secondary">Work Email</label>
                    <Input
                        type="email"
                        placeholder="you@company.com"
                        icon={Mail}
                        value={formData.email}
                        onChange={(value) =>
                            setFormData((prev) => ({ ...prev, email: value.toString() }))
                        }
                    />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-secondary">Password</label>
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

                {/* Submit */}
                <Button color="primary" size="lg" className="w-full" type="submit">
                    Create Account
                </Button>

                {/* Terms */}
                <p className="text-center text-sm text-tertiary">
                    By signing up, you agree to our{" "}
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

            {/* Sign In Link */}
            <p className="mt-8 text-center text-sm text-tertiary">
                Already have an account?{" "}
                <Link href="/sign-in" className="font-semibold text-brand-600 hover:text-brand-700">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
