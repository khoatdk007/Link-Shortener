function sendUrlError(message) {
    let elem = $("#message");
    elem.text(message);
    elem.fadeIn("slow");
    setTimeout(function () { elem.slideUp("slow"); elem.text(""); }, 2000);
}
$("#shorten-btn").click(function () {
    let fullUrl = String($("#full-url").val());
    if (!(fullUrl.startsWith("http://") || fullUrl.startsWith("https://"))) {
        fullUrl = "http://" + fullUrl;
    }
    const urlHostname = fullUrl.slice(fullUrl.indexOf("//") + 2, fullUrl.indexOf("/", fullUrl.indexOf("//") + 2));
    if (!urlHostname.includes(".")) {
        return sendUrlError("That link is not a valid url!");
    }
    if (urlHostname === window.location.hostname) {
        return sendUrlError("That is already a shorten link!");
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
                        <span class="short-link"><a href="${data}">${data}</a></span>
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
$("#full-url").keypress(function(event) {
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