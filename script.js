const APIURL = 'https://api.github.com/users/'

const form = document.querySelector('.form')
const search = document.querySelector('.search')
const main = document.querySelector('.main')
const clear = document.querySelector('.clear')
let error = 0

//Clear the search input value when clicked
clear.addEventListener('click', ()=>{
    search.value =''
})

//Get user data from Github
async function getUser(username){
    try{
        const {data} = await axios.get(APIURL + username) //Destructuring the response object
        createUserCard(data)
        getRepos(username)
    }
    catch(err){
        if(err.response.status == 404){
            createErrorCard('Error! No user found with the username:')
            error = 1
        }
    } 
}

//Get Repos from user
async function getRepos(username){
    try{
        const {data} = await axios.get(APIURL + username + '/repos?sort=created') //Destructuring the response object
        
        addReposToCard(data)
        
    }
    catch(err){    
        createErrorCard('Problem fetching repos from ')
        error = 1   
    }  
}

//Add the repo links to the card element
function addReposToCard(repos) {
    const reposParent = document.querySelector('.repos')
    repos.slice(0,10).forEach(repo =>{
        const repoEl = document.createElement('a')
        
        repoEl.classList.add('repo')
        repoEl.href = repo.html_url
        repoEl.innerText = repo.name
        repoEl.target = '_blank'
        reposParent.appendChild(repoEl)
    })
}

// Create card with error info when there's an error
function createErrorCard(msg){
    const cardHtml = ` 
    <div class="errorCard"> <h3>${msg}</h3><h2>${search.value}</h2> </div>
    `
    main.innerHTML = cardHtml
    search.value = ''
}

//Create card with user information
function createUserCard(user){
    const cardHtml = `
    <div class="card">
            <div>
                <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
            </div>
                <div class="user-info">
                    <h2>${user.name}</h2>
                    <p>${user.bio}</p>
                    <ul>
                        <li>${user.followers} <strong>Followers</strong></li>
                        <li>${user.following} <strong>Following</strong></li>
                        <li>${user.public_repos} <strong>Repos</strong></li>
                    </ul>

                    <div class="repos"></div>
                </div>
            
        </div>
    `
    main.innerHTML = cardHtml
}

//Get input value from form when it is submitted
form.addEventListener('submit', (e) =>{
    e.preventDefault()
    const user = search.value 
    
    getUser(user)   
})