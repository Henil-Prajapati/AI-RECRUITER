import React from 'react';
import { Video, Phone, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function CreateOptions() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Create New Interview</h2>
          <p className="text-muted-foreground mt-1">Choose your preferred interview method</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Video Interview Option */}
        <Link href="/dashboard/create-interview" className="group">
          <div className="relative bg-card rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 card-hover overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium mr-2">Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                AI Video Interview
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Create intelligent video interviews powered by AI. Perfect for comprehensive candidate assessment with real-time analysis.
              </p>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span>AI-Powered • Real-time Analysis</span>
              </div>
            </div>
          </div>
        </Link>
        
        {/* Phone Screening Option */}
        <div className="group cursor-pointer">
          <div className="relative bg-card rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-xl transition-all duration-300 card-hover overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <div className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium">
                  Coming Soon
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                Phone Screening
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Quick and efficient phone-based screening interviews. Ideal for initial candidate filtering and preliminary assessments.
              </p>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span>Voice AI • Quick Screening</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateOptions;