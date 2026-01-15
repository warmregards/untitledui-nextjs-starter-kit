"use client";

import { useState, useCallback } from "react";
import { Building2, Check, Mail, Upload, Users, X } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";

// ============================================================================
// Types
// ============================================================================

interface AdminWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

type WizardStep = 1 | 2;

// ============================================================================
// Step Indicator
// ============================================================================

const StepIndicator = ({ currentStep }: { currentStep: WizardStep }) => {
    const steps = [
        { number: 1, label: "Branding" },
        { number: 2, label: "Invite Team" },
    ];

    return (
        <div className="flex items-center justify-center gap-3">
            {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                    <div
                        className={cx(
                            "flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors",
                            currentStep > step.number
                                ? "bg-success-100 text-success-700"
                                : currentStep === step.number
                                    ? "bg-brand-600 text-white"
                                    : "bg-gray-100 text-gray-500"
                        )}
                    >
                        {currentStep > step.number ? (
                            <Check className="size-4" />
                        ) : (
                            step.number
                        )}
                    </div>
                    <span
                        className={cx(
                            "ml-2 text-sm font-medium",
                            currentStep >= step.number ? "text-primary" : "text-tertiary"
                        )}
                    >
                        {step.label}
                    </span>
                    {index < steps.length - 1 && (
                        <div
                            className={cx(
                                "mx-4 h-0.5 w-12",
                                currentStep > step.number ? "bg-success-500" : "bg-gray-200"
                            )}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

// ============================================================================
// Step 1: Branding
// ============================================================================

interface BrandingStepProps {
    logoFile: File | null;
    onLogoChange: (file: File | null) => void;
    onNext: () => void;
    onSkip: () => void;
}

const BrandingStep = ({ logoFile, onLogoChange, onNext, onSkip }: BrandingStepProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
                onLogoChange(file);
                setPreviewUrl(URL.createObjectURL(file));
            }
        },
        [onLogoChange]
    );

    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                onLogoChange(file);
                setPreviewUrl(URL.createObjectURL(file));
            }
        },
        [onLogoChange]
    );

    const handleRemove = useCallback(() => {
        onLogoChange(null);
        setPreviewUrl(null);
    }, [onLogoChange]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-brand-100">
                    <Building2 className="size-6 text-brand-600" />
                </div>
                <h2 className="text-lg font-semibold text-primary">Let's set up your workspace</h2>
                <p className="mt-1 text-sm text-tertiary">
                    Add your company logo to personalize Coreverus for your team.
                </p>
            </div>

            {/* Upload Zone */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-secondary">Company Logo</label>
                {previewUrl ? (
                    <div className="flex items-center gap-4 rounded-xl border border-secondary bg-gray-50 p-4">
                        <div className="size-16 overflow-hidden rounded-lg bg-white ring-1 ring-gray-200">
                            <img
                                src={previewUrl}
                                alt="Logo preview"
                                className="size-full object-contain"
                            />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-primary">{logoFile?.name}</p>
                            <p className="text-xs text-tertiary">
                                {logoFile && (logoFile.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                        <button
                            onClick={handleRemove}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                ) : (
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={cx(
                            "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors",
                            isDragging
                                ? "border-brand-500 bg-brand-50"
                                : "border-gray-300 bg-gray-50 hover:border-gray-400"
                        )}
                    >
                        <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-gray-100">
                            <Upload className="size-5 text-gray-500" />
                        </div>
                        <p className="text-sm font-medium text-primary">
                            Drag and drop your logo here
                        </p>
                        <p className="mt-1 text-xs text-tertiary">or</p>
                        <label className="mt-2 cursor-pointer">
                            <span className="text-sm font-medium text-brand-600 hover:text-brand-700">
                                Browse files
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                        </label>
                        <p className="mt-3 text-xs text-tertiary">PNG, JPG, or SVG (max 2MB)</p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Button color="secondary" size="lg" className="flex-1" onClick={onSkip}>
                    Skip for now
                </Button>
                <Button color="primary" size="lg" className="flex-1" onClick={onNext}>
                    Continue
                </Button>
            </div>
        </div>
    );
};

// ============================================================================
// Step 2: Invite Team
// ============================================================================

interface InviteStepProps {
    email: string;
    onEmailChange: (email: string) => void;
    onBack: () => void;
    onFinish: () => void;
}

const InviteStep = ({ email, onEmailChange, onBack, onFinish }: InviteStepProps) => {
    const [isSending, setIsSending] = useState(false);

    const handleFinish = async () => {
        if (email.trim()) {
            setIsSending(true);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setIsSending(false);
        }
        onFinish();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-brand-100">
                    <Users className="size-6 text-brand-600" />
                </div>
                <h2 className="text-lg font-semibold text-primary">Invite your team</h2>
                <p className="mt-1 text-sm text-tertiary">
                    Invite your first inspector to start collaborating on Coreverus.
                </p>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-secondary">Inspector Email Address</label>
                <Input
                    type="email"
                    placeholder="inspector@yourcompany.com"
                    icon={Mail}
                    value={email}
                    onChange={(value) => onEmailChange(value.toString())}
                />
                <p className="text-xs text-tertiary">
                    They will receive an email invitation to join your organization.
                </p>
            </div>

            {/* Info Box */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                    <span className="font-medium">Pro tip:</span> You can invite more team members
                    later from the Settings page.
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Button color="secondary" size="lg" className="flex-1" onClick={onBack}>
                    Back
                </Button>
                <Button
                    color="primary"
                    size="lg"
                    className="flex-1"
                    onClick={handleFinish}
                    isDisabled={isSending}
                >
                    {isSending ? "Sending..." : email.trim() ? "Send Invite & Finish" : "Skip & Finish"}
                </Button>
            </div>
        </div>
    );
};

// ============================================================================
// Main Component
// ============================================================================

export function AdminWizard({ isOpen, onClose, onComplete }: AdminWizardProps) {
    const [currentStep, setCurrentStep] = useState<WizardStep>(1);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [inviteEmail, setInviteEmail] = useState("");

    if (!isOpen) return null;

    const handleComplete = () => {
        console.log("Onboarding completed:", {
            logo: logoFile?.name || "No logo uploaded",
            inviteEmail: inviteEmail || "No invite sent",
        });
        onComplete();
    };

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 z-[100] bg-black/50" />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 z-[100] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                    <X className="size-5" />
                </button>

                {/* Content */}
                <div className="p-6">
                    {/* Step Indicator */}
                    <div className="mb-8">
                        <StepIndicator currentStep={currentStep} />
                    </div>

                    {/* Steps */}
                    {currentStep === 1 && (
                        <BrandingStep
                            logoFile={logoFile}
                            onLogoChange={setLogoFile}
                            onNext={() => setCurrentStep(2)}
                            onSkip={() => setCurrentStep(2)}
                        />
                    )}

                    {currentStep === 2 && (
                        <InviteStep
                            email={inviteEmail}
                            onEmailChange={setInviteEmail}
                            onBack={() => setCurrentStep(1)}
                            onFinish={handleComplete}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

export default AdminWizard;
