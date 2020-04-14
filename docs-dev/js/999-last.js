function holdToFinishAProcess(title = null, description = null) {
    if (title)
        document.getElementById("waitForProcessToFinish").style.display =
        "block";
    else
        document.getElementById("waitForProcessToFinish").style.display =
        "none";
    if (title) document.getElementById("DOMWaitingHead").innerText = title;
    if (description)
        document.getElementById("DOMWaitingDesc").innerText = description;
}
holdToFinishAProcess(false);


