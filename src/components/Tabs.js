import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';
import sleep from '../images/sleep.jpg';
import dj from '../images/dj.svg';

const spotifyWebApi = new Spotify();

export default class Tabs extends Component {

    constructor() {
        super();
        const params = this.getHashParams();    
        
        this.state = {
          nowPlaying: {
            artist: 'Not Checked',
            name: 'Not Checked',
            image: '',
            device: '',
            volume: ''
          },
          top50: {
            name: [],
            artist: []
          },
          loggedIn: params.access_token ? true : false
        }
        // This allows you to access the spotify API
        if(params.access_token){
          spotifyWebApi.setAccessToken(params.access_token)
        }
      }
    
    getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.search.substring(1);
    while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
    }

    // Retrieve the current song playing.
    getNowPlaying() {
        if(this.state.loggedIn) {
            spotifyWebApi.getMyCurrentPlaybackState()
            .then((response) => {
                const currentPlaying = document.getElementById('current-display');
                const topList = document.getElementById("top50-list");
                const displayContainer = document.getElementById("display-container");
                const defaultImage = document.getElementById("default");
                
                currentPlaying.style.display = "block"
                topList.style.display = "none";
                displayContainer.style.display = "block";
                defaultImage.style.display = "none";
                
            if(response === '') {
                this.setState({
                nowPlaying: {
                    name: "You are not listening to anything at the moment :(",
                    artist: "Go throw something on!",
                    device: "Nothing",
                    volume: "*cricket*",
                    image: sleep
                }
                })
            } else {
                this.setState({
                nowPlaying: {
                    artist: response.item.artists[0].name,
                    name: response.item.name,
                    image: response.item.album.images[0].url,
                    device: response.device.name,
                    volume: response.device.volume_percent
                }
                })
            }
    
            })
        } else {
            const status = document.getElementById("current-status")
            status.innerHTML = "Please log into Spotify to view Now Playing"
            status.classList.add("status")
            

            setTimeout(() => {
                status.classList.remove("status")
                status.innerHTML = ""
            }, 3000)
        }
    }

    // Retrieve an array of the user's top 50 tracks.
    getMyTopTracks() {
        if(this.state.loggedIn) {
            spotifyWebApi.getMyTopTracks({limit: 50})
            .then((response) => {      
            var i;
            let top50List = [];
            let top50Artist = [];
            const topList = document.getElementById("top50-list");
            const currentPlaying = document.getElementById("current-display");
            const defaultImage = document.getElementById("default");
    
            topList.style.display = "block";
            currentPlaying.style.display = "none";
            defaultImage.style.display = "none";
    
            if(this.state.top50.name.length === 0) {
                for(i = 0; i < response.items.length; i++) {
                top50List.push(response.items[i].name)
                top50Artist.push(response.items[i].artists[0].name)
                }
        
                if(top50List.length === 50 && top50Artist.length === 50) {
                this.setState({
                    top50: {
                    name: top50List,
                    artist: top50Artist
                    }
                })
                for(i = 0; i < this.state.top50.name.length; i++) {
                    this.createListItem(this.state.top50.name[i], this.state.top50.artist[i])
                }
                }
            }
            })
        } else {
            const status = document.getElementById("50-status")
            status.innerHTML = "Please log into Spotify to view your Current Top 50 Songs"
            status.classList.add("status")
            

            setTimeout(() => {
                status.classList.remove("status")
                status.innerHTML = ""
            }, 3000)
        }
        
    }

    // Turns the top 50 array into an ordered list.  
    createListItem(song, artist) {
        const orderedList = document.getElementById("top50");
        const listItem = document.createElement("li");

        listItem.textContent = song + " by " + artist;

        orderedList.appendChild(listItem)
    }

    render() {
        return(
            <div className="tab">                
                <div className="btn-group">
                    <button onClick={() => {
                    this.getNowPlaying()
                    }}>
                    <h1>Check Now Playing</h1>
                    </button>
                    <br/>
                    <button onClick={() => {
                    this.getMyTopTracks()
                    }}>
                    <h1>Show Top 50 Songs</h1>
                    </button>
                </div>
                <div id= "display-container" className="display-container">
                    <div id="default" className="default">
                        <div id="current-status"></div>
                        <div id="50-status"></div>
                        <img src={dj}/>
                    </div>
                    <div id="current-display" style={{
                        background: this.state.nowPlaying.image,
                        display: 'none'
                        }}>
                        <div>
                            <h1>Now Playing: {this.state.nowPlaying.name}</h1>
                            <h2> By: {this.state.nowPlaying.artist}</h2>
                        </div>
                        <div id="cover">
                            <img src={this.state.nowPlaying.image} />
                        </div>
                        <div>
                            <h3>Listening On: {this.state.nowPlaying.device}</h3>
                            <h3>Volume Level: {this.state.nowPlaying.volume}</h3>
                        </div>
                    </div> 
                    <div className="top50-list" id="top50-list">
                        <ol id="top50">
                            <h2>Your Current Top 50</h2>
                        </ol>
                    </div>
                </div>
            </div>
        )
    }
}