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


    var service = new GitHubService("microsoft");
    var projects = document.querySelectorAll("#projects");

    setTimeout(function(){ setup }, 3000);

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
        var projects = responseJson.map(project => `<div class="github-item"><i class="fab fa-github"></i> <a href='${project.html_url}'>${project.name}</a><p>${project.description}</p><div class="github-item-metadata" >${getStars(project)} ${getBranches(project)} Last Updated ${TimeAgo(Date.now() - new Date(project.updated_at))}</div></div>`);
        return projects;
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