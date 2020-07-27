var $layer = $('.layer');

function appendText() {
  var yawData = document.getElementById('yaw1').value;
  var pitchData = document.getElementById('pitch1').value;
  var txt1 =
    '<button id="cl" class="hotspot collapsible" data-page="1" data-anchor-index="0" data-yaw="' +
    yawData +
    '" data-pitch="' +
    pitchData +
    '">Open</button> <div class="hotspot content" data-page="1" data-anchor-index="0" data-yaw="' +
    yawData +
    '" data-pitch="' +
    (pitchData - 10) +
    '"><p>Coba</p></div>' +
    ' <script src="index.js"></script>';
  $layer.after(txt1);
  eval($(this).find('script').text());

  localStorage.setItem('item1', txt1);
}

function appendImage() {
  var yawData = document.getElementById('yaw2').value;
  var pitchData = document.getElementById('pitch2').value;
  var txt2 =
    '<img class="hotspot append-img" src="https://picsum.photos/200/300" alt="" data-page="1" data-anchor-index="0" data-yaw="' +
    yawData +
    '" data-pitch="' +
    pitchData +
    '">' +
    ' <script src="index.js"></script>';
  $layer.after(txt2);
  eval($(this).find('script').text());

  localStorage.setItem('item2', txt2);
}

function appendVideo() {
  var yawData = document.getElementById('yaw3').value;
  var pitchData = document.getElementById('pitch3').value;
  var txt3 =
    '<div class="hotspot" data-page="1" data-anchor-index="0" data-yaw="' +
    yawData +
    '" data-pitch="' +
    pitchData +
    '">' +
    '<iframe width="180" height="150" src="https://www.youtube.com/embed/tgbNymZ7vqY">' +
    '</iframe>' +
    '</div>' +
    ' <script src="index.js"></script>';
  $layer.after(txt3);
  eval($(this).find('script').text());
  localStorage.setItem('item3', txt3);
}

function save() {
  var x1 = document.getElementById('myDIV1');
  x1.style.display = 'none';
  var x2 = document.getElementById('myDIV2');
  x2.style.display = 'none';
  var x3 = document.getElementById('myDIV3');
  x3.style.display = 'none';
  var x4 = document.getElementById('myDIV4');
  x4.style.display = 'none';

  location.href = '/demo360';
}

$(document).ready(function () {
  $layer.after(localStorage.getItem('item1'));
  $layer.after(localStorage.getItem('item2'));
  $layer.after(localStorage.getItem('item3'));
});
