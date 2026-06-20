"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Sparkles,
    Search,
    Calendar,
    User,
    Clock,
    ArrowRight,
    BookOpen
} from "lucide-react";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { blogPosts, BlogPost } from "./posts";

export default function BlogPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Guides", "Tutorials", "Marketing"];

    // Filter posts based on category selection and search query
    const filteredPosts = useMemo(() => {
        return blogPosts.filter((post) => {
            const matchesCategory =
                selectedCategory === "All" || post.category === selectedCategory;
            const matchesSearch =
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.content.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, selectedCategory]);

    // Define featured post (show first post as featured only when no active filters)
    const showFeatured = searchQuery === "" && selectedCategory === "All" && blogPosts.length > 0;
    const featuredPost = showFeatured ? blogPosts[0] : null;

    // Remaining posts for the grid when showing featured post
    const gridPosts = useMemo(() => {
        if (showFeatured) {
            return filteredPosts.slice(1);
        }
        return filteredPosts;
    }, [filteredPosts, showFeatured]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans overflow-x-hidden selection:bg-[#35877D] selection:text-white">
            <LandingHeader />

            <main className="pt-40">
                {/* Hero section */}
                <section className="relative pb-12 overflow-hidden">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto text-center space-y-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35877D]/10 text-[#35877D] text-xs font-bold border border-[#35877D]/20 mb-1">
                            <Sparkles size={12} className="animate-pulse" />
                            Insights & Resources
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                            The Connectly360 <span className="text-[#35877D]">Blog</span>
                        </h1>
                        <p className="text-base text-gray-550 font-semibold max-w-2xl mx-auto leading-relaxed">
                            Expert guides, tutorials, and success stories to elevate your conversational automation and customer success.
                        </p>
                    </div>
                </section>

                {/* Filter and Search Bar Section */}
                <section className="pb-8">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white border border-slate-200 p-5 rounded-3xl shadow-sm">
                            {/* Category Filter Tabs */}
                            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                                            selectedCategory === category
                                                ? "bg-[#35877D] border-[#35877D] text-white shadow-sm"
                                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            {/* Search Input */}
                            <div className="relative w-full md:max-w-xs shrink-0">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <Input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-11 border-slate-200 focus-visible:ring-[#35877D] focus-visible:border-[#35877D] rounded-xl bg-slate-50/50 font-semibold text-sm w-full"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Blog Grid Content */}
                <section className="pb-24">
                    <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto space-y-10">
                        {/* Featured Post Card */}
                        {featuredPost && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Card className="p-0 border border-slate-200 bg-white rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 group hover:border-[#35877D]/25 hover:shadow-md transition-all duration-300">
                                    <div className={`lg:col-span-6 bg-gradient-to-br ${featuredPost.gradient} p-8 flex flex-col justify-between text-white relative min-h-[300px] lg:min-h-full`}>
                                        <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none" />
                                        <span className="bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wide self-start shadow-xs">
                                            Featured Article
                                        </span>
                                        <div className="space-y-3 z-10">
                                            <BookOpen size={48} className="stroke-[1.5] text-white/90 mb-4" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/15 px-2 py-0.5 rounded-full inline-block">
                                                {featuredPost.category}
                                            </span>
                                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                                                {featuredPost.title}
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-6 p-8 flex flex-col justify-between space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={13} />
                                                    {featuredPost.date}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={13} />
                                                    {featuredPost.readTime}
                                                </span>
                                            </div>
                                            <p className="text-sm sm:text-base text-gray-550 leading-relaxed font-semibold">
                                                {featuredPost.excerpt}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center font-bold text-[#35877D]">
                                                    {featuredPost.author.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-900">{featuredPost.author}</h4>
                                                    <p className="text-[10px] font-medium text-slate-400">{featuredPost.authorRole}</p>
                                                </div>
                                            </div>
                                            <Button asChild className="bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-xs font-bold gap-1.5 cursor-pointer shadow-sm">
                                                <Link href={`/blog/${featuredPost.slug}`}>
                                                    <span>Read Article</span>
                                                    <ArrowRight size={13} />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* Secondary Grid Posts */}
                        <AnimatePresence mode="popLayout">
                            {filteredPosts.length > 0 ? (
                                <motion.div
                                    layout
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                >
                                    {gridPosts.map((post) => (
                                        <motion.div
                                            layout
                                            key={post.slug}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Card className="h-full flex flex-col justify-between border border-slate-200 bg-white rounded-3xl overflow-hidden group hover:border-[#35877D]/25 hover:shadow-md transition-all duration-300">
                                                <div>
                                                    {/* Card Header Gradient Visual */}
                                                    <div className={`bg-gradient-to-br ${post.gradient} h-40 p-6 flex flex-col justify-between text-white relative`}>
                                                        <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none" />
                                                        <span className="bg-white/15 backdrop-blur-sm border border-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide self-start uppercase">
                                                            {post.category}
                                                        </span>
                                                        <BookOpen size={24} className="stroke-[1.5] text-white/80 self-end" />
                                                    </div>

                                                    <div className="p-6 space-y-3">
                                                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar size={11} />
                                                                {post.date}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock size={11} />
                                                                {post.readTime}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-base font-extrabold text-slate-900 leading-snug group-hover:text-[#35877D] transition-colors">
                                                            {post.title}
                                                        </h3>
                                                        <p className="text-xs text-gray-550 leading-relaxed font-semibold line-clamp-3">
                                                            {post.excerpt}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="p-6 pt-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/20">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="h-8 w-8 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center font-bold text-xs text-[#35877D]">
                                                            {post.author.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-[10px] font-bold text-slate-900">{post.author}</h4>
                                                            <p className="text-[8px] font-medium text-slate-400">{post.authorRole}</p>
                                                        </div>
                                                    </div>
                                                    <Button asChild variant="outline" className="border-slate-200 hover:border-[#35877D]/40 text-[#35877D] hover:bg-[#35877D]/5 rounded-xl text-[10px] font-bold h-8 px-3.5 cursor-pointer">
                                                        <Link href={`/blog/${post.slug}`}>
                                                            <span>Read</span>
                                                            <ArrowRight size={10} className="ml-1" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-16 space-y-4"
                                >
                                    <div className="h-14 w-14 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-400 mx-auto">
                                        <BookOpen size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-base font-extrabold text-slate-900">No articles found</h3>
                                        <p className="text-xs text-gray-500 font-semibold max-w-xs mx-auto leading-normal">
                                            We couldn't find any articles matching "{searchQuery}". Try refining your search query or choosing another category.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSelectedCategory("All");
                                        }}
                                        className="h-10 bg-[#35877D] hover:bg-[#2c6f66] text-white rounded-xl text-xs font-bold px-5 cursor-pointer"
                                    >
                                        Reset Filters
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>
            </main>

            <LandingFooter />
        </div>
    );
}
