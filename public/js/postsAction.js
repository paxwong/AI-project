const postFormElement = document.querySelector()

async function createItems() {
    e.preventDefault();

    const formData = new FormData(postFormElement);

    const res = await fetch("/post/formidable", {
        method: "POST",
        body: formData,
    });

    if (res.ok) {
        form.reset()
        loadPosts()

    }
}

async function init() {
    postFormElement.addEventListener("submit", createItems);
}
init();

