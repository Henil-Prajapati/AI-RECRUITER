'use client';
import React, { useState } from 'react';

const timezones = [
  'UTC', 'America/New_York', 'Europe/London', 'Asia/Kolkata', 'Asia/Tokyo', 'Australia/Sydney'
];
const languages = [
  'English', 'Spanish', 'French', 'German', 'Hindi', 'Chinese'
];

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8901',
    jobTitle: 'Software Engineer',
    company: 'AI Recruiter',
    password: '',
    notifications: true,
    timezone: 'UTC',
    language: 'English',
    darkMode: false,
    profilePic: null,
  });
  const [saved, setSaved] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      const file = files[0];
      setForm((prev) => ({ ...prev, profilePic: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setProfilePicPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setProfilePicPreview(null);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    setSaved(true);
  };

  const handleDeleteAccount = () => {
    // Placeholder for account deletion logic
    alert('Account deletion is not implemented in this demo.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-200 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-2xl w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 animate-fade-in border border-blue-100 dark:border-gray-800">
        <h1 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow animate-slide-down">Settings</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center gap-4 animate-pop">
            <div>
              <label htmlFor="profilePic" className="block text-sm font-medium mb-1">Profile Picture</label>
              <input
                type="file"
                id="profilePic"
                name="profilePic"
                accept="image/*"
                onChange={handleChange}
                className="block text-sm"
              />
            </div>
            {profilePicPreview && (
              <img src={profilePicPreview} alt="Profile Preview" className="w-16 h-16 rounded-full object-cover border-4 border-blue-400 shadow-lg bg-white animate-pop" />
            )}
          </div>
          {/* Name */}
          <div className="animate-fade-in delay-200">
            <label className="block text-sm font-medium mb-1" htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800"
              required
            />
          </div>
          {/* Email */}
          <div className="animate-fade-in delay-300">
            <label className="block text-sm font-medium mb-1" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800"
              required
            />
          </div>
          {/* Phone */}
          <div className="animate-fade-in delay-400">
            <label className="block text-sm font-medium mb-1" htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800"
              placeholder="+1 234 567 8901"
            />
          </div>
          {/* Job Title */}
          <div className="animate-fade-in delay-500">
            <label className="block text-sm font-medium mb-1" htmlFor="jobTitle">Job Title</label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800"
              placeholder="Software Engineer"
            />
          </div>
          {/* Company */}
          <div className="animate-fade-in delay-600">
            <label className="block text-sm font-medium mb-1" htmlFor="company">Company/Organization</label>
            <input
              type="text"
              id="company"
              name="company"
              value={form.company}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800"
              placeholder="AI Recruiter"
            />
          </div>
          {/* Timezone */}
          <div className="animate-fade-in delay-700">
            <label className="block text-sm font-medium mb-1" htmlFor="timezone">Timezone</label>
            <select
              id="timezone"
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
          {/* Language */}
          <div className="animate-fade-in delay-800">
            <label className="block text-sm font-medium mb-1" htmlFor="language">Language Preference</label>
            <select
              id="language"
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          {/* Password */}
          <div className="animate-fade-in delay-900">
            <label className="block text-sm font-medium mb-1" htmlFor="password">Change Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800"
              placeholder="Leave blank to keep current password"
            />
          </div>
          {/* Notifications */}
          <div className="flex items-center animate-fade-in delay-1000">
            <input
              type="checkbox"
              id="notifications"
              name="notifications"
              checked={form.notifications}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="notifications" className="text-sm">Enable Email Notifications</label>
          </div>
          {/* Dark Mode */}
          <div className="flex items-center animate-fade-in delay-1100">
            <input
              type="checkbox"
              id="darkMode"
              name="darkMode"
              checked={form.darkMode}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="darkMode" className="text-sm">Enable Dark Mode</label>
          </div>
          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-200 animate-fade-in delay-1200"
          >
            Save Changes
          </button>
          {saved && <div className="text-green-600 text-center font-medium mt-2 animate-pop">Settings saved!</div>}
        </form>
        {/* Account Deletion */}
        <div className="mt-8 text-center animate-fade-in delay-1300">
          <button
            onClick={handleDeleteAccount}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded hover:scale-105 hover:bg-red-600 transition font-semibold shadow-lg"
          >
            Delete Account
          </button>
        </div>
      </div>
      <style jsx>{`
        .animate-fade-in {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeInUp 1s forwards;
        }
        .animate-fade-in.delay-200 { animation-delay: 0.2s; }
        .animate-fade-in.delay-300 { animation-delay: 0.3s; }
        .animate-fade-in.delay-400 { animation-delay: 0.4s; }
        .animate-fade-in.delay-500 { animation-delay: 0.5s; }
        .animate-fade-in.delay-600 { animation-delay: 0.6s; }
        .animate-fade-in.delay-700 { animation-delay: 0.7s; }
        .animate-fade-in.delay-800 { animation-delay: 0.8s; }
        .animate-fade-in.delay-900 { animation-delay: 0.9s; }
        .animate-fade-in.delay-1000 { animation-delay: 1s; }
        .animate-fade-in.delay-1100 { animation-delay: 1.1s; }
        .animate-fade-in.delay-1200 { animation-delay: 1.2s; }
        .animate-fade-in.delay-1300 { animation-delay: 1.3s; }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-slide-down {
          opacity: 0;
          transform: translateY(-30px);
          animation: fadeSlideDown 1s forwards;
        }
        @keyframes fadeSlideDown {
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-pop {
          animation: popIn 0.7s cubic-bezier(0.68,-0.55,0.27,1.55) both;
        }
        @keyframes popIn {
          0% { transform: scale(0.7); opacity: 0; }
          80% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
} 