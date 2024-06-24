/*global chrome*/
import { getActiveTabURL } from "../../utils/utils";
import { useEffect, useState } from "react";
import NoteCard from "./Notes";

function App() {
  const [youtube, setYouTube] = useState(true);
  const [loading, setIsLoading] = useState(true);
  const [videos, setVideo] = useState([]);
  

  useEffect(() => {
    async function checkActiveTab() {
      const activeTab = await getActiveTabURL();
      const queryParameters = activeTab.url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);

      const currentVideo = urlParameters.get("v");
      if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
        chrome.storage.sync.get([currentVideo], (data) => {
          const currentVideoNotes = data[currentVideo]
            ? JSON.parse(data[currentVideo])
            : [];

          setVideo(currentVideoNotes);
        });
      } else {
        setYouTube(false);
      }
      setIsLoading(false);
    }
    checkActiveTab();
  }, []);

  if (loading) {
    return <>LOading</>;
  }

  return (
    <div style={style}>
      {youtube ? (
        <>
          {videos.map((video) => {
            return <NoteCard title={video.title} describe={video.desc} />;
          })}
        </>
      ) : (
        <>No you</>
      )}
    </div>
  );
}

const style = {
  width: "250px",
  height: "150px",
};

export default App;
