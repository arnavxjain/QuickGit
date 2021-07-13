const input = document.querySelector("input");
const results = document.querySelector(".results");

input.addEventListener("keypress", (e) => {
    results.innerHTML = ''
    results.style.display = "none"
    if (e.keyCode == 13) {
        if (input.value !== "") {
            searchGitHub(input.value);
        }
    }
});

const searchGitHub = (term) => {
    if (!term.includes("/repos")) {
        fetch(`https://api.github.com/users/${term}`)
        .then((res) => {
            return res.json();
        }).then((data) => {
            createTemplate(data, "user");
        });
    } else {
        fetch(`https://api.github.com/users/${term}`)
        .then((res) => {
            return res.json();
        }).then((data) => {
            createTemplate(data, "repos");
        });
    }
}

const createTemplate = (data, type) => {
    if (type === "user") {
        console.log(data);
        let main = 
        `
        <div class="result">
            <img src='${data.avatar_url}'/>
            <div class="result_page_info">
                <h4>${data.name}</h4>
                <h5>${data.login}</h4>
                <h5>${data.followers} Followers</h5>
            </div>
            <a target="_blank" class="button" href='${data.html_url}'>View Profile</a>
        </div>
        `
        results.innerHTML += main
        results.style.display = "flex"
    } else {
        let repos = [];

        data.forEach((item) => {
            repos.push(item);
            console.log(item);
        });

        results.innerHTML += 
        `
        <h3 class="h3_header" align="center" style="color: #333; font-size: 14px; margin-top: 6px; margin-bottom: 6px;">${repos.length} repos by <a target="_blank" href='${repos[0].owner.html_url}'>${repos[0].owner.login}</a></h3>
        `

        for (let x = 0; x < repos.length; x++) {
            results.innerHTML += 
            `
            <div class="repo-result">
                <h4 style="color: gray;">${repos[x].name}</h4>
                <a target="_blank" class="button" href='${repos[x].html_url}'>View Repo</a>
            </div>
            `
        }
        results.style.display = "flex"
    }
}