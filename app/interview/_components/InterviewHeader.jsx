import React from 'react';
// import Image from 'next/image'; // No longer needed as logo is text-only

function InterviewHeader() {
  return (
    <header className="flex flex-col items-center justify-center py-8 bg-white dark:bg-gray-900">
      {/* Removed: <Image src="/logo.png" alt="AIcruiter Logo" width={150} height={40} className="mb-2" priority={true} /> */}
      <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">AIcruiter</h1>
      <p className="text-md text-gray-600 dark:text-gray-300">AI-Powered Interview Platform</p>
    </header>
  );
}

export default InterviewHeader;