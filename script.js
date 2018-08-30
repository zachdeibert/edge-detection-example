"use strict";

var ctx;
var tmp;

var convolutionMatrix = [
    [ -1, -2, -1 ],
    [ -2, 12, -2 ],
    [ -1, -2, -1 ]
];
var convolutionSize = convolutionMatrix.length;
var halfConvolutionSize = (convolutionSize - 1) / 2;
var w = 640;
var h = 480;

function frame(data) {
    var image = new Image();
    image.onload = function() {
        tmp.drawImage(image, 0, 0, w, h);
        var src = tmp.getImageData(0, 0, w, h).data;
        var imgd = tmp.getImageData(0, 0, w, h);
        var pix = imgd.data;
        for (var x = 0; x < w; ++x) {
            for (var y = 0; y < h; ++y) {
                var i = 4 * (x + w * y);
                var r = 0;
                var g = 0;
                var b = 0;
                for (var dx = -halfConvolutionSize, cx = 0; dx <= halfConvolutionSize; ++dx) {
                    for (var dy = -halfConvolutionSize, cy = 0; dy <= halfConvolutionSize; ++dy) {
                        var j = 0;
                        if (y + dy >= h) {
                            j = w - 1;
                        } else if (y + dy > 0) {
                            j = y + dy;
                        }
                        j *= w;
                        if (x + dx >= w) {
                            j += w - 1;
                        } else if (x + dx > 0) {
                            j += x + dx;
                        }
                        j *= 4;
                        r += convolutionMatrix[cx][cy] * src[j];
                        g += convolutionMatrix[cx][cy] * src[j + 1];
                        b += convolutionMatrix[cx][cy] * src[j + 2];
                        ++cy;
                    }
                    ++cx;
                }
                if (r < 0) {
                    r = 0;
                } else if (r > 255) {
                    r = 255;
                }
                if (g < 0) {
                    g = 0;
                } else if (g > 255) {
                    g = 255;
                }
                if (b < 0) {
                    b = 0;
                } else if (b > 255) {
                    b = 255;
                }
                pix[i] = r;
                pix[i + 1] = g;
                pix[i + 2] = b;
            }
        }
        ctx.putImageData(imgd, 0, 0);
        Webcam.snap(frame);
    };
    image.src = data;
}

function load() {
    Webcam.attach("#camera");
    var e = document.getElementById("out");
    e.width = w;
    e.height = h;
    ctx = e.getContext("2d");
    e = document.getElementById("tmp");
    tmp = e.getContext("2d");
    e.width = w;
    e.height = h;
    Webcam.on("live", function() {
        Webcam.snap(frame);
    });
}
