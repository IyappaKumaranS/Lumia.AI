import React from 'react';
import { Palette, Check } from 'lucide-react';
import { DashboardTheme } from '../types';
import { dashboardThemes } from '../utils/themes';

interface ThemeSelectorProps {
  currentTheme: DashboardTheme;
  onThemeChange: (theme: DashboardTheme) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Palette className="h-4 w-4 mr-2 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Theme</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Choose Theme</h3>
          </div>
          <div className="p-2 max-h-80 overflow-y-auto">
            {dashboardThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  onThemeChange(theme);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    {theme.chartColors.slice(0, 4).map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{theme.name}</span>
                </div>
                {currentTheme.id === theme.id && (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;