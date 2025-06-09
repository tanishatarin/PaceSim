// import React from "react";
// import { ArrowLeft, User, Clock, Award, History } from "lucide-react";
// import { Card } from "@/components/ui/card";

// interface ProfilePageProps {
//   onBack: () => void;
//   userData?: any; // Add user data prop
// }

// interface Session {
//   scenario: string;
//   date: string;
//   status: "Completed" | "In Progress";
// }

// export const ProfilePage: React.FC<ProfilePageProps> = ({ onBack, userData }) => {
//   const sessions: Session[] = [
//     { scenario: "Atrial Fibrillation", date: "Today", status: "Completed" },
//     { scenario: "Basic Calibration", date: "Yesterday", status: "Completed" },
//     { scenario: "Tachycardia", date: "3 days ago", status: "In Progress" },
//   ];

//   // Default user information if userData is not provided
//   const userInfo = {
//     name: userData?.name || userData?.username || "Dr. Sarah Johnson",
//     role: userData?.role || "Cardiology Fellow",
//     institution: userData?.institution || "Cleveland Clinic",
//     trainingTime: userData?.trainingTime || "12.5 hrs",
//     successRate: userData?.successRate || "85%"
//   };

//   return (
//     <Card className="w-full p-8 bg-white shadow-xl rounded-2xl">
//       {/* Header */}
//       <div className="flex items-center mb-6">
//         <button onClick={onBack} className="mr-4">
//           <ArrowLeft className="w-6 h-6 text-gray-600" />
//         </button>
//         <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
//       </div>

//       {/* Basic Info */}
//       <div className="flex items-center mb-8">
//         <div className="flex items-center justify-center w-20 h-20 mr-6 bg-blue-100 rounded-full">
//           <User className="w-10 h-10 text-blue-600" />
//         </div>
//         <div>
//           <h3 className="text-xl font-semibold text-gray-800">
//             {userInfo.name}
//           </h3>
//           <p className="text-gray-600">{userInfo.role}</p>
//           <p className="text-sm text-gray-500">{userInfo.institution}</p>
//         </div>
//       </div>

//       {/* Key Stats */}
//       <div className="grid grid-cols-2 gap-4 mb-8">
//         <div className="p-4 bg-gray-50 rounded-xl">
//           <div className="flex items-center mb-1 text-gray-600">
//             <Clock className="w-4 h-4 mr-2" />
//             <span className="text-sm">Training Time</span>
//           </div>
//           <div className="text-2xl font-bold text-gray-800">{userInfo.trainingTime}</div>
//         </div>
//         <div className="p-4 bg-gray-50 rounded-xl">
//           <div className="flex items-center mb-1 text-gray-600">
//             <Award className="w-4 h-4 mr-2" />
//             <span className="text-sm">Success Rate</span>
//           </div>
//           <div className="text-2xl font-bold text-gray-800">{userInfo.successRate}</div>
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="p-4 bg-gray-50 rounded-xl">
//         <div className="flex items-center mb-4">
//           <History className="w-5 h-5 mr-2 text-gray-600" />
//           <h4 className="font-semibold text-gray-700">Last 3 Sessions</h4>
//         </div>
//         <div className="space-y-3">
//           {sessions.map((session, i) => (
//             <div
//               key={i}
//               className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
//             >
//               <div>
//                 <div className="font-medium text-gray-800">
//                   {session.scenario}
//                 </div>
//                 <div className="text-sm text-gray-500">{session.date}</div>
//               </div>
//               <span
//                 className={`text-sm ${
//                   session.status === "Completed"
//                     ? "text-green-600"
//                     : "text-blue-600"
//                 }`}
//               >
//                 {session.status}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default ProfilePage;




// src/components/ProfilePage.tsx - Fixed ProfilePage with router navigation
import React from "react";
import { ArrowLeft, User, Clock, Award, History } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useStore } from '@nanostores/react';
import { $userData } from '@/stores/auth';
import { goHome } from '@/stores/router';

export const ProfilePage: React.FC = () => {
  const userData = useStore($userData);

  if (!userData) {
    return (
      <Card className="w-full p-8 bg-white shadow-xl rounded-2xl">
        <div className="text-center">
          <p>Please log in to view your profile.</p>
        </div>
      </Card>
    );
  }

  // Mock data for now - you can connect to Convex later
  const sessions = [
    { scenario: "Atrial Fibrillation", date: "Today", status: "Completed" as const },
    { scenario: "Basic Calibration", date: "Yesterday", status: "Completed" as const },
    { scenario: "Tachycardia", date: "3 days ago", status: "In Progress" as const },
  ];

  return (
    <Card className="w-full p-8 bg-white shadow-xl rounded-2xl">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={goHome} className="mr-4">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
      </div>

      {/* Basic Info */}
      <div className="flex items-center mb-8">
        <div className="flex items-center justify-center w-20 h-20 mr-6 bg-blue-100 rounded-full">
          <User className="w-10 h-10 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {userData.name}
          </h3>
          <p className="text-gray-600">{userData.role}</p>
          {userData.institution && (
            <p className="text-sm text-gray-500">{userData.institution}</p>
          )}
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center mb-1 text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">Training Time</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">12.5 hrs</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center mb-1 text-gray-600">
            <Award className="w-4 h-4 mr-2" />
            <span className="text-sm">Success Rate</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">85%</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center mb-4">
          <History className="w-5 h-5 mr-2 text-gray-600" />
          <h4 className="font-semibold text-gray-700">Last 3 Sessions</h4>
        </div>
        <div className="space-y-3">
          {sessions.map((session, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
            >
              <div>
                <div className="font-medium text-gray-800">
                  {session.scenario}
                </div>
                <div className="text-sm text-gray-500">{session.date}</div>
              </div>
              <span
                className={`text-sm ${
                  session.status === "Completed"
                    ? "text-green-600"
                    : "text-blue-600"
                }`}
              >
                {session.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};