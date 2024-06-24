/*global chrome*/

let youtubeLeftControls, youtubePlayer;
let currentVideo = "";
let currentVideoNotes=[]


const fetchNotes = async()=>{
  return new Promise((resolve)=>{
    chrome.storage.sync.get(([currentVideo], (obj)=>{
      resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
    }))
  })
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, value, videoId } = message;
  console.log(type);

  if (type === "NEW") {
    currentVideo = videoId;
    newVideoLoaded()
  }
  sendResponse({status: "received", videoId:videoId, type:type});
});

const newVideoLoaded = async() => {
  const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
  if(!bookmarkBtnExists){
    const bookmarkBtn = document.createElement("img");
    currentVideoNotes = await fetchNotes()
    
    bookmarkBtn.src = "https://cdn-icons-png.flaticon.com/512/1789/1789313.png"
    bookmarkBtn.className = "ytp-button " + "bookmark-btn";
    bookmarkBtn.title = "Click to make a note";
    bookmarkBtn.style.width = "50px"
    bookmarkBtn.style.height = "50px"


    youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
    youtubePlayer = document.getElementsByClassName('video-stream')[0];

    youtubeLeftControls.appendChild(bookmarkBtn);
    bookmarkBtn.addEventListener("click", addNote);
  }
};

const addNote = async () => {
  const currentTime = youtubePlayer.currentTime;
  const noteDescription = prompt("Enter your note:");
  
  if (noteDescription !== null) { // Check if the user pressed "OK"
    const note = {
      title: getTime(currentTime),
      desc: noteDescription
    };
    
    const currentVideoNotes = await fetchNotes();
    
    chrome.storage.sync.set({
      [currentVideo]: JSON.stringify([...currentVideoNotes, note].sort((a, b) => a.time - b.time))
    });
  }
};


const getTime = t => {
  var date = new Date(0);
  date.setSeconds(t);

  return date.toISOString().substr(11, 8);
};
