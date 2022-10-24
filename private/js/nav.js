function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "flex";
    evt.currentTarget.className += " active";
}

document.getElementById("defaultOpen").click();


function clearCreateTab() {
document.querySelector(".edit-main-container").innerHTML = 
`<div class="edit-preview-panel">
<div class="panel-gradient-border-bg">
    <div class="preview-panel">
        <img class="output-image">
        <div class="ring-container">
            <div class="lds-ring-switch">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    </div>
</div>
</div>
<div class="edit-setting-panel">
<div class="edit-setting-container">
    <div class="preview-title">Preview Setting</div>
    <form class="create-form">
        <div id="upload-picture-container">
            <input onchange="loadFile(event)" type="file" id="upload-picture-btn" name="image"
                multiple required />
            <label id="upload-picture-label" for="upload-picture-btn">Choose file</label>
        </div>
        <div id="upload-caption-container">
            <label id="upload-caption-label" class="name" for="text">Caption:</label>
            <textarea required id="upload-caption-box" type="text" name="caption" minlength=""
                maxlength="100" class="form-control" placeholder="Caption"></textarea>
            <button type="submit" class="btn btn-b submit">Submit</button>
        </div>
    </form>
    <div id="edit-setting-message"></div>
</div>
</div>`
}