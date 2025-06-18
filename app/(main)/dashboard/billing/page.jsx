import React from "react";
import Link from "next/link";

export default function BillingPage() {
  return (
    <div className="min-h-[600px] flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full flex flex-col items-center animate-fade-in">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">Billing & Subscription</h1>
        <div className="w-full flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 shadow-md flex flex-col items-center">
            <span className="text-lg font-semibold text-blue-700 mb-2">Current Plan</span>
            <span className="text-2xl font-bold text-purple-700 mb-1">Pro</span>
            <span className="text-sm text-gray-500">$29/month</span>
            <span className="mt-2 text-xs text-green-600 font-semibold">Active</span>
          </div>
          <div className="flex-1 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 shadow-md flex flex-col items-center">
            <span className="text-lg font-semibold text-purple-700 mb-2">Next Payment</span>
            <span className="text-2xl font-bold text-blue-700 mb-1">$29</span>
            <span className="text-sm text-gray-500">Due: 2024-07-01</span>
          </div>
        </div>
        {/* Payment Methods Section */}
        <div className="w-full bg-gray-50 rounded-xl p-6 shadow flex flex-col items-center mb-8">
          <span className="text-lg font-semibold text-gray-700 mb-2">Payment Methods</span>
          <div className="flex flex-col gap-3 w-full mb-2">
            <div className="flex items-center gap-3 justify-between bg-white rounded-lg px-4 py-2 shadow">
              <div className="flex items-center gap-3">
                
                <span className="text-md font-mono tracking-widest">**** 1234</span>
                <span className="text-xs text-gray-400">Exp: 12/26</span>
                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Primary</span>
              </div>
              <button className="text-blue-600 hover:underline text-xs">Edit</button>
            </div>
            <div className="flex items-center gap-3 justify-between bg-white rounded-lg px-4 py-2 shadow">
              <div className="flex items-center gap-3">
                
                <span className="text-md font-mono tracking-widest">**** 5678</span>
                <span className="text-xs text-gray-400">Exp: 09/25</span>
              </div>
              <button className="text-blue-600 hover:underline text-xs">Make Primary</button>
            </div>
          </div>
          <button className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded shadow hover:scale-105 transition-transform">Add New Payment Method</button>
        </div>
        {/* Payment History Section */}
        <div className="w-full bg-white rounded-xl p-6 shadow mb-8">
          <span className="text-lg font-semibold text-gray-700 mb-4 block">Payment History</span>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="bg-gradient-to-r from-blue-100 to-purple-100">
                  <th className="px-4 py-2 font-semibold">Date</th>
                  <th className="px-4 py-2 font-semibold">Amount</th>
                  <th className="px-4 py-2 font-semibold">Status</th>
                  <th className="px-4 py-2 font-semibold">Invoice</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2">2024-06-01</td>
                  <td className="px-4 py-2">$29</td>
                  <td className="px-4 py-2 text-green-600">Paid</td>
                  <td className="px-4 py-2"><Link href="#" className="text-blue-600 hover:underline">Download</Link></td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">2024-05-01</td>
                  <td className="px-4 py-2">$29</td>
                  <td className="px-4 py-2 text-green-600">Paid</td>
                  <td className="px-4 py-2"><Link href="#" className="text-blue-600 hover:underline">Download</Link></td>
                </tr>
                <tr>
                  <td className="px-4 py-2">2024-04-01</td>
                  <td className="px-4 py-2">$29</td>
                  <td className="px-4 py-2 text-green-600">Paid</td>
                  <td className="px-4 py-2"><Link href="#" className="text-blue-600 hover:underline">Download</Link></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Upgrade CTA */}
        <div className="w-full flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-700 mb-2">Want more features?</span>
          <Link href="#" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-transform">Upgrade Plan</Link>
        </div>
      </div>
    </div>
  );
} 