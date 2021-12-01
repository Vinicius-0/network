document.addEventListener("DOMContentLoaded", function () {
  // set pages
  document
    .querySelector("#allPosts-button")
    .addEventListener("click", () => load_page("allPosts"));
  document
    .querySelector("#following-button")
    .addEventListener("click", () => load_page("following"));

  document
    .querySelector("#submit-post")
    .addEventListener("submit", () => newPost());
  load_page("allPosts");
});

function load_page(page) {
  if (page === "allPosts") {
    document.querySelector("#all-posts").style.display = "block";
    document.querySelector("#following-posts").style.display = "none";
  } else {
    document.querySelector("#all-posts").style.display = "none";
    document.querySelector("#following-posts").style.display = "block";
  }
  fetch(`/load/${page}`)
    .then((response) => response.json())
    .then((response) => {
      response.posts.forEach((element) => {
        showPosts(element);
      });
    });
}

function handleLike() {
  const actualClass = document.querySelector("#like").className;
  if (actualClass == "fa fa-heart-o") {
    document.querySelector("#like").className = "fa fa-heart";
  } else {
    document.querySelector("#like").className = "fa fa-heart-o";
  }
}

function showPosts(post, mailbox) {
  // create post div
  const postItem = document.createElement("div");
  postItem.className = "card";
  postItem.id = "post";

  // post body
  const postBody = document.createElement("div");
  postBody.className = "card-body";

  // post title
  const a = document.createElement("a");
  a.href = "";
  const title = document.createElement("h5");
  title.className = "card-title";
  title.innerHTML = post.creator;
  a.appendChild(title);
  postBody.appendChild(a);

  // post content
  const content = document.createElement("p");
  content.className = "card-text";
  content.innerHTML = post.content;
  postBody.appendChild(content);

  // post icon
  const icon = document.createElement("i");
  icon.className = "fa fa-heart-o";
  icon.id = "like";
  postBody.appendChild(icon);
  icon.addEventListener("click", function () {
    handleLike("post");
    event.stopPropagation();
  });

  // post timestamp
  const timestamp = document.createElement("p");
  timestamp.className = "card-text";
  const small = document.createElement("small");
  small.className = "text-muted";
  small.innerHTML = post.timestamp;
  timestamp.appendChild(small);
  postBody.appendChild(timestamp);

  // if (post.read === false) {
  //   postItem.style.backgroundColor = "#fff";
  // } else {
  //   postItem.style.backgroundColor = "#ddd";
  // }

  // if (mailbox != "sent") {
  //   // create archive button
  //   const postButton = document.createElement("img");
  //   postButton.id = "archive-button";
  //   postButton.style.width = "30px";
  //   postButton.title = "Archive";
  //   postButton.src = "static/mail/archive_icon_128534.png";
  //   postItem.append(postButton);

  //   postButton.addEventListener("click", function () {
  //     changeArchived(post);
  //     event.stopPropagation();
  //   });
  // }

  postItem.appendChild(postBody);
  document.querySelector("#posts").append(postItem);
}

function newPost() {
  fetch("/newPost", {
    method: "POST",
    body: JSON.stringify({
      content: document.getElementById("compose-content").value,
    }),
  })
    .then((response) => response.json())
    .then(() => load_page("allPosts"))
    .catch((error) => {
      console.log("Error:", error);
    });
  return false;
}
