document.addEventListener("DOMContentLoaded", function () {
  // set pages
  document
    .querySelector("#allPosts-button")
    .addEventListener("click", () => load_page("allPosts"));
  document
    .querySelector("#following-button")
    .addEventListener("click", () => load_page("following"));
  load_page("allPosts");

  // handle like
  document.querySelector("#like").addEventListener("click", () => handleLike());
});

function load_page(page) {
  if (page === "allPosts") {
    document.querySelector("#all-posts").style.display = "block";
    document.querySelector("#following-posts").style.display = "none";
  } else {
    document.querySelector("#all-posts").style.display = "none";
    document.querySelector("#following-posts").style.display = "block";
  }
}

function handleLike() {
  const actualStyle = document.querySelector("#like").className;
  if (actualStyle == "fa fa-heart-o") {
    document.querySelector("#like").className = "fa fa-heart";
  } else {
    document.querySelector("#like").className = "fa fa-heart-o";
  }
}
