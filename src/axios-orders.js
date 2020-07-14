import axios from 'axios'

const instance = axios.create({
    baseUrl:'https://react-burger-builder-49da6.firebaseio.com/'
});

export default instance;

