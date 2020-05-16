// 默认设置

var DefaultMainContent = "XXXX学院 \nXXXXXXX-XX XXXX \n已完成“青年大学习”网上主题团课第八季第八期的课程";
var DefaultDetailContent = "满分！我完成了“青年大学习”网上主题团课第八季第八期的课程，你也来试试吧";

// 随机背景图
//   var bgSrc = 'https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture' // 随机图片api
// var bgSrc = 'https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture' // 必应图片
var bgSrc = 'https://api.ixiaowai.cn/gqapi/gqapi.php' //
// var bgSrc = 'http://lorempixel.com/1600/900' // 随机图片api
// var avatarSrc = 'https://source.unsplash.com/random/500x500'
// var avatarSrc = 'https://api.dujin.org/pic/' // 二次元
// var avatarSrc = 'https://acg.toubiec.cn/random' // 二次元
var avatarSrc = 'https://api.ixiaowai.cn/api/api.php' // 二次元



//   函数开始

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
    console.log(e1.files[0]);
    console.log(e2.id);
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
  localStorage.mainContent = mainContent.value;
  localStorage.detailContent = detailContent.value;
  localStorage.nickNameB = nickNameB.value;
  // console.log(localStorage.detailContent);
  // console.log(localStorage.mainContent);
}

// 隐藏模式框
function hidder() {
  my$('modal').style.display = "none";
  my$('tip_modal').style.display = "none";
  my$('pic_modal').style.display = "none";

  var parent = my$('pic_content');
  console.log(parent);
  if(parent.children.length) parent.removeChild(parent.children[0]);
}

function showPicModal() {
  my$('tip_modal').style.display = "";
}

function takeScreenshot() {
  my$('tip_modal').style.display = "none";
  html2canvas(my$("container")).then(function(canvas) {
    dpi: window.devicePixelRatio * 2,
    // document.body.appendChild(canvas);
    // Canvas2Image.saveAsJPEG(canvas, canvas.width, canvas.height)
    Canvas2Image.convertToImage(canvas, canvas.width, canvas.height)
  });
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
    setEvent(dom)
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

// 背景图
var bgFile = my$("bg-ipt");
var bgPre = my$("bg-pre");
// 大头像
var avatarFileBig = my$("ava-ipt-b");
var bgPreBig = my$("avatar-pre-b");
// 小头像
var avatarFileSmall = my$("ava-ipt-s");
var bgPreSmall = my$("avatar-pre-s");
// 文本框
var mainContent = my$("mainContent");
var detailContent = my$("detailContent");
var nickNameB = my$("nickName-b");
var nickNameS = my$("nickName-s");
// 新动态
var clear = my$("clear");

// 主内容变动
mainContent.onchange = function() {
  var chapter1 = mainContent.value.match(/团课(\S*)的课程/)[1];
  var chapter2 = detailContent.value.match(/团课(\S*)的课程/)[1];

  console.log(chapter1 != chapter2);
  if (chapter1 != chapter2) {
    detailContent.value = detailContent.value.replace(chapter2, chapter1);
  }
  console.log(detailContent.value);
  storageData();
}
// 详细内容变动
detailContent.onchange = function() {
  var chapter1 = mainContent.value.match(/团课(\S*)的课程/)[1];
  var chapter2 = detailContent.value.match(/团课(\S*)的课程/)[1];

  if (chapter1 != chapter2) {
    mainContent.value.replace(chapter1, chapter2);
  }
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
  // console.log(localStorage.mainContent);
  // console.log(localStorage.detailContent);
  mainContent.value = localStorage.mainContent;
  detailContent.value = localStorage.detailContent;
} else {
  // 如果本地没有数据
  mainContent.value = DefaultMainContent;
  detailContent.value = DefaultDetailContent;
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
}
