// src/components/SessionSummary.tsx
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

interface SessionSummaryProps {
  score: number;
  maxScore: number;
  time: number; // in seconds
  moduleId: number;
  moduleName: string;
  onClose: () => void;
}

const SessionSummary: React.FC<SessionSummaryProps> = ({
  score,
  maxScore,
  time,
  moduleId,
  moduleName,
  onClose,
}) => {
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate percentage
  const percentage = Math.round((score / maxScore) * 100);

  // Get feedback based on score
  const getFeedback = () => {
    if (percentage >= 90) {
      return "Outstanding! You've mastered this module.";
    } else if (percentage >= 75) {
      return "Great job! You've shown solid understanding.";
    } else if (percentage >= 60) {
      return "Good work. With some practice, you'll improve further.";
    } else {
      return "This was challenging. Consider reviewing and trying again.";
    }
  };

  // Get performance metrics
  const getMetrics = () => {
    return [
      {
        title: "P-wave Detection",
        passed: percentage >= 70,
        description: "Ability to detect and respond to P-waves"
      },
      {
        title: "QRS Recognition",
        passed: percentage >= 80,
        description: "Recognition of QRS complexes and appropriate response"
      },
      {
        title: "Capture Management",
        passed: percentage >= 65,
        description: "Setting appropriate capture thresholds and energy levels"
      },
      {
        title: "Timing",
        passed: time < 300, // 5 minutes
        description: "Completed within reasonable time frame"
      }
    ];
  };

  const metrics = getMetrics();

  return (
    <Card className="w-full max-w-2xl p-8 mx-auto bg-white shadow-xl rounded-2xl">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Session Complete</h2>
        <p className="text-gray-600">
          Module {moduleId}: {moduleName}
        </p>
      </div>

      {/* Score Circle */}
      <div className="flex justify-center mb-8">
        <div className="relative flex items-center justify-center w-32 h-32 border-8 border-blue-100 rounded-full">
          <div className="absolute w-full h-full border-8 border-blue-500 rounded-full" 
               style={{ 
                 clipPath: `polygon(50% 0%, 50% 50%, ${percentage >= 25 ? '100% 50%' : '50% 50%'}, ${percentage >= 50 ? '100% 100%' : '50% 50%'}, ${percentage >= 75 ? '0% 100%' : '50% 50%'}, ${percentage >= 100 ? '0% 0%' : '50% 50%'})` 
               }}>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{percentage}%</div>
            <div className="text-sm text-gray-600">{score}/{maxScore}</div>
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div className="p-4 mb-6 bg-blue-50 rounded-xl">
        <p className="font-medium text-center text-blue-800">{getFeedback()}</p>
      </div>

      {/* Time Taken */}
      <div className="flex items-center justify-center gap-2 mb-6 text-gray-700">
        <Clock className="w-5 h-5" />
        <span>Time: {formatTime(time)}</span>
      </div>

      {/* Performance Metrics */}
      <div className="mb-8">
        <h3 className="mb-2 font-semibold text-gray-800">Performance Metrics</h3>
        <div className="space-y-3">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`rounded-full p-1 ${metric.passed ? 'bg-green-100' : 'bg-red-100'}`}>
                {metric.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <div className="font-medium">{metric.title}</div>
                <div className="text-xs text-gray-600">{metric.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => onClose()}
        >
          Return to Modules
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    </Card>
  );
};

export default SessionSummary;