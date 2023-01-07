const hrefParams = window.location.search;
const searchParams = new URLSearchParams(hrefParams);
let postParam = Number(searchParams.get('id'));
const postCount = (postParam == 0) ? 1 : postParam;
const listComments = document.querySelector('.comments');

async function addComment({name, email, body}) {
    let item = document.createElement('li');
    item.classList.add('comments__item');
    item.innerHTML = `<div class="comments__name">${name}</div>
                      <div class="comments__email">${email}</div>
                      <p class="comments__text">${body}</div>`;
    return Promise.resolve(item);
}

async function addArticle(numberPost) {
    const responsePost = await fetch(`https://gorest.co.in/public/v2/posts/${numberPost}`);
    const post = await responsePost.json();
    const title = document.querySelector('.title');
    const description = document.querySelector('.description');
    const descrPage = document.querySelector('meta[name="description"]');
    let titlePost = post.title;
    document.title = titlePost;
    descrPage.setAttribute('content', titlePost);
    title.textContent = titlePost;
    description.textContent = post.body;
    
    const responseComments = await fetch(`https://gorest.co.in/public/v2/posts/${numberPost}/comments`);
    const comments = await responseComments.json();
    if(comments.length > 0) {
        comments.forEach(async (comment) => {
            const name = comment.name;
            const email = comment.email;
            const body = comment.body;
            const handler = {
                name,
                email,
                body
            }
            const commentUser = await addComment(handler);
            listComments.appendChild(commentUser);
        });
    }
    
}

addArticle(postCount);

