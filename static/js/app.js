document.addEventListener("DOMContentLoaded", () => {
    setup();
});

function setup() {
    const used = [];

    document.querySelectorAll(".selected-component, tr, .card").forEach(el => {
        const txt = el.innerText.toLowerCase();

        if (txt.includes("cpu") || txt.includes("პროცესორი")) {
            used.push("cpu");
        }

        if (txt.includes("gpu") || txt.includes("ვიდეობარათი")) {
            used.push("gpu");
        }
    });

    document.querySelectorAll("form, a").forEach(el => {
        const txt = el.innerText.toLowerCase();
        const btn = el.querySelector("button") || el;

        if (!btn || txt.includes("წაშლა")) return;

        if (
            used.includes("cpu") &&
            (txt.includes("cpu") || txt.includes("პროცესორი")) &&
            (txt.includes("დამატება") || txt.includes("არჩევა"))
        ) {
            btn.disabled = true;
            btn.style.opacity = "0.5";
        }

        if (
            used.includes("gpu") &&
            (txt.includes("gpu") || txt.includes("ვიდეობარათი")) &&
            (txt.includes("დამატება") || txt.includes("არჩევა"))
        ) {
            btn.disabled = true;
            btn.style.opacity = "0.5";
        }
    });

    document.querySelectorAll("form").forEach(form => {
        form.addEventListener("submit", e => {
            e.preventDefault();

            fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: {
                    "X-Requested-With": "XMLHttpRequest"
                }
            }).then(updatePage);
        });
    });

    document.querySelectorAll("a").forEach(link => {
        const href = link.href;

        if (
            href.includes("add") ||
            href.includes("delete") ||
            href.includes("remove") ||
            href.includes("select")
        ) {
            link.addEventListener("click", e => {
                e.preventDefault();

                fetch(href, {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest"
                    }
                }).then(updatePage);
            });
        }
    });
}

function updatePage() {
    fetch(location.href)
        .then(r => r.text())
        .then(html => {
            const doc = new DOMParser().parseFromString(html, "text/html");

            document.body.innerHTML = doc.body.innerHTML;

            setup();

            document.querySelectorAll(".card, tr").forEach(el => {
                el.classList.add("fade-in-element");
            });
        });
}