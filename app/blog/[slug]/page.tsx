"use client";

import React, { use } from "react";
import Link from "next/link";
import {
    Calendar,
    Clock,
    ArrowLeft,
    Sparkles,
    BookOpen,
    Share2,
    CheckCircle2
} from "lucide-react";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { blogPosts } from "../posts";
import { toast } from "sonner";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const slug = resolvedParams.slug;
    const post = blogPosts.find((p) => p.slug === slug);

    const handleShare = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Article link copied to clipboard!");
        }
    };

    if (!post) {
        return (
            <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden selection:bg-[#35877D] selection:text-white">
                <LandingHeader />
                <main className="pt-40 pb-24 flex items-center justify-center">
                    <div className="w-full px-4 max-w-md text-center space-y-6">
                        <div className="h-16 w-16 bg-red-50 border border-red-200 text-red-500 rounded-full flex items-center justify-center shadow-xs mx-auto">
                            <BookOpen size={28} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-extrabold text-slate-900">Article Not Found</h2>
                            <p className="text-sm text-gray-550 font-semibold leading-relaxed">
                                The article you are looking for does not exist or has been moved to a new route.
                            </p>
                        </div>
                        <Button asChild className="bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-xs font-bold px-6 shadow-sm">
                            <Link href="/blog">Back to Blog Grid</Link>
                        </Button>
                    </div>
                </main>
                <LandingFooter />
            </div>
        );
    }

    // A lightweight parser to convert simple markdown content into React components
    const renderContent = () => {
        const lines = post.content.split("\n");
        const renderedElements: React.ReactNode[] = [];
        let listItems: React.ReactNode[] = [];
        let listType: "ul" | "ol" | null = null;

        const flushList = (key: number) => {
            if (listItems.length > 0) {
                if (listType === "ul") {
                    renderedElements.push(
                        <ul key={`ul-${key}`} className="space-y-2.5 my-5">
                            {...listItems}
                        </ul>
                    );
                } else if (listType === "ol") {
                    renderedElements.push(
                        <ol key={`ol-${key}`} className="space-y-2.5 my-5">
                            {...listItems}
                        </ol>
                    );
                }
                listItems = [];
                listType = null;
            }
        };

        const formatText = (text: string) => {
            let formatted = text;
            // Escape tags
            formatted = formatted
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            
            // Replace inline code `code`
            formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-[#35877D] px-1.5 py-0.5 rounded-md font-mono text-xs font-bold">$1</code>');
            // Replace **bold**
            formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-extrabold text-slate-900">$1</strong>');
            
            return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
        };

        lines.forEach((line, index) => {
            const trimmed = line.trim();

            if (trimmed.startsWith("# ")) {
                flushList(index);
                // We skip main H1 because it is in the hero layout header
            } else if (trimmed.startsWith("## ")) {
                flushList(index);
                renderedElements.push(
                    <h2 key={index} className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-8 mb-3 tracking-tight">
                        {formatText(trimmed.replace("## ", ""))}
                    </h2>
                );
            } else if (trimmed.startsWith("### ")) {
                flushList(index);
                renderedElements.push(
                    <h3 key={index} className="text-lg font-bold text-slate-900 mt-6 mb-2">
                        {formatText(trimmed.replace("### ", ""))}
                    </h3>
                );
            } else if (trimmed.startsWith("> ")) {
                flushList(index);
                renderedElements.push(
                    <blockquote key={index} className="border-l-4 border-[#35877D] bg-slate-50 p-4.5 rounded-r-2xl text-slate-650 my-6 font-semibold italic text-sm sm:text-base leading-relaxed">
                        {formatText(trimmed.replace("> ", ""))}
                    </blockquote>
                );
            } else if (trimmed.startsWith("- ")) {
                if (listType !== "ul") {
                    flushList(index);
                    listType = "ul";
                }
                listItems.push(
                    <li key={`li-${index}`} className="flex items-start gap-2 text-sm sm:text-base text-slate-600 leading-relaxed font-semibold">
                        <CheckCircle2 size={14} className="text-[#35877D] shrink-0 mt-1" />
                        <span>{formatText(trimmed.replace("- ", ""))}</span>
                    </li>
                );
            } else if (/^\d+\.\s/.test(trimmed)) {
                if (listType !== "ol") {
                    flushList(index);
                    listType = "ol";
                }
                listItems.push(
                    <li key={`li-${index}`} className="list-decimal pl-1 ml-4.5 text-sm sm:text-base text-slate-600 leading-relaxed font-semibold">
                        {formatText(trimmed.replace(/^\d+\.\s/, ""))}
                    </li>
                );
            } else if (trimmed === "---") {
                flushList(index);
                renderedElements.push(<hr key={index} className="border-slate-200 my-8" />);
            } else if (trimmed === "") {
                // Ignore empty lines
            } else {
                flushList(index);
                renderedElements.push(
                    <p key={index} className="text-gray-600 text-sm sm:text-base leading-relaxed font-semibold my-4">
                        {formatText(trimmed)}
                    </p>
                );
            }
        });

        // Flush any remaining list items at the end
        flushList(lines.length);

        return renderedElements;
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden selection:bg-[#35877D] selection:text-white">
            <LandingHeader />

            <main className="pt-40">
                <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-4xl mx-auto">
                    {/* Back link & Actions */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#35877D] transition-colors"
                        >
                            <ArrowLeft size={13} />
                            Back to Articles
                        </Link>
                        <button
                            onClick={handleShare}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#35877D] hover:border-[#35877D]/30 text-xs font-bold cursor-pointer transition-all shadow-xs"
                        >
                            <Share2 size={12} />
                            Share Article
                        </button>
                    </div>

                    {/* Post Header Hero */}
                    <div className="space-y-5 mb-8">
                        <div className="flex items-center gap-2.5">
                            <span className="bg-[#35877D]/10 text-[#35877D] text-[10px] px-2.5 py-0.5 rounded-full font-bold border border-[#35877D]/20 uppercase">
                                {post.category}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                <Clock size={11} />
                                {post.readTime}
                            </div>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-b border-slate-200 pb-5">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-[#35877D]/10 border border-[#35877D]/20 text-[#35877D] rounded-full flex items-center justify-center font-bold text-sm">
                                    {post.author.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900">{post.author}</h4>
                                    <p className="text-[10px] font-semibold text-slate-500">{post.authorRole}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                <Calendar size={13} />
                                Published on {post.date}
                            </div>
                        </div>
                    </div>

                    {/* Main Content Body */}
                    <section className="pb-24">
                        <Card className="p-8 md:p-12 bg-white border border-slate-200 rounded-3xl shadow-sm relative overflow-hidden">
                            {/* Accent gradients inside the article background for luxury look */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-radial-gradient from-[#35877D]/3 to-transparent -z-10 rounded-full blur-xl pointer-events-none" />
                            
                            <div className="article-body">
                                {renderContent()}
                            </div>
                        </Card>
                    </section>
                </div>
            </main>

            <LandingFooter />
        </div>
    );
}
