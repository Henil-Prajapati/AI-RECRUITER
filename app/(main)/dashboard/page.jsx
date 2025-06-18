// app/(main)/dashboard/page.jsx
import WelcomeContainer from "./_components/WelcomeContainer";
import CreateOptions from "./_components/CreateOptions";
import LatestInterviewList from "./_components/LatestInterviewList";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-[400px] bg-gray-50 flex flex-col items-center ml-6 mr-6 dark:bg-gray-900/70 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 ">
      
      <div className="w-full max-w-5xl mt-8">
        <div className="flex items-center mb-6">
          <div className="w-2 h-8 bg-blue-600 rounded mr-3" />
          <h1 className="text-4xl md:text-2xl font-extrabold text-gray-800 tracking-tight">
            Dashboard
          </h1>
        </div>
        <div className="w-16 h-0.5 bg-gray-300 rounded-full mb-8 ml-2" />
        <CreateOptions />
        <LatestInterviewList />
        <div className="mt-8 flex justify-center">
          <Link href="/dashboard/billing">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 flex flex-col items-center">
              <span className="text-2xl font-bold mb-1">Billing</span>
              <span className="text-sm opacity-80">Manage your subscription and payment details</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}