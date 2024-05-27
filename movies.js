/**
 * Valerie Hetherington
 * May 26th 2024
 * CS 132
 * This file encompasses the javascript for Movie Maddness, including event listeners,
 * API fetching, and adding html elements to the screen dynamically
 */

(function() {
    "use strict";

    let accessToken = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOGYwNTBjNGE0MDZiOGFhMTIwZjM0OGQyYTFjNWMyZSIsInN1Y" 
    + "iI6IjY2NGZmOGY0YzlmNWM4NGJkNjU0NDhmZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.0pVBRhMsSbwCm"
    + "YQ1FLfAS_S62wdQwNoGmF9qSCNedTA";

    /*
     * Adds event listeners to movie/tv labels and search button
     * @params: none
     * @returns: none
     */
    async function init() {
        // Add event listeners for each categorization

        const POPULAR_MOVIES = document.getElementById("popular-movies");
        POPULAR_MOVIES.addEventListener('click', () => {
            fetchMovies("popular", "movie");
        });

        const TOP_RATED_MOVIES = document.getElementById("top-rated-movies");
        TOP_RATED_MOVIES.addEventListener('click', () => {
            fetchMovies("top_rated", "movie");
        });

        const NOW_PLAYING_MOVIES = document.getElementById("now-playing-movies");
        NOW_PLAYING_MOVIES.addEventListener('click', () => {
            fetchMovies("now_playing", "movie");
        });

        const POPULAR_TV = document.getElementById("popular-tv");
        POPULAR_TV.addEventListener('click', () => {
            fetchMovies("popular", "tv");
        });

        const TOP_RATED_TV = document.getElementById("top-rated-tv");
        TOP_RATED_TV.addEventListener('click', () => {
            fetchMovies("top_rated", "tv");
        });

        // Add event listener for the search button
        const SEARCH_BUTTON = document.getElementById("search-button");
        if(SEARCH_BUTTON != null){
            SEARCH_BUTTON.addEventListener('click', () => {
                const query = document.getElementById("search-query").value;
                if (query) {
                    searchMovies(query);
                }
            });
        }

    }

    /**
     * Gets the movies or tv shows from the API and display them on the screen
     * @param {string} extension 
     * @param {string} tvMovie 
     * @returns: none
     */
    async function fetchMovies(extension, tvMovie){
        let url = ""; 
        if(tvMovie === "movie"){
            url = `https://api.themoviedb.org/3/movie/${extension}`;
        }
        else{
            url = `https://api.themoviedb.org/3/tv/${extension}`;
        }

        const OPTIONS = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };

        // Make the fetch request
        await fetch(url, OPTIONS)
        // Check the response status and parse the JSON
        .then(checkStatus)
        // Populate movie results
        .then(response => response.json())
        .then(data => {
            populateMoviesResults(data)
        })
        // Handle any errors that occur
        .catch(error => {
            handleError(error.message)
        });
    }

     /**
     * Gets the movie or tv show from the API based on user search input
     * @param {string} query 
     * @returns: none
     */
    async function searchMovies(query) {
        const URL = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`;

        const OPTIONS = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };

        // Make the fetch request
        await fetch(URL, OPTIONS)
        // Check the response status and parse the JSON
        .then(checkStatus)
        // Populate movie results
        .then(response => response.json())
        .then(data => {
            populateMoviesResults(data, "")
        })
        // Handle any errors that occur
        .catch(error => {
            handleError(error.message)
        });
    }


    /**
     * Add the movie or tv posters, titles, and descriptions to the screen 
     * @param {string} data 
     * @returns: none
     */
    function populateMoviesResults(data){
        const MOVIE_POSTER = document.getElementById('movie-poster')
        MOVIE_POSTER.innerHTML = '';

        const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

        for(let i = 0; i < data.results.length; i++){
            let current_result = data.results[i];
            if(current_result.overview != ""){
                
                let img = document.createElement('img')
                if(current_result.backdrop_path == null){
                    img.src = "movie-theatre.png"
                }
                else{
                    img.src = IMAGE_BASE_URL + current_result.backdrop_path;
                }
                img.style.marginTop = '5vh'

                img.addEventListener('click', () => {
                    displayUpClose(current_result);
                });
                

                let text = document.createElement('p');
                let title = document.createElement('p');
                text.textContent = current_result.overview;
                if(current_result.name === undefined){
                    title.textContent = current_result.title; 
                    img.alt = current_result.title;
                }
                else{
                    title.textContent = current_result.name;
                    img.alt = current_result.name;
                }

                text.style.marginBottom = '5vh';
                title.style.marginBottom = '1vh';
                title.style.fontSize = '18pt';
                title.style.color = '#c0c1c1';
                MOVIE_POSTER.appendChild(img);
                MOVIE_POSTER.appendChild(title);
                MOVIE_POSTER.appendChild(text);
            }

        }
    }

    /**
     * Add the movie or tv poster, title, language, releaseDate and description to the screen 
     * @param {string} current_result 
     * @returns: none
     */
    function displayUpClose(current_result){
        const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
        const MOVIE_POSTER = document.getElementById('movie-poster');
        MOVIE_POSTER.innerHTML = '';
        let img = document.createElement('img');
        console.log(current_result.backdrop_path);
        if(current_result.backdrop_path == null){
            img.src = "movie-theatre.png"
        }
        else{
            img.src = IMAGE_BASE_URL + current_result.backdrop_path;
        }
        let text = document.createElement('p');
        let title = document.createElement('p');
        text.textContent = current_result.overview;
        if(current_result.name === undefined){
            title.textContent = current_result.title; 
            img.alt = current_result.title;
        }
        else{
            title.textContent = current_result.name;
            img.alt = current_result.name;
        }
        let language = document.createElement('p');
        language.textContent = "Language: " + current_result.original_language;
        let releaseDate = document.createElement('p');
        releaseDate.textContent = "Release Date: " + current_result.release_date;
        releaseDate.style.marginBottom = "15vh";

        MOVIE_POSTER.appendChild(img);
        title.style.fontSize = '18pt';
        title.style.color = '#c0c1c1';
        MOVIE_POSTER.appendChild(title);
        MOVIE_POSTER.appendChild(text);
        MOVIE_POSTER.appendChild(language);
        MOVIE_POSTER.appendChild(releaseDate);
        console.log(current_result);
        
    }

    /**
     * Display the error message
     * @param {string} errMsg 
     */
    function handleError(errMsg) {
        const messageArea = document.getElementById("message-area");
        messageArea.textContent = errMsg;
        messageArea.classList.remove("hidden");
    }

    init();
})();
