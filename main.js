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
        fetch(`https://api.github.com/search/users?q=${term}`)
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
        console.log(data)
        for (let x = 0; x < data.items.length; x++) {

            if (x === 9) break;

            fetch(`https://api.github.com/users/${data.items[x].login}`)
            .then((res) => {
                return res.json();
            }).then((dataMain) => {
                if (dataMain?.message == "API rate limit exceeded for 43.224.1.195. (But here's the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)") {
                    results.innerHTML =
                    `
                    <h5 style="color: gray; margin: 10px;" align="center">There was a problem loading the results. Try again in 60 minutes. Sorry for the inconvenience.</h5>
                    `
                    return false;
                }
                if (dataMain.login !== null || dataMain.login !== undefined && dataMain.name !== null || dataMain.name !== undefined && dataMain.followers !== null || dataMain.followers !== undefined && dataMain.html_url !== null || dataMain.html_url !== undefined) {
                    results.innerHTML +=
                `
                    <div class="result">
                        <img src='${dataMain.avatar_url}'/>
                        <div class="result_page_info">
                            <h4>${dataMain.name}</h4>
                            <h5>${dataMain.login}</h4>
                            <h5>${dataMain.followers} Followers</h5>
                        </div>
                        <a target="_blank" class="button" href='${dataMain.html_url}'>View Profile</a>
                    </div>
                `;
                }
            });
        }

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