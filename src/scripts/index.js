import { GitHubService } from "./GitHubService.js";
import TimeAgo from "./timeHelper.js";

document.addEventListener('DOMContentLoaded', (event) => {

    const listElement = document.getElementById('project-list');
    const paginationElement = document.getElementById('pagination');

    let currentPage = 1;
    let rows = 5;

    function DisplayList(items, wrapper, rowsPerPage, page) {
        wrapper.innerHTML = "";
        page--;

        let start = rowsPerPage * page;
        let end = start + rowsPerPage;
        let paginatedItems = items.slice(start, end);

        for (let i = 0; i < paginatedItems.length; i++) {
            let item = paginatedItems[i];

            let item_element = document.createElement('div');
            item_element.classList.add('item');
            item_element.innerHTML = item;

            wrapper.appendChild(item_element);
        }
        wrapper.style.display = "none";
        wrapper.classList.add("fade-in");
        wrapper.style.display = "";

    }

    function SetupPagination(items, wrapper, rowsPerPage) {
        wrapper.innerHTML = "";

        let pageCount = Math.ceil(items.length / rowsPerPage);
        for (let i = 1; i < pageCount + 1; i++) {
            let btn = PaginationButton(i, items);
            wrapper.appendChild(btn);
        }
    }

    function PaginationButton(page, items) {
        let button = document.createElement('button');
        button.innerText = page;

        if (currentPage == page) button.classList.add('active');

        button.addEventListener('click', function () {
            currentPage = page;
            DisplayList(items, listElement, rows, currentPage);

            let currentButton = document.querySelector('.pagenumbers button.active');
            currentButton.classList.remove('active');

            button.classList.add('active');
        });

        return button;
    }


    var service = new GitHubService("evancjohnson");
    var projects = document.querySelectorAll("#projects");

    setTimeout(function () { setup() }, 3000);

    function setup() {
        service.getRepositories().then(function (response) {
            return response.json();
        })
            .then(function (json) {
                console.log(json);
                var items = listOfProjects(json);
                DisplayList(items, listElement, rows, currentPage);
                SetupPagination(items, paginationElement, rows);
            });
    }



    function listOfProjects(responseJson) {
        var projects = responseJson.map(project => `<div class="github-item"><i class="fab fa-github"></i> <a href='${project.html_url}'>${project.name}</a><p>${project.description === null ? "No description set..." : `${project.description}`}</p><div class="github-item-metadata" >${getLanguage(project)} ${getStars(project)} ${getBranches(project)} Last Updated ${TimeAgo(Date.now() - new Date(project.updated_at))}</div></div>`);
        return projects;
    }

    function getLanguage(project) {
        if (project === undefined || project.language === undefined || project.language === null)
            return "";

        console.log(project.language);
        switch (project.language.toLowerCase()) {
            case "javascript":
                return `<p style="margin-right: 2%"><i class="fab fa-js"></i></p>`;

            case "html":
                return `<p style="margin-right: 2%"><i class="fab fa-html5"></i></p>`;

            case "css":
                return `<p style="margin-right: 2%"><i class="fab fa-css3-alt"></i></p>`;

            case "python":
                return `<p style="margin-right: 2%"><i class="fab fa-python"></i></p>`;

            case "java":
                return `<p style="margin-right: 2%"><i class="fab fa-java"></i></p>`;
            default:
                return "";
        }
    }

    function getStars(project) {
        if (project === undefined || project.stargazers_count === undefined)
            return "";

        return `${project.stargazers_count > 0 ? `<p style="margin-right: 2%"><i class="fas fa-star"></i> ${project.stargazers_count}</p>` : ''}`;
    }

    function getBranches(project) {
        if (project === undefined || project.stargazers_count === undefined)
            return "";

        return `${project.forks_count > 0 ? `<p style="margin-right: 2%"><i class="fas fa-code-branch"></i> ${project.forks_count}</p>` : ''}`;
    }



});