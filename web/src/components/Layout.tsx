import React from 'react';
import { Settings, User } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#E5EDF8] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('settings')}
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('profile')}
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;