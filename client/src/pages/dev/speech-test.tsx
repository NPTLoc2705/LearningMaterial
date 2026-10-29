import { useState } from 'react';
import { useSpeech } from '../../hooks/use-speech';

const SAMPLE_WORDS = ['boy', 'girl', 'teacher', 'classmate', 'student', 'friend', 'The girl is reading a book.'];

export function SpeechTestPage() {
  const { isSupported, isSpeaking, voices, selectedVoice, speak, stop, error } = useSpeech();
  const [customText, setCustomText] = useState('boy');
  const [rate, setRate] = useState(0.85);
  const [activeVoiceName, setActiveVoiceName] = useState('');

  const englishVoices = voices.filter((v) => v.lang.startsWith('en'));
  const currentVoice = englishVoices.find((v) => v.name === activeVoiceName) || selectedVoice;

  const handleSpeak = (text: string) => {
    speak(text, {
      rate,
      lang: currentVoice?.lang || 'en-US',
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Speech Synthesis Device Test (S3-T07)</h1>
        <p className="text-sm text-gray-600 mt-1">
          Dùng trang này để kiểm tra giọng đọc tiếng Anh trên các thiết bị thật (iPad, iPhone, Android, Windows).
        </p>
      </div>

      <div className="bg-gray-50 border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">Hỗ trợ Web Speech:</span>
          <span className={`px-2 py-0.5 rounded text-xs font-bold ${isSupported ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isSupported ? 'CÓ (Supported)' : 'KHÔNG (Not Supported)'}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Chọn giọng đọc ({englishVoices.length} giọng tiếng Anh tìm thấy):
          </label>
          <select
            value={currentVoice?.name || ''}
            onChange={(e) => setActiveVoiceName(e.target.value)}
            className="w-full text-sm border rounded px-3 py-2 bg-white"
          >
            {englishVoices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang}) {v.default ? '★ Default' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-xs font-semibold text-gray-700">Tốc độ (Rate): {rate}x</label>
          <input
            type="range"
            min="0.5"
            max="1.2"
            step="0.05"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-48"
          />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Từ mẫu Explore 1:</h2>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_WORDS.map((word) => (
            <button
              key={word}
              type="button"
              onClick={() => handleSpeak(word)}
              disabled={!isSupported || isSpeaking}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 text-sm flex items-center gap-2"
            >
              <span>🔊</span>
              <span>{word}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">Thử từ / câu tùy ý:</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
            placeholder="Nhập từ hoặc câu cần đọc..."
          />
          <button
            type="button"
            onClick={() => handleSpeak(customText)}
            disabled={!isSupported || isSpeaking}
            className="px-5 py-2 bg-emerald-600 text-white font-medium rounded-lg text-sm hover:bg-emerald-700"
          >
            Đọc
          </button>
          <button
            type="button"
            onClick={stop}
            className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg text-sm hover:bg-gray-300"
          >
            Dừng
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

