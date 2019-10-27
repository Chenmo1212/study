  // 根据id获取元素
  function my$(id) {
      return document.getElementById(id);
  }

  // 设置背景图片
  function setBg(e, src) {
      var imgSrc = src;
      e.style.backgroundImage = 'url(' + imgSrc + ')';
  }

  // 定义输入框内容更改事件
  function setChange(e1, e2) {
      e1.onchange = function() {
          // 获取图片
          //   console.log(e1.files[0]);
          //   console.log(e2.id);
          var file = e1.files[0];
          // 判断输入的是否是图片，不是图片则输出提示
          // console.log(file.type);
          // 只要输出结果有image，则为图片
          // console.log(file.type.indexOf("image"));
          if (file.type.indexOf("image") >= 0) {
              // console.log("是图片");
              // 是图片之后将图片转换成base64格式预览
              var reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = function(e) {
                  var newUrl = this.result;
                  e2.style.backgroundImage = 'url(' + newUrl + ')';
                  if (e1.id === 'bg-ipt') {
                      localStorage.bgUrl = newUrl;
                  } else {
                      bgPreBig.style.backgroundImage = 'url(' + newUrl + ')';
                      bgPreSmall.style.backgroundImage = 'url(' + newUrl + ')';
                      localStorage.avatarUrl = newUrl;
                  }
              }
          } else {
              // console.log("不是图片");
              alert("您选择的不是图片，请重试！")
          }
      }
  }

  // 存储数据
  function storageData() {
      localStorage.mainContent = mainContent_textarea.value;
      localStorage.detailContent = detailContent_textarea.value;
      localStorage.nickNameB = nickNameB.value;
      localStorage.fileName = fileName.value;
      // console.log(localStorage.detailContent);
      // console.log(localStorage.mainContent);
  }

  function hidder() {
      document.getElementById('modal').style.display = "none";
      // console.log("1232131231")
  }

  // 保存图片到本地
  function savePic() {
      //   console.log(my$("canvas"));
      if (my$("canvas")) {
          my$("canvas").remove();
      }
      bottom.className = "display-none";
      loaderBox.className = "";
      html2canvas(my$("picture"), {
          allowTaint: true,
          useCORS: true,
          scale: 1.2,
      }).then(function(canvas) {
          canvas.id = "canvas";
          document.body.appendChild(canvas);
          bottom.className = "";
          loaderBox.className = "display-none";

          var canvas = document.getElementById('canvas'); //获取要达到的dom元素
          var x = canvas.offsetTop; //获取该dom元素的距离页面顶端的距离
          scrollSlowly(30, 30, x);
          showToast("图片已下载到本地", 2000);
          downLoad(saveAsPNG(canvas));
      });
  }

  // 网络图片转base64 —————— cover图使用的，目前是第六期（注意此处有跨域问题，去百度图片搜一个支持跨域的图片）
  function getBase64(imgUrl, element) {
      window.URL = window.URL || window.webkitURL;
      var xhr = new XMLHttpRequest();
      xhr.open("get", imgUrl, true);
      // 至关重要
      xhr.responseType = "blob";
      xhr.onload = function() {
          if (this.status == 200) {
              //得到一个blob对象
              var blob = this.response;
              console.log("blob", blob)
                  // 至关重要
              let oFileReader = new FileReader();
              oFileReader.onloadend = function(e) {
                  let base64 = e.target.result;
                  // console.log("方式一》》》》》》》》》", base64)
              };
              oFileReader.readAsDataURL(blob);
              let src = window.URL.createObjectURL(blob);
              element.src = src;
          }
      }
      xhr.send();
  }

  //   滚动条缓慢滚动
  function scrollSlowly(speed, msec, x) {
      //每次调用该函数，先清一遍定时器，以防出现定时器叠加情况
      clearInterval(timer);
      //产生点击事件是首先判断一下是向上还是向下滚动
      var distance = window.pageYOffset;
      //如果滚动条的位置在制定dom元素的下方，也就是需要向上滚动时：speed取负值，向上滚动，反之取正值，向上滚动
      speed = distance <= x ? speed : -speed

      var timer = setInterval(function() {
          window.scrollBy(0, speed); //每msec滚动speed的距离，可根据需求微调
      }, msec);

      //判断何时停止
      window.onscroll = function() {
          var distance1 = window.pageYOffset;
          var y = distance1 - x;
          //   console.log(y)
          //   console.log(distance1)
          if (y >= -100 && y <= 100) { //设置停止定时器的区间
              clearInterval(timer);
          }
      }
  }

  // 显示toast
  function showToast(msg, duration) {
      duration = isNaN(duration) ? 3000 : duration;
      var m = document.createElement('div');
      m.innerHTML = msg;
      m.style.cssText = "width:60%; min-width:180px; font-size:30px; background:#000; opacity:1; height: 50px; padding: 10px 0; color:#fff; line-height:50px; text-align:center; border-radius:4px; position:fixed; top:80%; left:20%; z-index:999999;";
      document.body.appendChild(m);
      setTimeout(function() {
          var d = 0.5;
          m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
          m.style.opacity = '0';
          setTimeout(function() {
              document.body.removeChild(m)
          }, d * 1000);
      }, duration);
  }

  // 隐藏div 显示textarea进行编辑
  function setMainMsg() {
      my$("mainContent-div").className = "display-none"
      my$("mainContent-textarea").className = ""
  }
  // 将textarea内容同步到div进行显示
  function saveMainMsg() {
      mainContent_div.className = ""
      mainContent_textarea.className = "display-none";
      //   console.log(mainContent_div.innerText)
      //   console.log(mainContent_textarea.value);
      mainContent_div.innerText = my$("mainContent-textarea").value;
      //   console.log(mainContent_div.innerText)
  }
  // 隐藏div 显示textarea进行编辑
  function setDetailMsg() {
      detailContent_div.className = "display-none"
      detailContent_textarea.className = ""
  }
  // 将textarea内容同步到div进行显示
  function saveDetailMsg() {
      detailContent_div.className = ""
      detailContent_textarea.className = "display-none";
      detailContent_div.innerText = detailContent_textarea.value;
  }

  // 保存成png格式的图片
  function saveAsPNG(canvas) {
      return canvas.toDataURL("image/png");
  }

  function downLoad(url) {
      var oA = document.createElement("a");
      oA.download = fileName.value; // 设置下载的文件名，默认是'下载'
      oA.href = url;
      document.body.appendChild(oA);
      oA.click();
      oA.remove(); // 下载之后把创建的元素删除
  }


  /**
   * 绑定长按事件，同时支持绑定点击事件
   * @param {dom} dom 需要绑定的dom元素
   * @param {fn} longPressCallBack 长按事件执行的方法
   * @param {fn} touchCallBack 点击事件执行的方法
   */
  var longPress = function(dom, longPressCallBack, touchCallBack) {
      var timer = undefined;
      var isLongPress = false;

      var setEvent = function(e) {
          e.addEventListener('touchstart', function(event) {
              timer = setTimeout(function() {
                  isLongPress = true
                  longPressCallBack && longPressCallBack(e);
              }, 500);
          }, false);

          e.addEventListener('touchmove', function(event) {
              clearTimeout(timer);
          }, false);

          e.addEventListener('touchend', function(event) {
              if (!isLongPress) touchCallBack && touchCallBack()
              clearTimeout(timer);
              isLongPress = false;
          }, false);
      }

      if (dom.length) {
          // 支持绑定多个元素
          for (var i = 0; i < dom.length; i++) {
              setEvent(dom[i])
          }
      } else {
          setEvent(dom);
      }
  }

  longPress(document.getElementById('longPress'), function() {
      console.log('longPress');
      localStorage.clear();
      alert("缓存清空成功");
      location.reload();
  }, function() {
      console.log('touch');
      // localStorage.clear();
      alert("长按可清空缓存");
  });

  [...document.querySelectorAll('.longPress')].forEach(function(e, i) {
      longPress(e, function() {
          console.log('longPress');
          localStorage.clear();
          location.reload();
          alert("缓存清空成功");
      }, function() {
          console.log('touch');
          //   localStorage.clear();
          alert("长按可清空缓存");
      });
  });


  // 随机背景图
  var bgSrc = 'https://source.unsplash.com/random/600x900' // 随机图片api
  var avatarSrc = 'https://source.unsplash.com/random/500x500'
      // 背景图
  var bgFile = my$("bg-ipt");
  var bgPre = my$("bg-pre");
  var cover = my$("cover");
  // 大头像
  var avatarFileBig = my$("ava-ipt-b");
  var bgPreBig = my$("avatar-pre-b");
  // 小头像
  var avatarFileSmall = my$("ava-ipt-s");
  var bgPreSmall = my$("avatar-pre-s");
  // 文本框
  var detailContent_div = my$("detailContent-div");
  var mainContent_div = my$("mainContent-div");
  var detailContent_textarea = my$("detailContent-textarea");
  var mainContent_textarea = my$("mainContent-textarea");
  var nickNameB = my$("nickName-b");
  var nickNameS = my$("nickName-s");
  // 新动态
  var clear = my$("clear");
  // 底部
  var bottom = my$("bottom");
  var fileName = my$("fileName");


  // 主内容变动
  mainContent_textarea.onchange = function() {
          //   console.log("123213");
          storageData();
      }
      // 详细内容变动
  detailContent_textarea.onchange = function() {
          storageData();
      }
      // 昵称变动
  nickNameB.onchange = function() {
      // console.log(nickNameB.value);
      nickNameS.value = nickNameB.value;
      storageData();
  }
  nickNameS.onchange = function() {
          // console.log(nickNameS.value);
          nickNameB.value = nickNameS.value;
          storageData();
      }
      // // 默认随机背景
      // setBg(bgPre, bgSrc);
      // setBg(bgPreBig, avatarSrc);
      // setBg(bgPreSmall, avatarSrc);
      // 设置背景
  setChange(bgFile, bgPre);
  // 设置头像
  setChange(avatarFileBig, bgPreBig);
  setChange(avatarFileSmall, bgPreSmall);

  //清空缓存
  // localStorage.clear();

  // 判断是否有数据
  if (localStorage.mainContent && localStorage.detailContent) {
      // 如果本地有数据
      //   console.log(localStorage.mainContent);
      //   console.log(localStorage.detailContent);
      mainContent_textarea.value = localStorage.mainContent;
      detailContent_textarea.value = localStorage.detailContent;
      mainContent_div.innerText = localStorage.mainContent;
      detailContent_div.innerText = localStorage.detailContent;
      fileName.value = localStorage.fileName;
  } else {
      // 如果本地没有数据
      mainContent_textarea.value = 'XXXX学院 \nXXXXXXX-XX XXXX \n已完成“青年大学习”网上主题团课第五季第八期的课程';
      detailContent_textarea.value = '我完成了“青年大学习”网上主题团课第五季第八期的课程，你也来试试吧';
  }
  //本地是否有背景图的数据
  if (localStorage.bgUrl) {
      // console.log(localStorage.bgUrl);
      bgPre.style.backgroundImage = 'url(' + localStorage.bgUrl + ')';
  } else {
      setBg(bgPre, bgSrc);
  }
  //本地是否有头像的数据
  if (localStorage.avatarUrl) {
      bgPreBig.style.backgroundImage = 'url(' + localStorage.avatarUrl + ')';
      bgPreSmall.style.backgroundImage = 'url(' + localStorage.avatarUrl + ')';
  } else {
      setBg(bgPreBig, avatarSrc);
      setBg(bgPreSmall, avatarSrc);
  }
  // 本地是否有网名的数据
  if (localStorage.nickNameB) {
      nickNameB.value = localStorage.nickNameB;
      nickNameS.value = localStorage.nickNameB;
  };

  //   getBase64(bgPreSmall.src, bgPreSmall);
  getBase64("https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=561772399,1254043832&fm=11&gp=0.jpg", cover);
  //   getBase64(bgPre.src, src);