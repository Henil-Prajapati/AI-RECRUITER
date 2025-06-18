import React from 'react';
import { Video, Phone } from 'lucide-react';
import Link from 'next/link';

function CreateOptions() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* Video Interview Option */}
      <Link href="/dashboard/create-interview" className="group">
        <div className="bg-white/80 dark:bg-gray-900/70 rounded-xl shadow-lg p-8 flex flex-col items-center border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full mb-4 shadow-lg">
            <Video size={36} className="text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent text-center">Create New Video Interview</h2>
          <p className="text-gray-700 dark:text-gray-300 text-center">Create an AI-driven video interview and schedule it for your candidates.</p>
        </div>
      </Link>
      
      {/* Phone Screening Option */}
      <div className="bg-white/80 dark:bg-gray-900/70 rounded-xl shadow-lg p-8 flex flex-col items-center border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer group">
        <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-full mb-4 shadow-lg">
          <Phone size={36} className="text-white" />
        </div>
        <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent text-center">Phone Screening</h2>
        <p className="text-gray-700 dark:text-gray-300 text-center">Quickly screen candidates with an AI-powered phone call interview.</p>
      </div>
    </div>
  );
}

export default CreateOptions;