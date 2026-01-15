"use client";

import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Reset password for:", email);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div>
                <div className="mb-8">
                    <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-brand-100">
                        <Mail className="size-6 text-brand-600" />
                    </div>
                    <h1 className="text-display-xs font-semibold text-primary">Check your email</h1>
                    <p className="mt-2 text-sm text-tertiary">
                        We've sent password reset instructions to{" "}
                        <span className="font-medium text-secondary">{email}</span>
                    </p>
                </div>

                <div className="space-y-4">
                    <p className="text-sm text-tertiary">
                        Didn't receive the email? Check your spam folder or{" "}
                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="font-medium text-brand-600 hover:text-brand-700"
                        >
                            try another email address
                        </button>
                        .
                    </p>

                    <Button
                        color="secondary"
                        size="lg"
                        className="w-full"
                        href="/sign-in"
                        iconLeading={ArrowLeft}
                    >
                        Back to sign in
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-display-xs font-semibold text-primary">Forgot password?</h1>
                <p className="mt-2 text-sm text-tertiary">
                    No worries, we'll send you reset instructions.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-secondary">Email Address</label>
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        icon={Mail}
                        value={email}
                        onChange={(value) => setEmail(value.toString())}
                    />
                </div>

                {/* Submit */}
                <Button color="primary" size="lg" className="w-full" type="submit">
                    Send Reset Instructions
                </Button>

                {/* Back Link */}
                <Link
                    href="/sign-in"
                    className="flex items-center justify-center gap-2 text-sm font-medium text-tertiary hover:text-secondary"
                >
                    <ArrowLeft className="size-4" />
                    Back to sign in
                </Link>
            </form>
        </div>
    );
}
