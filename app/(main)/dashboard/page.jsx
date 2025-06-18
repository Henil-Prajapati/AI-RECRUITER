// app/(main)/dashboard/page.jsx
import WelcomeContainer from "./_components/WelcomeContainer";
import CreateOptions from "./_components/CreateOptions";
import LatestInterviewList from "./_components/LatestInterviewList";

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
        
      </div>
    </div>
  );
}