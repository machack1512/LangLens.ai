import { useState } from "react";
import { LanguageDropdown } from "./LanguageDropdown";
import { translateText } from "./services/translate";

function App() {
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState('');

  const swapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    setSourceText(translatedText);
    setTranslatedText('');
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;

    setIsTranslating(true);
    setError('');
    
    try {
      const result = await translateText({
        text: sourceText,
        from: sourceLanguage,
        to: targetLanguage
      });
      setTranslatedText(result.translatedText);
    } catch (err) {
      setError('Translation failed. Please try again.');
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-purple-50 to-blue-50 m-0 px-2 sm:px-4 md:px-8 overflow-x-hidden overflow-y-auto">
      <nav className="fixed top-0 left-0 right-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">MyTrancy</span>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium px-3 py-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent bg-size-200 animate-gradient-x">
                  New Feature 
                </span>
              <button className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill={"currentColor"}
                >
                  <path d="M21 7h-3.17l-1.84-2.44A1 1 0 0 0 15.3 4H8.7a1 1 0 0 0-.69.56L6.17 7H3a1 1 0 0 0-1 1v9a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM12 18a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
                </svg>
                Cam Trancy
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="w-full min-h-screen px-2 sm:px-4 md:px-8 py-6 md:py-12 flex flex-col justify-center items-center">
        <div className="text-center mb-11 mt-11">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Instant <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Language Translator</span>
          </h1>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-2 sm:p-4 md:p-8 w-full md:max-w-3xl lg:max-w-5xl xl:max-w-6xl">
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
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Enter text to translate..."
                className="w-full h-64 p-4 pr-24 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 resize-none transition-colors text-gray-800 text-lg"
              ></textarea>
              <div className="absolute bottom-3 left-4 text-sm text-gray-500">
                <span>{sourceText.length}</span> / 5000
              </div>
            </div>

            {error && (
              <div className="mt-2 text-red-500 text-sm">
                {error}
              </div>
            )}

            <div className="relative">
              <div className="absolute top-3 right-3 flex space-x-2">
                <button 
                  onClick={() => navigator.clipboard.writeText(translatedText)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" 
                  title="Copy translation"
                >
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
                value={translatedText}
                placeholder="Translation will appear here..."
                className="w-full h-64 p-4 pr-24 border-2 border-gray-300 rounded-xl bg-gray-50 resize-none text-gray-800 text-lg"
                readOnly
              ></textarea>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={handleTranslate}
              disabled={isTranslating || !sourceText.trim()}
              className="px-12 py-4 text-white font-semibold rounded-full text-lg flex items-center space-x-3 transform transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isTranslating ? 'Translating...' : 'Translate'}</span>
              {isTranslating ? (
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;