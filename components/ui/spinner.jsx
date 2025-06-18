import React from "react";

export default function Spinner({ size = 56, className = "" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin-slow"
      >
        <defs>
          <linearGradient id="spinner-gradient" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6366F1" />
            <stop offset="1" stopColor="#A21CAF" />
          </linearGradient>
        </defs>
        <circle
          cx="30"
          cy="30"
          r="24"
          stroke="#e0e7ef"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="30"
          cy="30"
          r="24"
          stroke="url(#spinner-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="90 120"
          fill="none"
          className="animate-dash"
        />
      </svg>
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 1.2s linear infinite;
        }
        .animate-dash {
          animation: dash 1.2s ease-in-out infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        @keyframes dash {
          0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 90, 120; stroke-dashoffset: -35; }
          100% { stroke-dasharray: 90, 120; stroke-dashoffset: -124; }
        }
      `}</style>
    </div>
  );
} 