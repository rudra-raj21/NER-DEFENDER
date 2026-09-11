import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'as', name: 'অসমীয়া (Assamese)' },
  { code: 'kha', name: 'Khasi' },
  { code: 'miz', name: 'Mizo' },
  { code: 'brx', name: 'Bodo (বর\')' },
  { code: 'mni', name: 'মৈতৈলোন্ (Manipuri)' }
];

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center space-x-2 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-lg px-2.5 py-1.5 text-xs text-slate-200">
      <Languages size={14} className="text-ner-accent" />
      <select
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs pr-1"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200">
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};
