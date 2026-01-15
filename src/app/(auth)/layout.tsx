import { Building2, Quote, Shield, Star } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            {/* Left Side - Form Area */}
            <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="mx-auto w-full max-w-md">
                    {/* Logo */}
                    <div className="mb-8 flex items-center gap-2">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-brand-600">
                            <Building2 className="size-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-primary">Coreverus</span>
                    </div>

                    {children}
                </div>
            </div>

            {/* Right Side - Brand/Testimonial Area */}
            <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-between bg-brand-700 p-12">
                {/* Top decorative pattern */}
                <div className="flex justify-end">
                    <div className="grid grid-cols-3 gap-2 opacity-20">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="size-2 rounded-full bg-white" />
                        ))}
                    </div>
                </div>

                {/* Testimonial */}
                <div className="max-w-lg">
                    <Quote className="size-12 text-brand-300" />
                    <blockquote className="mt-6 text-2xl font-medium leading-relaxed text-white">
                        "Coreverus has transformed how we manage property inspections. What used to take hours now takes minutes, and our team loves the intuitive interface."
                    </blockquote>
                    <div className="mt-8 flex items-center gap-4">
                        <div className="size-12 overflow-hidden rounded-full bg-brand-500">
                            <img
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&face"
                                alt="Testimonial"
                                className="size-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="font-semibold text-white">Marcus Thompson</p>
                            <p className="text-brand-200">CEO, PropertyHub Inc.</p>
                        </div>
                    </div>

                    {/* Star Rating */}
                    <div className="mt-6 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="size-5 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="ml-2 text-sm text-brand-200">5.0 rating</span>
                    </div>
                </div>

                {/* Bottom stats */}
                <div className="flex gap-12">
                    <div>
                        <p className="text-3xl font-bold text-white">10k+</p>
                        <p className="text-brand-200">Inspections completed</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-white">500+</p>
                        <p className="text-brand-200">Property managers</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-white">99.9%</p>
                        <p className="text-brand-200">Uptime</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
