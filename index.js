/*
 * @Author: 龙际妙
 * @Date: 2022-01-09 22:31:02
 * @Description:
 * @FilePath: \v2\成语游戏\index.js
 * @LastEditTime: 2022-01-10 01:28:57
 * @LastEditors: Please set LastEditors
 */

/**
 * @description 立即执行函数，目的为了创造一个独立的作用域
 */
(() => {
  const idioms = ["寒来暑往", "春去秋来", "天天酷跑", "落花流水"],
    oCharCellGroup = document.querySelector(".char-cell-group"),
    oBlanks = document.querySelectorAll(".blank-cell-group .wrapper");

  let charCollection = [],
    charAreas = [],
    blankAreas = [],
    resArrs = [],
    oChars = null,
    startX = 0,
    startY = 0,
    cellX = 0,
    cellY = 0,
    mouseX = 0,
    mouseY = 0;
  // 定义初始化函数
  const init = () => {
    charCollection = formatCharsArr(idioms);
    render();
    oChars = oCharCellGroup.querySelectorAll(".cell-item .wrapper");
    getAreas(oBlanks, blankAreas);
    getAreas(oChars, charAreas);
    bindEvent();
  };
  //   定义渲染函数
  const render = () => {
    let list = "";
    charCollection.forEach((char, index) => {
      list += charCellTpl(char, index);

      oCharCellGroup.innerHTML = list;
    });
  };

  // touch事件绑定函数
  function bindEvent() {
    let oChar = null;
    for (let i = 0; i < oChars.length; i++) {
      oChar = oChars[i];

      oChar.addEventListener("touchstart", handleTouchStart, false);
      oChar.addEventListener("touchmove", handleTouchMove, false);
      oChar.addEventListener("touchend", handleTouchEnd, false);
    }
  }
  //   touch事件函数
  function handleTouchStart(e) {
    cellW = this.offsetWidth;
    cellH = this.offsetHeight;
    cellX = this.offsetLeft;
    cellY = this.offsetTop;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    mouseX = startX - cellX;
    mouseY = startY - cellY;

    this.style.width = cellW / 10 + "rem";
    this.style.height = cellH / 10 + "rem";
    this.style.position = "fixed";
    this.style.left = cellX / 10 + "rem";
    this.style.top = cellY / 10 + "rem";
  }
  function handleTouchMove(e) {
    e.preventDefault();

    const moveX = e.touches[0].clientX;
    const moveY = e.touches[0].clientY;

    cellX = moveX - mouseX;
    cellY = moveY - mouseY;
    setPosition(this, { x: cellX, y: cellY });
    // this.style.left = cellX / 10 + "rem";
    // this.style.top = cellY / 10 + "rem";
  }

  function handleTouchEnd(e) {
    const blankWidth = oBlanks[0].offsetWidth,
      blankHeight = oBlanks[0].offsetHeight;
    for (let i = 0; i < blankAreas.length; i++) {
      if (resArrs[i] !== undefined) {
        continue;
      }

      let { startX, startY } = blankAreas[i];

      if (
        (cellX > startX &&
          cellX < startX + blankWidth / 2 &&
          cellY > startY &&
          cellY < startY + blankHeight / 2) ||
        (cellX + blankWidth > startX + blankWidth / 2 &&
          cellX + blankWidth < startX + blankWidth &&
          cellY > startY &&
          cellY < startY + blankHeight / 2)
      ) {
        setPosition(this, { x: startX, y: startY });
        setResArr(this, i);
        let arr = resArrs.filter((item) => item);
        console.log("resArrs", resArrs);
        if (arr.length === 4) {
          setTimeout(() => {
            if (!checkRes()) {
              alert("错了");
            } else {
              alert("对了");
            }
            resetPosition();
          }, 1000);
        }
        return;
      }
    }
    const _index = Number(this.dataset.index),
      charArea = charAreas[_index];

    setPosition(this, { x: charArea.startX, y: charArea.startY });
    // this.style.left = charArea.startX / 10 + "rem";
    // this.style.top = charArea.startY / 10 + "rem";
  }

  //得到位置保存
  function getAreas(documentCollection, arrWrapper) {
    let startX = 0,
      startY = 0,
      oItem = null;

    for (let i = 0; i < documentCollection.length; i++) {
      oItem = documentCollection[i];
      startX = oItem.offsetLeft;
      startY = oItem.offsetTop;
      //保存最初的位置
      arrWrapper.push({
        startX,
        startY,
      });
    }
  }

  //将成语数组拆散打乱
  const formatCharsArr = () => {
    //  定义一个数组返回
    let _arr = [];

    // 拆散成语
    idioms.forEach((item) => {
      _arr = _arr.concat(item.split(""));
    });

    // 调用随机函数打乱
    return _arr.sort(randomSort);
  };

  //随机函数
  const randomSort = () => {
    return Math.random() > 0.5 ? -1 : 1;
  };

  //  渲染模板
  const charCellTpl = (char, index) => {
    return `
            <div class="cell-item">
                <div class="wrapper" data-index="${index}">${char}</div>
             </div>
           `;
  };

  //
  function setPosition(el, { x, y }) {
    el.style.left = x / 10 + "rem";
    el.style.top = y / 10 + "rem";
  }
  //
  function setResArr(el, index) {
    resArrs[index] = {
      char: el.innerText,
      el: el,
    };
  }
  function checkRes() {
    let idiom = "";

    resArrs.forEach((item) => {
      idiom += item.char;
    });

    return idioms.find((item) => item === idiom);
  }

  function resetPosition() {
    resArrs.forEach((item) => {
      const el = item.el,
        index = Number(el.dataset.index),
        { startX, startY } = charAreas[index];

      setPosition(el, { x: startX, y: startY });
    });

    resArrs = []; 
    startX = 0;
    startY = 0;
    cellX = 0;
    cellY = 0;
    mouseX = 0;
    mouseY = 0;
  }
  //最终执行初始化函数
  init();
})();
