const apiKey = process.env.API_KEY;

function renderVideos() {
    // Define the API key and base URL
   
    const baseUrl = 'https://www.googleapis.com/youtube/v3/search';
  
    // Get search input value
    const searchInput = document.getElementById('searchPar').value + ' shorts' || 'shorts'; // Default to 'funny shorts' if empty
    console.log(searchInput);
    // Define search parameters
    const searchParameters = {
      part: 'snippet',
      type: 'video',
      videoDuration: 'short',
      q: searchInput,
      key: apiKey,
    };
  
    // Function to construct the API URL
    function constructApiUrl(base, params) {
      const queryString = new URLSearchParams(params).toString() ;
      return `${base}?${queryString} `;
    }
  
    const apiUrl = constructApiUrl(baseUrl, searchParameters);
    console.log(apiUrl);
    const videoList = document.getElementById('video-list');
  
    // Clear previous results
    videoList.innerHTML = '';
  
    // Fetch data from the YouTube API
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
        return response.json();
      })
      .then((jsonData) => {
        if (jsonData.items.length === 0) {
          videoList.innerHTML = '<p>No videos found. Try a different search term.</p>';
          return;
        }
  
        jsonData.items.forEach((video) => {
          // Create a container for each video
          const videoItem = document.createElement('div');
          videoItem.classList.add('video-item');
  
          // Populate the video details with an embedded iframe
          videoItem.innerHTML = `
            <iframe 
              width="315" 
              height="560" 
              src="https://www.youtube.com/embed/${video.id.videoId}" 
              title="YouTube video player" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowfullscreen>
            </iframe>
            <div class="video-info">
              <h2>${video.snippet.title}</h2>
              <p>Channel: ${video.snippet.channelTitle}</p>
              <p>Published At: ${new Date(video.snippet.publishedAt).toLocaleDateString()}</p>
            </div>
          `;
  
          // Append the video to the list
          videoList.appendChild(videoItem);
        });
      })
      .catch((error) => {
        console.error('Error:', error);
        videoList.innerHTML = `<p>Error loading videos. Please try again later.</p>`;
      });
  }
  
  // Attach event listener to the search button
  document.getElementById('searchBtn').addEventListener('click', renderVideos);
  
  // Initialize with default videos when the page loads
  document.addEventListener('DOMContentLoaded', renderVideos);
  