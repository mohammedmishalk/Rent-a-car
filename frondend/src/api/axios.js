import axios from "axios";

const instance =axios.create({
    baseURL:"https://api.snbrandies.live"
});

export default instance;
