import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { SunIcon, MoonIcon } from './icons';
import Button from './ui/Button';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      title={theme === 'light' ? 'Mudar para modo escuro' : 'Mudar para modo claro'}
      aria-label="Toggle theme"
      className="!p-2"
    >
      <span className="sr-only">Toggle theme</span>
      {theme === 'light' ? (
        <MoonIcon className="w-5 h-5" />
      ) : (
        <SunIcon className="w-5 h-5" />
      )}
    </Button>
  );
};

export default ThemeToggle;
