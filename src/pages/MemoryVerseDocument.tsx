import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { ArrowLeft, Home, Download, BookOpen, Loader2 } from 'lucide-react';

// Simple toast notification component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
  <div
    className={`fixed bottom-8 right-8 px-6 py-3 rounded-lg text-white font-medium shadow-lg transition-opacity duration-300 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-600'
    }`}
    role="alert"
    onClick={onClose}
  >
    {message}
  </div>
);

const MemoryVerseDocument = () => {
  const { getGreeting } = useUser();
  const navigate = useNavigate();
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const memoryVerses = [
    {
      reference: "Luke 24:26-27",
      kjv: "Ought not Christ to have suffered these things, and to enter into his glory? And beginning at Moses and all the prophets, he expounded unto them in all the scriptures the things concerning himself.",
      niv: "Did not the Messiah have to suffer these things and then enter his glory? And beginning with Moses and all the Prophets, he explained to them what was said in all the Scriptures concerning himself.",
      explanation: "The memory verse was a statement made by Jesus to two of his disciples, after he rose from the dead.\nReading from verse 13 of that chapter, we see two of his disciples going to a village called Emmaus. While they were discussing on the way, the resurrected Jesus appeared unto them, but they did not recognize him.\nThey were discussing about how they assumed Jesus of Nazareth to be the Christ (Messiah) who was prophesied by the Old Testament prophets. But, his death showed that he was not the Christ, but just a prophet who was mighty in deed and word before God and all the people.\nIn short, the death and sufferings of Jesus was what made his disciples to disbelief his messiahship."
    },
    {
      reference: "Matthew 1:18",
      kjv: "Now the birth of Jesus Christ was on this wise: When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost.",
      niv: "This is how the birth of Jesus the Messiah came about: His mother Mary was pledged to be married to Joseph, but before they came together, she was found to be pregnant through the Holy Spirit.",
      explanation: "In the Jewish culture marriage, a man who desires to marry a woman will start with espousal, also called betrothal. Espousal or Betrothal means to formally and officially promise someone for marriage. This promise, being official, was as valid as being married, with the man and woman being regarded as husband and wife.\nThe espoused man and woman will not yet be cohabiting until they are fully married. Joseph and Mary was in this state when Mary became pregnant of Jesus by the Holy Ghost."
    },
    {
      reference: "Proverbs 21:20",
      kjv: "There is treasure to be desired and oil in the dwelling of the wise; but a foolish man spendeth it up.",
      niv: "The wise store up choice food and olive oil, but fools gulp theirs down.",
      explanation: "A man who is financially wise is known by the desirable treasure, wealth and riches which he stores up for future use and his children. This he accumulates, over time, through diligence in his work and savings of part of his earnings. \n On the other hand, a financially foolish man has no left over. Be it what he inherits, or what he earns, he spends everything. \n Any man who has a good saving culture is regarded as wise, and the contrary is regarded as foolish. "
    },
    {
      reference: "1 Corinthians 9:13-14",
      kjv: "Do ye not know that they which minister about holy things live of the things of the temple? and they which wait at the altar are partakers with the altar? Even so hath the Lord ordained that they which preach the gospel should live of the gospel.",
      niv: "Don't you know that those who serve in the temple get their food from the temple, and that those who serve at the altar share in what is offered on the altar? In the same way, the Lord has commanded that those who preach the gospel should receive their living from the gospel.",
      explanation: "In the Old Testament, the tribe of Levi, known as Levites, were appointed to not do natural work, but rather work in the house of the Lord, and minister unto him for the people, without distractions.  \n For the natural sustenance of the Levites, the food to eat, the cloth to put on etc, God appointed that those who come to worship in the temple must bring their tithes and offerings. As such, the Levites were living of the (carnal) things of the temple. \n In the New Testament as well, the Lord has ordained that those who preach the gospel, labouring diligently in word and doctrine, should live of the gospel. Meaning that, those to whom the gospel is preached are also expected to give to the ministers for their sustenance.  "
    }
  ];

  const downloadDocument = async () => {
    try {
      setDownloading(true);
      const response = await fetch('https://server-wizg.onrender.com/api/single/MemoryVerse');

      if (!response.ok) throw new Error('Failed to download document.');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Open PDF in a new tab
      window.open(url, '_blank');

      // Also trigger download for user convenience
      const link = document.createElement('a');
      link.href = url;
      link.download = 'MemoryVerse.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();

      setToast({ message: 'Document downloaded and opened successfully!', type: 'success' });
    } catch (error) {
      console.error('Download error:', error);
      setToast({ message: 'Failed to download document. Please try again.', type: 'error' });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-cream">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/documents')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Previous Page</span>
          </button>
          <button
            onClick={() => navigate('/home')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-cream rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2 border-orange-primary">
            <BookOpen className="w-10 h-10 text-orange-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Memory Verse Materials</h1>
          <p className="text-gray-600 text-lg">
            Study materials for {getGreeting()}
          </p>
        </div>

        {/* Download Button */}
        <div className="text-center mb-8">
          <button
            onClick={downloadDocument}
            disabled={downloading}
            className={`bg-orange-primary hover:bg-orange-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 mx-auto ${
              downloading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {downloading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download Document</span>
              </>
            )}
          </button>
        </div>

        {/* Memory Verses Content */}
        <div className="space-y-8">
          {memoryVerses.map((verse, index) => (
            <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-orange-100">
              <h2 className="text-2xl font-bold text-orange-800 mb-6">{verse.reference}</h2>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">King James Version (KJV)</h3>
                <p className="text-gray-600 italic leading-relaxed bg-orange-50 p-4 rounded-xl">
                  "{verse.kjv}"
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">New International Version (NIV)</h3>
                <p className="text-gray-600 italic leading-relaxed bg-orange-50 p-4 rounded-xl">
                  "{verse.niv}"
                </p>
              </div>

              <div className="bg-orange-100 border border-orange-300 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-orange-800 mb-3">Explanation</h3>
                <div className="text-orange-700 leading-relaxed space-y-3">
                  {verse.explanation.split('\n').map((line, i) =>
                    line.trim() ? <p key={i}>{line}</p> : <br key={i} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Study Tips */}
        <div className="mt-12 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
          <h3 className="text-2xl font-bold text-orange-800 mb-4 text-center">Revision Tips</h3>
          <div className="grid md:grid-cols-2 gap-6 text-orange-700">
            <div>
              <h4 className="font-semibold mb-2">Memorization Strategy</h4>
              <ul className="space-y-1 text-sm">
                <li>• Read the verse aloud multiple times</li>
                <li>• Practice daily for Proficiency</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Understanding the explanation</h4>
              <ul className="space-y-1 text-sm">
                <li>• Read Explanation under each Memory verse</li>
                <li>• Study the historical background if you can</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default MemoryVerseDocument;
