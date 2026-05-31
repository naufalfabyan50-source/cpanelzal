// assets/js/ui.js

/*
========================================
TOAST
========================================
*/

function showToast(
    message,
    type = "success"
) {

    const container =
        document.getElementById(
            "toast-container"
        );

    if (!container) return;

    const toast =
        document.createElement(
            "div"
        );

    toast.className =
        `toast ${type}`;

    toast.textContent =
        message;

    container.appendChild(
        toast
    );

    setTimeout(() => {

        toast.style.opacity = "0";

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 3000);

}

function toastSuccess(
    message
) {

    showToast(
        `✅ ${message}`,
        "success"
    );

}

function toastError(
    message
) {

    showToast(
        `❌ ${message}`,
        "error"
    );

}

function toastWarning(
    message
) {

    showToast(
        `⚠️ ${message}`,
        "warning"
    );

}

/*
========================================
LOADING
========================================
*/

function showLoading(
    text = "Loading..."
) {

    let loading =
        document.getElementById(
            "global-loading"
        );

    if (!loading) {

        loading =
            document.createElement(
                "div"
            );

        loading.id =
            "global-loading";

        loading.innerHTML = `

        <div class="global-loading-box">

            <div class="loader"></div>

            <h3 id="global-loading-text">
                ${text}
            </h3>

        </div>

        `;

        document.body.appendChild(
            loading
        );

    }

    document.getElementById(
        "global-loading-text"
    ).textContent = text;

    loading.style.display =
        "flex";

}

function hideLoading() {

    const loading =
        document.getElementById(
            "global-loading"
        );

    if (loading) {

        loading.style.display =
            "none";

    }

}

/*
========================================
COPY CLIPBOARD
========================================
*/

async function copyToClipboard(
    text
) {

    try {

        await navigator.clipboard.writeText(
            text
        );

        toastSuccess(
            "Data berhasil disalin"
        );

        return true;

    }

    catch (error) {

        console.error(
            error
        );

        toastError(
            "Gagal menyalin data"
        );

        return false;

    }

}

/*
========================================
CONFIRM DELETE
========================================
*/

function confirmDelete(
    message =
    "Yakin ingin menghapus data?"
) {

    return confirm(
        message
    );

}

/*
========================================
MODAL
========================================
*/

function showModal(
    title,
    content
) {

    let modal =
        document.getElementById(
            "global-modal"
        );

    if (!modal) {

        modal =
            document.createElement(
                "div"
            );

        modal.id =
            "global-modal";

        modal.innerHTML = `

        <div class="modal-box">

            <div class="modal-header">

                <h2 id="modal-title"></h2>

                <button
                id="modal-close">

                    ✕

                </button>

            </div>

            <div
            id="modal-content">

            </div>

        </div>

        `;

        document.body.appendChild(
            modal
        );

    }

    document.getElementById(
        "modal-title"
    ).textContent = title;

    document.getElementById(
        "modal-content"
    ).innerHTML = content;

    modal.style.display =
        "flex";

    document.getElementById(
        "modal-close"
    ).onclick = () => {

        hideModal();

    };

}

function hideModal() {

    const modal =
        document.getElementById(
            "global-modal"
        );

    if (modal) {

        modal.style.display =
            "none";

    }

}

/*
========================================
FORMAT DATE
========================================
*/

function formatDate(
    date
) {

    return new Date(
        date
    ).toLocaleString(
        "id-ID"
    );

}

/*
========================================
GENERATE ID
========================================
*/

function generateID() {

    return (
        Date.now() +
        Math.floor(
            Math.random() * 9999
        )
    );

}

/*
========================================
ESCAPE HTML
========================================
*/

function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );

    div.innerText =
        text;

    return div.innerHTML;

}