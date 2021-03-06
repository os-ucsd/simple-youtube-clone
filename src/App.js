import React from 'react';
import './App.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      searchQuery: "",
      searchSucceeded: false,
      searchResults: [],
      nextPageToken: "",
      prevPageToken: ""
    }
  }

  getYoutubeVideoWithSearch = evt => {
    // Prevents the browser from reloading when you click the button
    evt.preventDefault();
    // TODO: Search for youtube results with the provided search query!
    const {searchQuery, nextPageToken, prevPageToken} = this.state;
    const {id} = evt.target;

    // Replace all spaces with %20
    let updatedQuery = searchQuery.replace(" ", "%20");
    let url = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=' + updatedQuery + '&key=[YOUR API KEY]';
    if (id === 'next') {
      url += '&pageToken=' + nextPageToken;
    }
    else if (id === 'prev') {
      url += '&pageToken=' + prevPageToken;
    }

    fetch(url)
      .then(resp => resp.json())
      // Note: we're only going to store the first 5 results (5 results per page) in this example
      .then(data => {
        this.setState({
          searchResults: data.items,
          searchSucceeded: true,
          nextPageToken: data.nextPageToken,
          prevPageToken: data.prevPageToken
        });
      });
  }

  handleChange = evt => {
    // Update the state variable 'searchQuery' with whatever was typed into the input textbox
    this.setState({searchQuery: evt.target.value});
  }

  redirectToUrl = url => {
    this.setState({searchSucceeded: false});
    window.location.href=url;
  }

  render() {
    const {searchResults, searchSucceeded, prevPageToken, nextPageToken} = this.state;
    
    // Component that'll hold the search results, each result as a single card
    const searchResultsComponent = searchResults && searchResults.length > 0 ? searchResults.map(result => {
      const {videoId} = result.id;
      const {title, description, channelTitle} = result.snippet;
      const {height, width, url} = result.snippet.thumbnails.medium;
      return(
        <div className="videoCardContainer" onClick={() => this.redirectToUrl("https://www.youtube.com/watch?v=" + videoId)}>
          <img src={url} height={height} width={width} alt={title} />
          <div className="videoDetails">
            <h3 className="videoText">{title}</h3>
            <p className="videoText">{channelTitle}</p>
            <p className="videoText">{description}</p>
          </div>
        </div>
      );
    })
    : null;

    return (
      <div className="App">
        <form className="searchContainer">
          <input className="searchBox" type="text" id="search" name="search" value={this.state.searchQuery} 
            onChange={this.handleChange} placeholder="Search"/>
          <button className="searchButton" id="search" onClick={this.getYoutubeVideoWithSearch}>Search</button>
        </form>
        <div className="resultContainer">
        {
          // If a search was made, show the search results component
          searchSucceeded ? searchResultsComponent : <div style={{"textAlign": "center"}}><h3>No videos to show</h3></div>
        }
        </div>
        {
          searchSucceeded ? 
          <div className="changePageContainer">
            {
              prevPageToken ? <button className="button" id="prev" onClick={this.getYoutubeVideoWithSearch}>Prev</button> : null
            }
            {
              nextPageToken ? <button className="button" id="next" onClick={this.getYoutubeVideoWithSearch}>Next</button> : null
            }
          </div>
          : null
        }
      </div>
    );
  }
}

export default App;
