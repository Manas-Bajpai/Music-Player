console.log('js');
let currentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/songs")
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // console.log(as);
    let songs = []
    for(index =0;index<as.length;index++){
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs;
    
}

const playMusic=(track, pause=false)=>{
    // let audio = new Audio("/songs/"+track)
    currentSong.src = "/songs/"+track;
    if(!pause){
        currentSong.play()
        play.src = "./img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main(){
    // get all the songs in the list
    let songs = await getSongs();
    playMusic(songs[0], true)
    // console.log(songs);

    // play the first song
    // var audio = new Audio(songs[0]);
    // audio.play();
    // audio.addEventListener("loadeddata",()=>{
    //     console.log(audio.duration, audio.currentSrc, audio.currentTime);
        
    // })

    // show all the songs in the list
    let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                <img class="invert" src="./img/music.svg" alt="">
                <div class="info">
                  <div>${song.replaceAll("%20", " ")}</div>
                  <div>Song Artist</div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img class="invert" src="./img/play2.svg" alt="">
                </div>
              </li>`;
    }
    
    // attach an event listener to each song
    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", elemet=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
        
    })

    // attach an event listener to play and next and previuos
    play.addEventListener("click", ()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "./img/pause.svg"
        }
        else{
            currentSong.pause();
            play.src = "./img/play.svg"
        }
    })

    //liten for time update
    currentSong.addEventListener("timeupdate", ()=>{
        // console.log(currentSong.currentTime, currentSong.duration);
         document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
         document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //add event listner to seek
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left =percent +"%";
        currentSong.currentTime = ((currentSong.duration)*percent)/100
    })
}
main();
