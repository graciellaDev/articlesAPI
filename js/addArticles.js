const container = document.querySelector('.container');
const listArticles = document.querySelector('.articles');
const contPostsPerPage = 6 ;
const hrefParams = window.location.search;
const searchParams = new URLSearchParams(hrefParams);
let pageParam = Number(searchParams.get('page'));
const pageCount = (pageParam == 0) ? 1 : pageParam;

async function createItem({ id, title }) {
    const responseComments = await fetch(`https://gorest.co.in/public/v2/posts/${id}/comments`);
    const comments = await responseComments.json();
    const rewievs = comments.length;
    let content = `<a class="articles__link" href="article.html?id=${id}"><div class="articles__rewievs-count">${rewievs}</div>`;
    if(rewievs > 0) {
        const user = comments[rewievs - 1].name;
        content += `<div class="articles__rewievs-last-user">Ultimum user: ${user}</div>`;
    }
    const item = document.createElement('li');
    item.classList.add('articles__item');
    content += `<div class="articles__title">${title}</div></a>`;
    item.innerHTML = content;
    return item;
}

function createPaginationContainer() {
    const wrap = document.createElement('div');
    wrap.classList.add('articles__nav');
    wrap.classList.add('pagination');
    return wrap;
}

function createPagination(number) {
    const element = document.createElement('span');
    const location = window.location.href;
    console.log(location);
    const url = location.split('?')[0];
    element.classList.add('pagination__dot');
    element.innerHTML = `<a class="pagination__link" href ="${url}?page=${number}">${number}</a>`;
    return element;
}

async function createItems(objectJson, activePage, countItems) {
    Object.keys(objectJson).forEach(async (key) => {
        if(key >= activePage - 1 && key < activePage + countItems - 1) {
            const title = objectJson[key]['title'];
            const id = objectJson[key]['id'];
            handler = {
                id,
                title
            }
            const item = await createItem(handler);
            listArticles.appendChild(item);
        } 
    });
    return true;
}

async function addArticles(numberPage) {
    const responsePosts = await fetch('https://gorest.co.in/public/v2/posts');
    const posts = await responsePosts.json();
    let navigation = createPaginationContainer();
    const countPosts = posts.length;

    ( countPosts > contPostsPerPage ) ? container.appendChild(navigation) : '';
    // console.log('page=' + numberPage);
    const activeNumberPage = (numberPage == 0 || numberPage == 1) ? 1 : (numberPage - 1) * contPostsPerPage;
    Object.keys(posts).forEach(async (key) => {
        if(key >= activeNumberPage - 1 && key < activeNumberPage + contPostsPerPage - 1) {
            const title = posts[key]['title'];
            const id = posts[key]['id'];
            handler = {
                id,
                title
            }
            const item = await createItem(handler);
            listArticles.appendChild(item);
        } 
    });
    for(let i = 0; i <= Math.trunc(countPosts / contPostsPerPage); i++) {
        console.log(numberPage);
        if(i == numberPage - 1) {
            let activeDot = createPagination(i + 1);
            activeDot.querySelector('.pagination__link').classList.add('pagination__link_active');
            navigation.appendChild(activeDot);
        } else {
            navigation.appendChild(createPagination(i + 1));
        }
    }
}

addArticles(pageCount);
