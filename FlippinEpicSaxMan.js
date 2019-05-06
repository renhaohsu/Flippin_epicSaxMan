// copied and changed from this guy's great work
// I really appriciate the author
// http://anohito.tw/thisUnitIsAFlippinPlatelet/




if (!window.FlippinPlatelet) {
  window.FlippinPlatelet = {
    rand: function() {
      var max, min;
      switch (arguments.length) {
        case 0:
          min = 0;
          max = 1;
          break;
        case 1:
          min = 0;
          max = arguments[0];
          break;
        case 2:
          min = Math.min.apply(null, arguments);
          max = Math.max.apply(null, arguments);
      }
      return min + Math.random() * (max - min);
    },
    page_width: function() {
      return document.documentElement.clientWidth;
    },
    page_height: function() {
      return document.documentElement.clientHeight;
    },
    // 讀圖路線
    prepareFromImage: function() {
      return new Promise(function(resolve, reject) {
        var images_path, promises;
        images_path = ["https://raw.githubusercontent.com/zesterisk/Flippin_epicSaxMan/master/assets/img1.png","https://raw.githubusercontent.com/zesterisk/Flippin_epicSaxMan/master/assets/img2.png","https://raw.githubusercontent.com/zesterisk/Flippin_epicSaxMan/master/assets/img3.png","https://raw.githubusercontent.com/zesterisk/Flippin_epicSaxMan/master/assets/img4.png","https://raw.githubusercontent.com/zesterisk/Flippin_epicSaxMan/master/assets/img5.png","https://raw.githubusercontent.com/zesterisk/Flippin_epicSaxMan/master/assets/img6.png"];
        promises = images_path.map(function(x) {
          var img;
          img = document.createElement('img');
          img.src = x;
          return new Promise(function(res, rej) {
            img.onload = function() {
              return res(img);
            };
            return img.onerror = function() {
              return rej(img.src);
            };
          });
        });
        return Promise.all(promises).then(function(x) {
          FlippinPlatelet.images = x;
          return resolve();
        }).catch(function() {
          throw 'image load fail';
        });
      });
    },
    createCanvas: function(count, origin_image) {
      var body, canvas, canvases, context, d, deg, height, i, q, r, scale, width;
      body = document.getElementsByTagName('body')[0];
      width = 200;
      height = 213;
      return canvases = (function() {
        var j, ref, results;
        results = [];
        for (i = j = 0, ref = count; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
          canvas = document.createElement('canvas');
          canvas.classList.add('platelet');
          // 上初始圖
          context = canvas.getContext('2d');
          canvas.width = 200;
          canvas.height = 213;
          context.drawImage(origin_image, 0, 0);
          body.appendChild(canvas);
          // 定位 定角
          canvas.style.position = 'fixed';
          canvas.style.zIndex = 9999;
          scale = -50;
          r = FlippinPlatelet.rand(4);
          q = parseInt(r);
          d = r % 1;
          switch (q) {
            case 0:
              canvas.style.top = `${d * FlippinPlatelet.page_height() - width / 2}px`;
              canvas.style.right = `${scale}px`;
              deg = -90;
              break;
            case 1:
              canvas.style.bottom = `${scale}px`;
              canvas.style.right = `${d * FlippinPlatelet.page_width()}px`;
              deg = 0;
              break;
            case 2:
              canvas.style.bottom = `${d * FlippinPlatelet.page_height()}px`;
              canvas.style.left = `${scale}px`;
              deg = 90;
              break;
            case 3:
              canvas.style.top = `${scale}px`;
              canvas.style.left = `${d * FlippinPlatelet.page_width()}px`;
              deg = 180;
          }
          deg += (d - 0.5) * 90;
          canvas.style.transform = `rotate(${deg}deg)`;
          canvas.dataset.rand = r;
          results.push(canvas);
        }
        return results;
      })();
    },
    // 初始化
    init: function(images) {
      return new Promise(function(resolve, reject) {
        var canvases;
        // 建立一堆canvas
        canvases = FlippinPlatelet.createCanvas(24, images[0]);
        return resolve(canvases);
      });
    },
    run_once: false,
    images: null,
    bindEvent: function(canvases) {
      return canvases.forEach(function(canvas) {
        // 綁上滑鼠滑過的事件
        return canvas.addEventListener('mouseover', function() {
          if (!this.dataset.running) {
            this.dataset.frame = 0;
            return this.dataset.running = true;
          }
        });
      });
    },
    run: function() {
      if (FlippinPlatelet.run_once) {
        return FlippinPlatelet.bindEvent(FlippinPlatelet.createCanvas(24, FlippinPlatelet.images[0]));
      } else {
        return FlippinPlatelet.prepareFromImage().then(function() {
          var images;
          images = FlippinPlatelet.images;
          return FlippinPlatelet.init(images).then(function(canvases) {
            var i, img_length, step;
            img_length = images.length;
            // 綁上事件
            FlippinPlatelet.bindEvent(canvases);
            document.addEventListener('resize', function() {
              var platelets;
              platelets = Array.from(document.getElementsByClassName('platelet'));
              return platelets.forEach(function(p) {
                var d, deg, q, r;
                r = parseFloat(p.dataset.rand);
                r = FlippinPlatelet.rand(4);
                q = parseInt(r);
                d = r % 1;
                deg = (function() {
                  switch (q) {
                    case 0:
                      return -90;
                    case 1:
                      return 0;
                    case 2:
                      return 90;
                    case 3:
                      return 180;
                  }
                })();
                deg += (d - 0.5) * 90;
                return canvas.style.transform = `rotate(${deg}deg)`;
              });
            });
            // 動畫處理
            i = 0;
            step = function() {
              var platelets;
              if (i % 2) {
                platelets = Array.from(document.getElementsByClassName('platelet'));
                platelets.forEach(function(c) {
                  var context, frame;
                  if (c.dataset.running) {
                    frame = parseInt(c.dataset.frame);
                    c.dataset.frame = ++frame;
                    if (frame >= img_length * 2) {
                      return c.dataset.running = '';
                    } else {
                      context = c.getContext('2d');
                      context.clearRect(0, 0, c.width, c.height);
                      return context.drawImage(images[frame % img_length], 0, 0);
                    }
                  }
                });
              }
              i++;
              return requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            return FlippinPlatelet.run_once = true;
          }).catch(function() {
            console.log(arguments);
            return alert('init fail');
          });
        }).catch(function() {
          console.log(arguments);
          return alert('prepare fail');
        });
      }
    }
  };
}

FlippinPlatelet.run();
