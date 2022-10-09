const postFormElement = document.querySelector()

async function createItems(e) {
    e.preventDefault();

    const formData = new FormData(postFormElement);

    const res = await fetch("", {
        method: "POST",
        body: formData,
    });

    if (res.ok) {

    }
}

async function init() {
    postFormElement.addEventListener("submit", createItems);
}
init();