"use client";

import { useState } from "react";
import { Building2, Save, Globe, Phone, MapPin, Briefcase, Upload, Camera, Check, X } from "lucide-react";

export default function CompanyProfilePage() {
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
        }, 2000);
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-[#378179] to-[#079E61] rounded-xl shadow-lg">
                        <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Company Profile</h1>
                </div>
                <p className="text-muted-foreground text-lg pl-14">Manage your company information and branding</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="border-2 shadow-xl rounded-2xl bg-white p-6 hover:shadow-2xl transition-all duration-300">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <Camera className="w-5 h-5 text-[#378179]" />
                            Company Logo
                        </h2>
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden group-hover:border-[#378179] transition-colors">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Company Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <Upload className="w-8 h-8 text-slate-400 group-hover:text-[#378179] transition-colors" />
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                            <p className="text-xs text-slate-500 text-center">
                                Upload your company logo<br />
                                Recommended: 200x200px PNG/JPG
                            </p>
                            {logoPreview && (
                                <button
                                    onClick={() => setLogoPreview(null)}
                                    className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                                >
                                    <X className="w-3 h-3" />
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="border-2 shadow-xl rounded-2xl bg-white p-6 hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-br from-[#378179] to-[#079E61] rounded-lg">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-semibold text-slate-900">Company Information</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-[#378179]" />
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Connectly360"
                                    className="h-12 border-2 border-slate-200 rounded-xl px-4 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#378179]/30 focus:border-[#378179] transition-all"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-blue-500" />
                                    Industry
                                </label>
                                <input
                                    type="text"
                                    placeholder="SaaS / Technology"
                                    className="h-12 border-2 border-slate-200 rounded-xl px-4 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-green-500" />
                                    Website
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://connectly360.com"
                                    className="h-12 border-2 border-slate-200 rounded-xl px-4 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-purple-500" />
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    className="h-12 border-2 border-slate-200 rounded-xl px-4 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
                                />
                            </div>
                            <div className="sm:col-span-2 flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-orange-500" />
                                    Address
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="123 Business Park, Mumbai, Maharashtra, India"
                                    className="border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-2 shadow-xl rounded-2xl bg-white p-6 hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-semibold text-slate-900">Additional Details</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">Company Size</label>
                                <select className="h-12 border-2 border-slate-200 rounded-xl px-4 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#378179]/30 focus:border-[#378179] transition-all">
                                    <option value="">Select size</option>
                                    <option value="1-10">1-10 employees</option>
                                    <option value="11-50">11-50 employees</option>
                                    <option value="51-200">51-200 employees</option>
                                    <option value="201-500">201-500 employees</option>
                                    <option value="500+">500+ employees</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">Founded Year</label>
                                <input
                                    type="number"
                                    placeholder="2020"
                                    min="1800"
                                    max={new Date().getFullYear()}
                                    className="h-12 border-2 border-slate-200 rounded-xl px-4 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#378179]/30 focus:border-[#378179] transition-all"
                                />
                            </div>
                            <div className="sm:col-span-2 flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700">Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us about your company mission and vision..."
                                    className="border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#378179]/30 focus:border-[#378179] transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <button className="px-6 py-3 border-2 border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#378179] to-[#079E61] hover:from-[#2d6a63] hover:from-[#068c55] text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={16} />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
