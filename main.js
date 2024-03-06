const prevButton = document.getElementById('prev')
const nextButton = document.getElementById('next')
const repeatButton = document.getElementById('repeat')
const shuffleButton = document.getElementById('shuffle')
const audio = document.getElementById('audio')
const songImage = document.getElementById('song-image')
const songName = document.getElementById('song-name')
const songArtist = document.getElementById('song-artist')
const pauseButton = document.getElementById('pause')
const playButton = document.getElementById('play')
const playListButton = document.getElementById('playlist')

const maxDuration = document.getElementById('max-duration')
const currentTimeRef = document.getElementById('current-time')

const progressBar = document.getElementById('progress-bar')
const playListContainer = document.getElementById('playlist-container')
const closeButton= document.getElementById('close-button')
const playListSongs = document.getElementById('playlist-songs')

const currentProgress = document.getElementById('current-progress')


//sira
let index = 4

//dongu
let loop = true


const songsList =[
    {
        name:'SadButTrue',
        link: 'assets/Metallica_ Sad But True (Official Music Video).mp3',
        artist:'Metallica',
        image:'assets/metallica1.jpg'
    },
    {
        name:'NothingElseMatters',
        link:'assets/Metallica_ Nothing Else Matters (Official Music Video).mp3',
        artist:'Metallica',
        image:'assets/metallica2.jpg'
    },
    {
        name:'OnMyOwn',
        link: 'assets/Darci - On My Own (Official Audio).mp3',
        artist:'Darci',
        image:'assets/darci.jpg'
    },
    {
        name:'DontBeSoShy',
        link: 'assets/dontbesoshy.mp3',
        artist:'imany',
        image:'assets/imany.jpg'
    }
]
 

const playAudio = () =>{
    audio.play()
    pauseButton.classList.remove('hide') // goster
    playButton.classList.add('hide') //gizle
}

//durdur
const pauseAudio = () =>{
    audio.pause()
    pauseButton.classList.add('hide')
    playButton.classList.remove('hide')
}

//sarki ata
const setSong = (arrayIndex) =>{
    let {name, link, artist, image} = songsList[arrayIndex]

    console.log(artist)
    audio.src = link
    songName.innerHTML = name //dinle
    songArtist.innerHTML = artist
    songImage.src = image

    audio.onloadedmetadata = () =>{
        //saniye hesapla
        maxDuration.innerText = timeFormatter(audio.duration)
    }

    playListContainer.classList.add('hide')
    playAudio()
}

//surekli saniye kontrolu yap
setInterval(() => {
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime)
    //progress i ilerletecegiz 30%
    currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%"
}, 1000);

//sarki suresi degisim kismi tiklanildiginda
progressBar.addEventListener('click',(event)=>{

    //baslangic
    let coordStart = progressBar.getBoundingClientRect().left
    console.log(coordStart)

    //x ekseninde tiklama noktasi 
    let coordEnd = event.clientX
    console.log(coordEnd)
    console.log(progressBar.offsetWidth)

    //yuzdelik olarak hesaplama yap
    let progress = (coordEnd - coordStart) / progressBar.offsetWidth
    console.log(progress)

    //progress i ilerlet
    currentProgress.style.width = progress * 100 + "%"

    //sesin anlik suresini degistir
    audio.currentTime = progress * audio.duration

    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')
})

//zaman formatla
const timeFormatter = (timeInput) =>{
    let minute = Math.floor(timeInput / 60)
    minute = minute < 10 ? "0"+minute : minute
    let second = Math.floor(timeInput % 60)
    second = second < 10 ? "0"+second : second
    return `${minute}:${second}`
}

const previousSong = () =>{
    if (index > 0) {
        pauseAudio()
        index = index - 1
    } else {
        index = songsList.length - 1
    }
    setSong(index)
}

const nextSong = () =>{
    if (loop) {
        if (index == (songsList.length - 1)) {
            index = 0
        }else {
            index = index  + 1
        }
        setSong(index)
    } else {
        let randIndex = Math.floor(Math.random() * songsList.length)
        setSong(randIndex)
    }

}

//tekrar butonuna tiklanildiginda
repeatButton.addEventListener('click', ()=>{
    if (repeatButton.classList.contains('active')) {
        repeatButton.classList.remove('active')
        audio.loop = false
    } else {
        repeatButton.classList.add('active')
        audio.loop = true
    }
})

//karistirici tiklanildiginda
shuffleButton.addEventListener('click',()=>{
    if (shuffleButton.classList.contains('active')) {
        shuffleButton.classList.remove('active')
        audio.loop = true
    } else {
        shuffleButton.classList.add('active')
        audio.loop = false
    }
})

//sarki bittiginde,
audio.onended = () =>{
    nextSong() //sonraki sarkiyi cagir
}

playListButton.addEventListener('click',()=>{
    playListContainer.classList.remove('hide')
})

closeButton.addEventListener('click',()=>{
    playListContainer.classList.add('hide')
})

//oynat butonuna tiklanildiginda
playButton.addEventListener('click',playAudio)

//durdur butonuna tiklanildiginda
pauseButton.addEventListener('click', pauseAudio)

//onceki tiklanirsa
prevButton.addEventListener('click',previousSong)

//sonraki tiklanildiginda
nextButton.addEventListener('click',nextSong)


const initializePlaylist = () =>{
    for(let i in songsList){
        playListSongs.innerHTML += `<li class="playlistSong"
        onclick="setSong(${i})">
        <div class="playlist-image-container">
         <img src="${songsList[i].image}"/>
        </div>
        <div class="playlist-song-details">
         <span id="playlist-song-name">
          ${songsList[i].name}
         </span>
         <span id="playlist-song-artist-album">
         ${songsList[i].artist}
         </span>
        </div>
       </li>
       `
    }
}

window.onload = () => {
    index = 0
    setSong(index)
    pauseAudio()
    initializePlaylist()
}