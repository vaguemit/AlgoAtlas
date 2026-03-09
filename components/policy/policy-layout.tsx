"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface PolicyLayoutProps {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function PolicyLayout({ title, lastUpdated, children }: PolicyLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <div className="mb-8">
        <Link 
          href="/"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-navy-900/80 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 md:p-8 shadow-xl"
      >
        <div className="mb-8 border-b border-purple-500/20 pb-4">
          <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-gray-400 mt-2 text-sm">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>
        
        <div className="space-y-6 prose prose-invert prose-purple max-w-none">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
