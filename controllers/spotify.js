const axios = require('axios').default;
const qs = require('querystring')

var client_id = process.env.SPOTIFY_CLIENT_CODE_API;
var client_secret = process.env.SPOTIFY_CLIENT_SECRET_CODE_API;

exports.getGenres = async (req, res, next) => {
  // tem que ser assim pq a documentação deles disse que sim]
  const headers = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: client_id,
      password: client_secret,
    },
  };
  const data = {
    grant_type: 'client_credentials',
  };
  // 

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify(data),
      headers
    );
    const genresResponse = await axios.get('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + response.data.access_token
      }
    })
    const allGenres = genresResponse.data.genres 
    const genres = getRandomGenres(allGenres)
    res.send(genres)
  } catch (error) {
    console.log(error);
    res.send(error)
  }
}
exports.getSongs = async (req, res, next) => {
  const headers = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
      username: client_id,
      password: client_secret,
    },
  };
  const data = {
    grant_type: 'client_credentials',
  };

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify(data),
      headers
    );
    const genre = req.query.genre
    console.log(req)
    const songsResponse = await axios.get(`https://api.spotify.com/v1/search?q=genre:${genre}&type=track`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + response.data.access_token
      }
    })
    const songs = songsResponse.data

    res.send(songs)
  } catch (error) {
    console.log(error);
    res.send(error)
  }
}
function getRandomGenres(array) {
  const indexOne = Math.floor(Math.random() * array.length)
  array.splice(indexOne,1)
  const indexTwo = Math.floor(Math.random() * array.length)
  return [array[indexOne],array[indexTwo]]
}
