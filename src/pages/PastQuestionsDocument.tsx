import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { ArrowLeft, Home, Download, FileQuestion, ExternalLink } from 'lucide-react';

const PastQuestionsDocument = () => {
  const { getGreeting, name, gender } = useUser();
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const pdfLinks: Record<number, string> = {
    1: encodeURI("https://server-wizg.onrender.com/api/pastquestions/Week 1.pdf"),
    2: encodeURI("https://server-wizg.onrender.com/api/pastquestions/Week 2.pdf"),
    3: encodeURI("https://server-wizg.onrender.com/api/pastquestions/Week 3.pdf"),
    4: encodeURI("https://server-wizg.onrender.com/api/pastquestions/Week 4.pdf"),
    5: encodeURI("https://server-wizg.onrender.com/api/pastquestions/Week 5.pdf"),
    6: encodeURI("https://server-wizg.onrender.com/api/pastquestions/Week 6.pdf"),
    7: encodeURI("https://server-wizg.onrender.com/api/pastquestions/Week 7.pdf"),
    8: encodeURI("https://server-wizg.onrender.com/api/pastquestions/Week 8.pdf")
  };

  const weekTitles: Record<number, string> = {
    1: "JOHN 3 & 4",
    2: "JOHN 5: 1-47",
    3: "LUKE",
    4: "MATHEW 5",
    5: "MATHEW 6",
    6: "MATHEW 7",
    7: "MATHEW 8 & 9",
    8: "LUKE 6: 1-19"
  };

  const handleWeekSelect = async (week: number) => {
    setSelectedWeek(week);
    setLoading(true);
    try {
      await fetch("https://server-wizg.onrender.com/api/send-pdf-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          gender,
          category: "Past Questions",
          week
        }),
      });
    } catch (error) {
      console.error("Failed to send activity email:", error);
    }
    setLoading(false);
  };

  const handleDownload = (week: number) => {
    const link = document.createElement('a');
    link.href = pdfLinks[week];
    link.download = `Week ${week} Past Questions.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = (week: number) => {
    window.open(pdfLinks[week], '_blank');
  };

  // Check if device is likely mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

  return (
    <div className="min-h-screen p-6 bg-cream">
      <div className="max-w-5xl mx-auto">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => selectedWeek ? setSelectedWeek(null) : navigate('/documents')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{selectedWeek ? 'Back to Week Selection' : 'Previous Page'}</span>
          </button>

          <button
            onClick={() => navigate('/home')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
        </div>

        {/* Selected Week View */}
        {selectedWeek ? (
          <div>
            <div className="text-center mb-6">
              <div className="bg-cream rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2 border-orange-primary">
                <FileQuestion className="w-10 h-10 text-orange-primary" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Week {selectedWeek} Past Questions</h1>
              <h2 className="text-xl text-orange-600 font-semibold mb-4">{weekTitles[selectedWeek]}</h2>
              <p className="text-gray-600">Study materials for {getGreeting()}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => handleDownload(selectedWeek)}
                className="bg-orange-primary hover:bg-orange-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Download PDF</span>
              </button>
              
              {isMobile && (
                <button
                  onClick={() => handleOpenInNewTab(selectedWeek)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Open in New Tab</span>
                </button>
              )}
            </div>

            <div className="w-full">
              {loading ? (
                <div className="text-center text-orange-700 font-semibold">Loading PDF...</div>
              ) : (
                <div className="w-full rounded-xl border-2 border-orange-300 overflow-hidden">
                  {isMobile ? (
                    // Mobile-optimized PDF viewer
                    <div className="bg-white p-4 text-center min-h-[400px] flex flex-col justify-center">
                      <FileQuestion className="w-16 h-16 text-orange-primary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Mobile PDF Viewer
                      </h3>
                      <p className="text-gray-600 mb-6">
                        For the best mobile viewing experience, please use one of the options below:
                      </p>
                      <div className="space-y-3">
                        <button
                          onClick={() => handleOpenInNewTab(selectedWeek)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <ExternalLink className="w-5 h-5" />
                          <span>Open PDF in New Tab</span>
                        </button>
                        <button
                          onClick={() => handleDownload(selectedWeek)}
                          className="w-full bg-orange-primary hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                          <Download className="w-5 h-5" />
                          <span>Download PDF</span>
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-4">
                        Opening in a new tab provides better scrolling and zoom functionality on mobile devices.
                      </p>
                    </div>
                  ) : (
                    // Desktop PDF viewer with improved scrolling
                    <div 
                      className="w-full h-[80vh] overflow-auto"
                      style={{
                        WebkitOverflowScrolling: 'touch',
                        overflowY: 'scroll',
                        overflowX: 'auto'
                      }}
                    >
                      <iframe
                        src={`${pdfLinks[selectedWeek]}#toolbar=1&navpanes=1&scrollbar=1`}
                        className="w-full h-full min-h-[600px]"
                        style={{
                          border: 'none',
                          display: 'block'
                        }}
                        title={`Week ${selectedWeek} Past Questions`}
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Instructions */}
            {isMobile && (
              <div className="bg-blue-50 rounded-lg p-4 mt-6 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">📱 Mobile Tip</h4>
                <p className="text-blue-700 text-sm">
                  For better PDF reading experience on mobile, tap "Open in New Tab" to view the PDF 
                  in your browser's built-in PDF viewer with full scrolling and zoom capabilities.
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Week Selection */}
            <div className="text-center mb-12">
              <div className="bg-cream rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2 border-orange-primary">
                <FileQuestion className="w-10 h-10 text-orange-primary" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">Past Questions Materials</h1>
              <p className="text-gray-600 text-lg">
                Select a week (1–8) to view and download past questions for {getGreeting()}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {Array.from({ length: 8 }, (_, i) => i + 1).map((week) => (
                <button
                  key={week}
                  onClick={() => handleWeekSelect(week)}
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-orange-200"
                >
                  <div className="text-center">
                    <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                      <span className="text-orange-600 font-bold text-lg">{week}</span>
                    </div>
                    <h3 className="font-semibold text-gray-800">Week {week}</h3>
                    <p className="text-sm text-gray-600 mt-1">{weekTitles[week]}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
              <h3 className="text-2xl font-bold text-orange-800 mb-4 text-center">How to Use Past Questions</h3>
              <div className="grid md:grid-cols-3 gap-6 text-orange-700">
                <div className="text-center">
                  <div className="text-3xl mb-2">📅</div>
                  <h4 className="font-semibold mb-2">Select Week</h4>
                  <p className="text-sm">Choose from weeks 1–8 based on your study focus</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">📖</div>
                  <h4 className="font-semibold mb-2">Download</h4>
                  <p className="text-sm">Click download to save and open PDF document</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🧠</div>
                  <h4 className="font-semibold mb-2">Study</h4>
                  <p className="text-sm">Use the material to revise and prepare deeply</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PastQuestionsDocument;