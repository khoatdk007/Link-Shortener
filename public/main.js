function sendUrlError(message) {
    let elem = $("#message");
    elem.text(message);
    elem.fadeIn("slow");
    setTimeout(function () { elem.slideUp("slow"); elem.text(""); }, 2000);
}
function isValidURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + 
        '(\\?[;&a-z\\d%_.~+=-]*)?' + 
        '(\\#[-a-z\\d_]*)?$', 'i');
    return !!pattern.test(str);
}
$("#shorten-btn").click(function () {
    let fullUrl = String($("#full-url").val()).trim();
    if (!(fullUrl.startsWith("http://") || fullUrl.startsWith("https://"))) {
        fullUrl = "http://" + fullUrl;
    }
    if (fullUrl.includes(window.location.href)) {
        return sendUrlError("That is already a shorten link!");
    }
    if (!isValidURL(fullUrl)) {
        return sendUrlError("That link is not a valid url!");
    }

    $.post("/api/shorten",
        {
            url: fullUrl
        },
        function (data, status) {
            let newLink = `
                <li class="link">
                    <span class="long-link">${$("#full-url").val()}</span>
                    <span>
                        <span class="short-link"><a href="${data}" target="_blank" rel="noopener noreferrer">${data}</a></span>
                        <span class="copy-btn">Copy</span>
                    </span>
                </li>
            `;
            $("#full-url").val(data);
            let recentLinks = $("#recent-links");
            if (recentLinks.children().length === 3) recentLinks.children().last().remove();
            recentLinks.prepend(newLink);
        }
    );

});
$("#full-url").keypress(function (event) {
    const keyCode = event.keyCode || event.which;
    if (keyCode == 13) {
        $("#shorten-btn").click();
    }
});
$("#recent-links").on("click", ".copy-btn", function () {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(this).parent().children(".short-link").text()).select();
    document.execCommand("copy");
    $temp.remove();
});