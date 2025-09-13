import { useState, useEffect, useRef } from "react";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'it', name: 'Italian' },
  { code: 'tr', name: 'Turkish' },
  { code: 'pl', name: 'Polish' },
  { code: 'nl', name: 'Dutch' },
];

interface LanguageDropdownProps {
  value: string;
  onChange: (code: string) => void;
  placeholder: string;
}

function LanguageDropdown({ value, onChange, placeholder }: LanguageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLanguage = languages.find(lang => lang.code === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-blue-600 font-medium min-w-32 text-left flex items-center justify-between hover:bg-blue-50 transition-colors"
      >
        <span>{selectedLanguage?.name || placeholder}</span>
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-600"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500">
            <style>{`
              .scrollbar-thin::-webkit-scrollbar {
                width: 8px;
              }
              .scrollbar-thin::-webkit-scrollbar-track {
                background: #f3f4f6;
                border-radius: 4px;
              }
              .scrollbar-thin::-webkit-scrollbar-thumb {
                background: #9ca3af;
                border-radius: 4px;
              }
              .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                background: #6b7280;
              }
            `}</style>
            {filteredLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  onChange(lang.code);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className="w-full px-4 py-2 text-left hover:bg-blue-50 text-blue-600 font-medium transition-colors bg-white"
              >
                {lang.name}
              </button>
            ))}
            {filteredLanguages.length === 0 && (
              <div className="px-4 py-2 text-gray-500 text-sm bg-white">No languages found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');

  const swapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 m-0 p-0">
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Trancy</span>
            </div>
            <button className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Instant <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Translation</span>
          </h1>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 pb-6 border-b border-gray-200 gap-4">
            <div className="flex items-center">
              <LanguageDropdown
                value={sourceLanguage}
                onChange={setSourceLanguage}
                placeholder="Select language"
              />
            </div>

            <button 
              onClick={swapLanguages}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              title="Swap languages"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
            </button>

            <div className="flex items-center">
              <LanguageDropdown
                value={targetLanguage}
                onChange={setTargetLanguage}
                placeholder="Select language"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative">
              <div className="absolute top-3 right-3 flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Clear text">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Copy text">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </button>
              </div>
              <textarea
                id="sourceText"
                placeholder="Enter text to translate..."
                className="w-full h-64 p-4 pr-24 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 resize-none transition-colors text-gray-800 text-lg"
              ></textarea>
              <div className="absolute bottom-3 left-4 text-sm text-gray-500">
                <span id="charCount">0</span> / 5000
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-3 right-3 flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Copy translation">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Listen">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                  </svg>
                </button>
              </div>
              <textarea
                id="translatedText"
                placeholder="Translation will appear here..."
                className="w-full h-64 p-4 pr-24 border-2 border-gray-300 rounded-xl bg-gray-50 resize-none text-gray-800 text-lg"
                readOnly
              ></textarea>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              id="translateBtn"
              className="px-12 py-4 text-white font-semibold rounded-full text-lg flex items-center space-x-3 transform transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:scale-105"
            >
              <span id="buttonText">Translate</span>
              <svg id="translateIcon" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
              </svg>
              <div id="loadingSpinner" className="hidden">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                </div>
            </button>
          </div>
        </div>
        </div>
      </div>
  );
}

export default App;