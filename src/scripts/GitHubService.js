import {GitHubHelper} from "./githubHelper.js";


const BASE_URL = "https://api.github.com";

class GitHubService {

    constructor(username) {
        this.username = username;
    }

    getRepositories() {
        var apiUrl = `${BASE_URL}/users/${this.username}/repos?per_page=100`;
        return fetch(apiUrl);
    }

}

export { GitHubService }