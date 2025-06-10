import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { ArrowLeft, Home, Download, Dumbbell, CheckCircle } from 'lucide-react';



const ExerciseDocument = () => {
  const { getGreeting } = useUser();
  const navigate = useNavigate();
    const [downloadSuccess, setDownloadSuccess] = useState(false);

  const biblicalEras = [
    {
      name: "The Creation Era",
      description: "This was the Era of the beginning of the stories of the Bible as recorded in Genesis 1-11",
      keyFigures: ["Adam", "Eve", "Abel", "Cain", "Enoch","Noah", "Shem" ],
      books: ["Genesis 1 - 11"]
    },
    {
      name: "The Era of the Patriarchs",
      description: "The word Patriarch means founding fathers. The Era of Patriarchs therefore refers to the era of the founding fathers of the Israelites.",
      keyFigures: ["Abraham", "Isaac", "Jacob", "Reuben", "Simeon", "Levi", "Joseph", "Benjamin"],
      books: ["Genesis 12 -50"]
    },
    {
      name: "Exodus Era",
      description: "This was the era in which the Israelites were made slaves in the land of Egypt, and God had to raise Moses to deliver them. ",
      keyFigures: ["Moses", "Aaron", "Jethro", "Pharaoh", "Joshua"],
      books: [ "Exodus", "Leviticus","Numbers", "Deuteronomy"],
    },
    {
      name: "The Conquest Era",
      description: "God promised Abraham to give some land to his descendants. After the Israelites left Egypt and spent years in the wilderness, by God’s help, they began to fight for the land which God had promised them. Moses fought for some of the land before his death, then, Joshua continued with the rest.",
      keyFigures: ["Joshua", "Caleb", "Rahab" ],
      books: ["Joshua"],

    },
    {
      name: "Conquest Era",
      description: "The conquest and settlement of the Promised Land",
      keyFigures: ["Joshua", "Caleb", "Rahab"],
      books: ["Joshua"]
    },
    {
      name: "Judges Era",
      description: "When the Israelites got to the promised land, they had no king to lead them to war against their enemies, so God appointed judges for such tasks. ",
      keyFigures: ["Deborah", "Gideon", "Samson", "Sameul", "Gideon", ],
      books: ["Judges", "Ruth", "1 Samuel"],
    
    },
    {
      name: "Era of the United Kingdom of Israel",
      description: "After the judges era, the children of Israel rejected God from being their king, they demanded for a human king like other nations of the earth. And God permitted them, by giving them their first king named Saul. ",
      keyFigures: ["Samuel", "Saul", "David", "Solomon"],
      books: ["1 Samuel", "2 Samuel", "1 Kings", "1 Chronicles", "2 Chronicles","Psalms", "Proverbs", "Song of Solomon", "Ecclesiastes" ],
    },
    {
      name: "Era of the Divided Kingdom of Israela",
      description: "Due to the ungodliness of King Solomon, Godprophesied the division of the kingdom of Israel into two. This the kingdom was divided into the Kingdom of Judea, and the Kingdom of Israel. ",
      keyFigures: ["Rehoboam", "Asa", "Jehoshaphat", "Ahaziah", "Amaziah", "Jeroboam", "Baasha", "Zimri", "Ahijah","Elijah", "Elisha", "Isaiah"],
      books: ["1 Kings", "2 Kings", "2 Chronicles", "Isaiah", "Jeremiah" ],
    
    },

    {
      name: "Babylonian Captivity Era",
      description: "Because of the great sins of the Kingdom of Judea, Goddelivered them into the hands of the Nebuchadnezzar, King of Babylon, who destroyed their city, and carried them captives into his land.",
      keyFigures: ["Daniel", "Jeremiah", "Ezekiel", "Shadrach", "Meshach", "Abednego", "Nebuchadnezzar" ],
      books: ["Jeremiah", "Lamentations", "Daniel", "Ezekiel" ],
    },

    {
      name: "Silent Era",
      description: "After Prophet Malachi, God did not speak through any prophet until the time of the New Testament. The silent era is the space between the book of Malachi and that of Matthew. And it covers about 400 years. ",
      keyFigures: ["None Mentioned"],
      books: ["No Book"],
    },

     {
      name: "The Gospel Era",
      description: "All the Old Testament prophets prophesied about the coming of the Messiah (Christ). The Gospel Era is the era of the coming of this Messiah. This Messiah was God who became a man, purposely to reveal God the Father to us and as well die for the sins of humanity.",
      keyFigures: ["Peter", "Andrew", "James", "John", "Philip", "Nathaniel", "Joseph","Mary"],
      books: ["Matthew", "Mark", "Luke", "John"],
    },

       {
      name: "The Era of the beginning of the church",
      description: "After Jesus ascended into heaven, the church wasborn. The history of the church began in Acts of apostles, and theninto the epistles.",
      keyFigures: ["Peter", "Andrew", "James", "John", "Philip", "Paul"],
      books: ["Acts"],
    },

       {
      name: "Missions Era",
      description: "This refers to when the gospel begin to go from the Jews into the Gentile nations. ",
      keyFigures: ["Paul", "Barnabas", "Timothy", "Silas", "Lydia", "Philemone"],
      books: ["Acts", "Romans", "1 & 2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians etc"],
    },

     {
      name: "The Era of the End and New Beginning",
      description: "The vision of Apostle John, in which he was sent to seven churches. And the story of the end time, and new heaven and new earth.",
      keyFigures: ["Apostle John"],
      books: ["Revelation"],
    }
  ];

   const downloadDocument = async () => {
    try {
      const response = await fetch('https://server-wizg.onrender.com/api/single/Exercise');
      if (!response.ok) throw new Error('Failed to download document');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Open in new tab
      const newTab = window.open(url, '_blank');
      if (!newTab) throw new Error('Popup blocked! Please allow popups.');

      // Force download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Exercise-Document.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000); // hide after 5s
    } catch (error) {
      console.error(error.message);
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
            <Dumbbell className="w-10 h-10 text-orange-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Exercise Materials</h1>
          <p className="text-gray-600 text-lg">
            Biblical Eras Study Guide for {getGreeting()}
          </p>
        </div>

        {/* Success Notification */}
        {downloadSuccess && (
          <div className="bg-green-100 border border-green-300 text-green-800 px-6 py-3 rounded-xl mb-6 flex items-center space-x-2 text-sm font-medium">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>Exercise document downloaded successfully!</span>
          </div>
        )}

        {/* Download Button */}
        <div className="text-center mb-8">
          <button
            onClick={downloadDocument}
            className="bg-orange-primary hover:bg-orange-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 mx-auto"
          >
            <Download className="w-5 h-5" />
            <span>Download Document</span>
          </button>
        </div>

        
        {/* Biblical Eras */}
        <div className="space-y-8">
          {biblicalEras.map((era, index) => (
            <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-orange-100">
              <h2 className="text-2xl font-bold text-orange-800 mb-4">{era.name}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed bg-orange-50 p-4 rounded-xl">
                {era.description}
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-800 mb-3">Key Figures</h3>
                  <div className="space-y-2">
                    {era.keyFigures.map((figure, figureIndex) => (
                      <span key={figureIndex} className="inline-block bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">
                        {figure}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-800 mb-3">Biblical Books</h3>
                  <div className="space-y-2">
                    {era.books.map((book, bookIndex) => (
                      <span key={bookIndex} className="inline-block bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">
                        {book}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Study Guidelines */}
        <div className="mt-12 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
          <h3 className="text-2xl font-bold text-orange-800 mb-4 text-center">Study Guidelines</h3>
          <div className="grid md:grid-cols-3 gap-6 text-orange-700">
            <div>
              <h4 className="font-semibold mb-2">Era Description</h4>
              <p className="text-sm">Provide a comprehensive overview of the era's significance and main events.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Key Figures</h4>
              <p className="text-sm">Name at least three important people and their roles during the era.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Biblical Books</h4>
              <p className="text-sm">Identify and read the relevant Bible chapters that align with each era.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExerciseDocument;