import { useState, useEffect } from "react";
import styles from "./components.module.css";
import SpotifyWebApi from "spotify-web-api-js";
const spotifyApi = new SpotifyWebApi();

export default function Login() {
  var params = null;
  var token = null;
  if (typeof window !== "undefined") {
    params = getHashParams();
    token = params.access_token;
  }

  const [loggedIn, setLoggedIn] = useState(token ? true : false);
  const [nowPlaying, setPlaying] = useState({
    time: 0,
    duration: 0,
    name: "Not Playing",
    albumArt: "",
    artist: [],
    albumName: "",
  });
  if (token) {
    spotifyApi.setAccessToken(token);
  }

  function getPlaying() {
    spotifyApi.getMyCurrentPlaybackState().then((response) => {
      setPlaying({
        time: response.progress_ms,
        duration: response.item.duration_ms,
        name: response.item.name,
        albumArt: response.item.album.images[0].url,
        artist: response.item.artists,
        albumName: response.item.album.name,
      });
    });
  }

  // function getAnalysis(){
  //   spotifyApi.getAudioAnalysisForTrack().then
  // }

  useEffect(() => {
    const interval = setInterval(() => {
      if(loggedIn){
        getPlaying();
      }
      
    }, 500);
    return () => clearInterval(interval);
  }, []);

  function getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
  }

  return (
    <div>
      {loggedIn && nowPlaying ? (
        <div>
        <div className={styles.container}>
          <div className={styles.songInfo}>
            <div className={styles.songDesc}>
              <img src={nowPlaying.albumArt} style={{ height: 275 }} />
              <div className={styles.songDetails}>
                <div>
                  <h1>{nowPlaying.name}</h1>
                  <h2>
                    {nowPlaying.artist.map(({ name }, i) => (
                      <span key={i}>
                        {name}
                        {nowPlaying.artist.length > 0 &&
                        i === nowPlaying.artist.length - 1
                          ? ""
                          : ", "}
                      </span>
                    ))}
                  </h2>
                  <h3>{nowPlaying.albumName}</h3>
                </div>
              </div>
            </div>
            <div>
              <div className={styles.progress}>
                <div
                  className={styles.progress__bar}
                  style={{
                    width: `${(nowPlaying.time * 100) / nowPlaying.duration}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div>
            <p>test</p>
          </div>
          <div>
            <p>test</p>
          </div>
        </div>
        </div>
      ) : (
        <div className={styles.login}>
        <a className={styles.button} href="http://localhost:8888/login">
          Login with Spotify
        </a>
        </div>
      )}
    </div>
  );
}
