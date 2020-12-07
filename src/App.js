import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';
import Header from './components/Header';
import Tabs from './components/Tabs';

const spotifyWebApi = new Spotify();

class App extends Component {

  render() { 
    return (
      <div className="App">
        <Header />
        <Tabs />
      </div>
    );
  }
}

export default App;
