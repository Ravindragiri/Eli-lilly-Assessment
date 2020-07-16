var max_height = 400;
var canvas;
var context;
var image;

var prefsize;

$(function () {

    $("#file").change(function () {
        loadImage(this);
    });

    bindGetPosition();
});

var pointSize = 3;

function bindGetPosition() {
    $("#canvas").click(function (e) {
        getPosition(e);
    });
}

function getPosition(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    drawCoordinates(x, y);
}

function drawCoordinates(x, y) {
    var ctx = document.getElementById("canvas").getContext("2d");


    ctx.fillStyle = "#ff2626"; // Red color

    ctx.beginPath();
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
    ctx.fill();
}

function addCoordinatesToTable(x, y) {

}

/* Mime Types Starts */
function getBLOBFileHeader(url, blob, callback) {
    var fileReader = new FileReader();
    fileReader.onloadend = function (e) {
        var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
        var header = "";
        for (var i = 0; i < arr.length; i++) {
            header += arr[i].toString(16);
        }
        callback(url, header);
    };
    fileReader.readAsArrayBuffer(blob);
}

function headerCallback(url, headerString) {
    printHeaderInfo(url, headerString);
}

function remoteCallback(url, blob) {
    printImage(blob);
    getBLOBFileHeader(url, blob, headerCallback);
}

function printImage(blob) {
    // Add this image to the document body for proof of GET success
    var fr = new FileReader();
    fr.onloadend = function () {
        $("hr")//.after($("<img>").attr("src", fr.result))
            .after($("<div>").text("Blob MIME type: " + blob.type));
    };
    fr.readAsDataURL(blob);
}

// Add more from http://en.wikipedia.org/wiki/List_of_file_signatures
function mimeType(headerString) {
    switch (headerString) {
        case "89504e47":
            type = "image/png";
            break;
        case "47494638":
            type = "image/gif";
            break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
            type = "image/jpeg";
            break;
        default:
            type = "unknown";
            break;
    }
    return type;
}

function printHeaderInfo(url, headerString) {
    $("hr").after($("<div>").text("Real MIME type: " + mimeType(headerString)))
        .after($("<div>").text("File header: 0x" + headerString))
        .after($("<div>").text(url));
}

/* Mime Types Ends */
/////////////////////

function loadImage(input) {

    if (input.files && input.files[0]) {
        if (input.files[0].size >= 2 * 1024 * 1024) {
            alert("File size must be at most 2MB");
            return;
        }

        remoteCallback(escape(input.files[0].name), input.files[0]);

        var reader = new FileReader();
        canvas = null;
        reader.onload = function (e) {
            image = new Image();
            image.onload = validateImage;
            image.src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function dataURLtoBlob(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = decodeURIComponent(parts[1]);

        return new Blob([raw], {
            type: contentType
        });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);
    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {
        type: contentType
    });
}

function validateImage() {
    if (canvas != null) {
        image = new Image();
        image.onload = restartCanvas;
        image.src = canvas.toDataURL('image/png');
    } else {
        restartCanvas();
        bindGetPosition();
    }
}

function restartCanvas() {
    $("#views").empty();
    $("#views").append("<canvas id=\"canvas\">");
    canvas = $("#canvas")[0];
    context = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);
    clearcanvas();
}

function clearcanvas() {
    prefsize = {
        x: 0,
        y: 0,
        w: canvas.width,
        h: canvas.height,
    };
}

function selectcanvas(coords) {
    prefsize = {
        x: Math.round(coords.x),
        y: Math.round(coords.y),
        w: Math.round(coords.w),
        h: Math.round(coords.h)
    };
}




