var layer = document.querySelector('.layer');
var panoviewer = document.querySelector('.viewer');
var container = document.querySelector('.viewer .container');
var hotspots = Array.prototype.slice.call(
  document.querySelectorAll('.hotspot')
);
var currentPage = '1';

function openLayer(img) {
  layer.querySelector('img').src =
    'https://naver.github.io/egjs-view360/examples/panoviewer/etc/img/' + img;
  layer.style.display = 'block';
}
function closeLayer(e) {
  if (e.target === layer) {
    layer.style.display = 'none';
  }
}
function toRadian(deg) {
  return (deg * Math.PI) / 180;
}
function getHFov(fov) {
  var rect = container.getBoundingClientRect();
  var width = rect.width;
  var height = rect.height;
  return (
    (Math.atan((width / height) * Math.tan(toRadian(fov) / 2)) / Math.PI) * 360
  );
}
function rotate(point, deg) {
  var rad = toRadian(deg);
  var cos = Math.cos(rad);
  var sin = Math.sin(rad);

  return [cos * point[0] - sin * point[1], sin * point[0] + cos * point[1]];
}
function setHotspotOffset(hotspot, viewer) {
  var oyaw = viewer.getYaw();
  var opitch = viewer.getPitch();

  console.log(`Isi dari oyaw ${oyaw}`);
  console.log(`Isi dari opitch ${opitch}`);

  var yaw = parseFloat(hotspot.getAttribute('data-yaw'));
  var pitch = parseFloat(hotspot.getAttribute('data-pitch'));

  // console.log(`Isi dari yaw ${yaw}`);

  var deltaYaw = yaw - oyaw;
  var deltaPitch = pitch - opitch;
  // var deltaYaw = oyaw;
  // var deltaPitch = opitch;

  // console.log(`Isi dari deltaYaw ${deltaYaw}`);

  if (deltaYaw < -180) {
    deltaYaw += 360;
    // console.log(`Setalah deltaYaw += 360 ${deltaYaw}`);
  } else if (deltaYaw > 180) {
    deltaYaw -= 360;
    // console.log(`Setalah deltaYaw -= 360 ${deltaYaw}`);
  }
  if (Math.abs(deltaYaw) > 90) {
    // console.log(`Hasil absolute ${Math.abs(deltaYaw)}`);
    hotspot.style.transform = 'translate(-200px, 0px)';
    return;
  }
  var radYaw = toRadian(deltaYaw);
  var radPitch = toRadian(deltaPitch);

  // console.log(`Hasil radYaw ${radYaw}`);

  var fov = viewer.getFov();
  var hfov = getHFov(fov);

  console.log(`Hasil fov ${fov}`);
  // console.log(`Hasil hfov ${hfov}`);

  var rx = Math.tan(toRadian(hfov) / 2);
  var ry = Math.tan(toRadian(fov) / 2);

  // console.log(`Hasil rx ${rx}`);
  // console.log(`Hasil ry ${ry}`);

  var point = [Math.tan(-radYaw) / rx, Math.tan(-radPitch) / ry];

  // console.log(`Hasil point ${point}`);

  // Image rotation compensation
  // The original image is about 10 degrees tilted.
  point = point.map(function (p) {
    return p * Math.cos((15 / 180) * Math.PI);
  });
  // console.log(`Hasil point kedua ${point}`);

  point[1] = rotate(point, deltaYaw > 0 ? -10 : 10)[1];

  // console.log(`Hasil point[1] ${point[1]}`);

  // point[0] /= 1.05;
  var left = viewer._width / 2 + (point[0] * viewer._width) / 2;
  var top = viewer._height / 2 + (point[1] * viewer._height) / 2;

  // console.log(`Hasil left ${left}`);
  // console.log(`Hasil top ${top}`);

  hotspot.style.transform =
    'translate(' + left + 'px, ' + top + 'px) translate(-50%, -50%)';
}
function setHotspotOffsets(viewer) {
  hotspots
    .filter(function (hotspot) {
      return hotspot.getAttribute('data-page') === currentPage;
    })
    .forEach(function (hotspot) {
      setHotspotOffset(hotspot, viewer);
    }); // looping hotspot dan ditaruh di tempat yang sesuai yaw dan pitch
}
function load(target, page) {
  if (currentPage == page) {
    return;
  }
  var yaw = target.getAttribute('data-yaw');
  var pitch = target.getAttribute('data-pitch');

  currentPage = '' + page;

  viewer.lookAt(
    {
      yaw: yaw,
      pitch: pitch,
      fov: 30,
    },
    500
  );

  setTimeout(function () {
    panoviewer.setAttribute('data-page', currentPage);
    viewer.setImage(
      'https://naver.github.io/egjs-view360/examples/panoviewer/etc/img/bookcube' +
        page +
        '.jpg',
      {
        projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.CUBEMAP,
        cubemapConfig: {
          tileConfig: { flipHorizontal: true, rotation: 0 },
        },
      }
    );
  }, 500);
} // saat klik dan menuju ke image selanjutnya di Economy Culture
var viewer = new eg.view360.PanoViewer(container, {
  image:
    // 'https://naver.github.io/egjs-view360/examples/panoviewer/etc/img/bookcube1.jpg',
    // 'static/img/bookcube1.jpg',
    'static/public/uploads/cube.jpg',
  useZoom: false,
  projectionType: eg.view360.PanoViewer.PROJECTION_TYPE.CUBEMAP,
  cubemapConfig: {
    tileConfig: { flipHorizontal: true, rotation: 0 },
  },
})
  .on('ready', function (e) {
    viewer.lookAt({
      fov: 80,
    });

    setTimeout(function () {
      viewer.lookAt(
        {
          fov: 65,
        },
        500
      );
      setHotspotOffsets(viewer);
    });
  }) // saat refresh langsung set fov
  .on('viewChange', function (e) {
    setHotspotOffsets(viewer);
  }); // kalau dihapus maka hotspotnya ngikut saat di drag

window.addEventListener('click', function (e) {
  viewer.updateViewportDimensions();
  setHotspotOffsets(viewer);
});

PanoControls.init(panoviewer, viewer);
PanoControls.showLoading();

// // Make Collapsible
var coll = document.getElementsByClassName('collapsible');
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener('click', function () {
    this.classList.toggle('active');
    var content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  });
}
