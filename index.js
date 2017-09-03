(function () {
    // CONSTANST
        const unsplashApi = '' // Verify code from unsplash developer account
        const unsplashRoot = 'https://api.unsplash.com'
        const nytApi = '' // Verify code from New york times developer account
        const nytRoot = 'http://api.nytimes.com'
    // END CONSTANTS

    const form = document.querySelector('#search')
    const searchField = document.querySelector('#search-keyword')
    let searchedForText
    const responseContainer = document.querySelector('#site-container')

    form.addEventListener('submit', function (e) {
        e.preventDefault()
        responseContainer.innerHTML = ''
        searchedForText = searchField.value
        getImage(searchedForText)
        getArticle()
    })


    // Image unsplash api
    const getImage = (searchedForText) => {
        const apiId = unsplashApi
        const root = unsplashRoot // here is the root route to unsplash
        const unsplashRequest = new XMLHttpRequest()

        unsplashRequest.open('get', `${root}/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.onload = addImage
        unsplashRequest.setRequestHeader('Authorization', `Client-ID ${apiId}`)

        unsplashRequest.send()
    }

    function addImage (){
        let htmlContent = ''
        const data = JSON.parse(this.responseText)
        if (data && data.total > 0) {
            const firstImage = data.results[0]
            htmlContent = `<figure>
            <img src="${firstImage.urls.regular}" alt="$searchedForText">
                <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`
            responseContainer.insertAdjacentHTML('afterbegin', htmlContent)
        } else if (!data) {
            responseContainer.insertAdjacentHTML('afterbegin', 'Error')
        } else {
            responseContainer.insertAdjacentHTML('afterbegin', 'No data')
        }

    }

    // Articles New york Times
    function addArticles () {
        let htmlContent = ''
        const data = JSON.parse(this.responseText)
        if (data && data.status === 'OK' && data.response.docs.length > 0) {
            const articles = data.response.docs
            let articlesHtml = articles.map((article) =>
                `<article class="article">
                    <h1><a class="title" href="${article.web_url}">${article.headline.main}</a></h1>
                    <div>${article.snippet}</div>
                </article>`)
            htmlContent = `
                <section class="section">
                    ${articlesHtml.join('')}
                </section>
            `
            responseContainer.insertAdjacentHTML('beforeend', htmlContent)
        } else if (!data) {
            responseContainer.insertAdjacentHTML('beforeend', 'Error')
        } else if (data.response.docs.length === 0) {
            responseContainer.insertAdjacentHTML('beforeend', 'No data')
        } else {
            responseContainer.insertAdjacentHTML('beforeend', 'No controlled')
        }

    }

    const getArticle = () => {
        const apiId = nytApi
        const root = nytRoot
        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.open('GET', `${root}/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${apiId}`);
        articleRequest.send();
    }
})()
