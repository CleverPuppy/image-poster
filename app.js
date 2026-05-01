// 全局状态
var canvas;
var ctx;
var backgroundImage = null;
var elements = [];
var selectedElement = null;
var isDragging = false;
var dragOffset = { x: 0, y: 0 };
var elementCounter = 0;
// 初始化
window.addEventListener('load', function () {
    initCanvas();
    bindEvents();
    render();
});
// 初始化画布
function initCanvas() {
    canvas = document.getElementById('posterCanvas');
    ctx = canvas.getContext('2d');
    // 设置默认画布大小
    canvas.width = 800;
    canvas.height = 600;
}
// 绑定事件
function bindEvents() {
    // 背景上传
    var uploadBgBtn = document.getElementById('uploadBgBtn');
    var bgInput = document.getElementById('bgInput');
    var clearBgBtn = document.getElementById('clearBgBtn');
    uploadBgBtn.addEventListener('click', function () {
        bgInput.click();
    });
    bgInput.addEventListener('change', handleBackgroundUpload);
    clearBgBtn.addEventListener('click', clearBackground);
    // 添加文字
    var addTextBtn = document.getElementById('addTextBtn');
    addTextBtn.addEventListener('click', addTextElement);
    // 文字控制
    bindTextControls();
    // 贴纸控制
    bindStickerControls();
    // 导出
    var exportBtn = document.getElementById('exportBtn');
    exportBtn.addEventListener('click', exportImage);
    // 画布交互
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel);
    // 键盘删除
    document.addEventListener('keydown', handleKeyDown);
}
// 处理背景上传
function handleBackgroundUpload(e) {
    var _a;
    var input = e.target;
    var file = (_a = input.files) === null || _a === void 0 ? void 0 : _a[0];
    if (!file)
        return;
    var reader = new FileReader();
    reader.onload = function (event) {
        var _a;
        var img = new Image();
        img.onload = function () {
            backgroundImage = img;
            // 限制画布最大尺寸，避免过大的图片覆盖整个窗口
            var maxWidth = 1200;
            var maxHeight = 800;
            var newWidth = img.width;
            var newHeight = img.height;
            // 如果图片超过最大尺寸，等比例缩放
            if (newWidth > maxWidth || newHeight > maxHeight) {
                var widthRatio = maxWidth / newWidth;
                var heightRatio = maxHeight / newHeight;
                var ratio = Math.min(widthRatio, heightRatio);
                newWidth = Math.floor(newWidth * ratio);
                newHeight = Math.floor(newHeight * ratio);
            }
            canvas.width = newWidth;
            canvas.height = newHeight;
            console.log('📷 背景图已加载:', {
                原始尺寸: "".concat(img.width, "x").concat(img.height),
                画布尺寸: "".concat(newWidth, "x").concat(newHeight)
            });
            render();
        };
        img.src = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
    };
    reader.readAsDataURL(file);
}
// 清除背景
function clearBackground() {
    backgroundImage = null;
    render();
}
// 添加文字元素
function addTextElement() {
    var textElement = {
        id: "text-".concat(++elementCounter),
        type: 'text',
        content: '双击编辑文字',
        x: canvas.width / 2,
        y: canvas.height / 2,
        fontSize: 60,
        fontFamily: 'Microsoft YaHei',
        color: '#000000',
        strokeColor: '#ffffff',
        strokeWidth: 3,
        rotation: 0,
        selected: false
    };
    console.log('➕ 添加文字元素:', textElement.id);
    elements.push(textElement);
    selectElement(textElement);
    render();
    showTextControls();
}
// 绑定文字控制
function bindTextControls() {
    var textContent = document.getElementById('textContent');
    var textSize = document.getElementById('textSize');
    var textColor = document.getElementById('textColor');
    var textStrokeColor = document.getElementById('textStrokeColor');
    var textStrokeWidth = document.getElementById('textStrokeWidth');
    var textRotation = document.getElementById('textRotation');
    var fontFamily = document.getElementById('fontFamily');
    var deleteTextBtn = document.getElementById('deleteTextBtn');
    // 更新显示值并立即重新渲染
    textSize.addEventListener('input', function () {
        var newSize = parseInt(textSize.value);
        var sizeDisplay = document.getElementById('textSizeValue');
        if (sizeDisplay) {
            sizeDisplay.textContent = "".concat(newSize, "px");
        }
        if ((selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.type) === 'text') {
            console.log('🎨 字体大小更新:', {
                旧大小: selectedElement.fontSize,
                新大小: newSize,
                元素ID: selectedElement.id
            });
            selectedElement.fontSize = newSize;
            render();
        }
    });
    textStrokeWidth.addEventListener('input', function () {
        var newWidth = parseInt(textStrokeWidth.value);
        var widthDisplay = document.getElementById('textStrokeWidthValue');
        if (widthDisplay) {
            widthDisplay.textContent = "".concat(newWidth, "px");
        }
        if ((selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.type) === 'text') {
            console.log('🖌️ 描边宽度更新:', {
                旧宽度: selectedElement.strokeWidth,
                新宽度: newWidth,
                元素ID: selectedElement.id
            });
            selectedElement.strokeWidth = newWidth;
            render();
        }
    });
    textRotation.addEventListener('input', function () {
        var newRotation = parseInt(textRotation.value);
        var rotationDisplay = document.getElementById('textRotationValue');
        if (rotationDisplay) {
            rotationDisplay.textContent = "".concat(newRotation, "\u00B0");
        }
        if ((selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.type) === 'text') {
            console.log('🔄 文字旋转更新:', {
                旧角度: selectedElement.rotation,
                新角度: newRotation,
                元素ID: selectedElement.id
            });
            selectedElement.rotation = newRotation;
            render();
        }
    });
    textContent.addEventListener('input', function () {
        if ((selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.type) === 'text') {
            var newContent = textContent.value;
            // 只有当内容真正改变时才更新
            if (newContent !== selectedElement.content) {
                console.log('✏️ 文字内容更新:', {
                    旧内容: selectedElement.content,
                    新内容: newContent,
                    元素ID: selectedElement.id
                });
                selectedElement.content = newContent;
                render();
            }
        }
    });
    textColor.addEventListener('input', function () {
        if ((selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.type) === 'text') {
            console.log('🎨 文字颜色更新:', {
                新颜色: textColor.value,
                元素ID: selectedElement.id
            });
            selectedElement.color = textColor.value;
            render();
        }
    });
    textStrokeColor.addEventListener('input', function () {
        if ((selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.type) === 'text') {
            console.log('🎨 描边颜色更新:', {
                新颜色: textStrokeColor.value,
                元素ID: selectedElement.id
            });
            selectedElement.strokeColor = textStrokeColor.value;
            render();
        }
    });
    fontFamily.addEventListener('change', function () {
        if ((selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.type) === 'text') {
            console.log('🔤 字体家族更新:', {
                新字体: fontFamily.value,
                元素ID: selectedElement.id
            });
            selectedElement.fontFamily = fontFamily.value;
            render();
        }
    });
    deleteTextBtn.addEventListener('click', function () {
        if ((selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.type) === 'text') {
            console.log('🗑️ 准备删除文字元素:', selectedElement.id);
            deleteElement(selectedElement);
        }
    });
}
// 绑定贴纸控制
function bindStickerControls() {
    var stickerSize = document.getElementById('stickerSize');
    var stickerRotation = document.getElementById('stickerRotation');
    var deleteStickerBtn = document.getElementById('deleteStickerBtn');
    // Emoji 点击添加
    var emojiItems = document.querySelectorAll('.emoji-item');
    emojiItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var emoji = item.dataset.emoji;
            console.log('😀 添加贴纸:', emoji);
            addStickerElement(emoji);
        });
    });
    stickerSize.addEventListener('input', function () {
        var newSize = parseInt(stickerSize.value);
        var sizeDisplay = document.getElementById('stickerSizeValue');
        if (sizeDisplay) {
            sizeDisplay.textContent = "".concat(newSize, "px");
        }
        if ((selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.type) === 'sticker') {
            console.log('📏 贴纸大小更新:', {
                旧大小: selectedElement.size,
                新大小: newSize,
                元素ID: selectedElement.id
            });
            selectedElement.size = newSize;
            render();
        }
    });
    stickerRotation.addEventListener('input', function () {
        var newRotation = parseInt(stickerRotation.value);
        var rotationDisplay = document.getElementById('stickerRotationValue');
        if (rotationDisplay) {
            rotationDisplay.textContent = "".concat(newRotation, "\u00B0");
        }
        if ((selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.type) === 'sticker') {
            console.log('🔄 贴纸旋转更新:', {
                旧角度: selectedElement.rotation,
                新角度: newRotation,
                元素ID: selectedElement.id
            });
            selectedElement.rotation = newRotation;
            render();
        }
    });
    deleteStickerBtn.addEventListener('click', function () {
        if ((selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.type) === 'sticker') {
            console.log('🗑️ 准备删除贴纸元素:', selectedElement.id);
            deleteElement(selectedElement);
        }
    });
}
// 添加贴纸元素
function addStickerElement(emoji) {
    var stickerElement = {
        id: "sticker-".concat(++elementCounter),
        type: 'sticker',
        emoji: emoji,
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 80,
        rotation: 0,
        selected: false
    };
    console.log('➕ 添加贴纸元素:', stickerElement.id, emoji);
    elements.push(stickerElement);
    selectElement(stickerElement);
    render();
    showStickerControls();
}
// 选择元素
function selectElement(element) {
    // 取消之前的选择
    elements.forEach(function (el) { return el.selected = false; });
    // 选择新元素
    element.selected = true;
    selectedElement = element;
    console.log('👆 选中元素:', element.id, element.type);
    // 更新UI
    updateControlPanel();
    render();
}
// 更新控制面板
function updateControlPanel() {
    if (!selectedElement) {
        hideAllControls();
        return;
    }
    if (selectedElement.type === 'text') {
        showTextControls();
        syncTextControls();
    }
    else if (selectedElement.type === 'sticker') {
        showStickerControls();
        syncStickerControls();
    }
}
// 同步文字控制值
function syncTextControls() {
    if ((selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.type) !== 'text')
        return;
    var textContent = document.getElementById('textContent');
    var textSize = document.getElementById('textSize');
    var textColor = document.getElementById('textColor');
    var textStrokeColor = document.getElementById('textStrokeColor');
    var textStrokeWidth = document.getElementById('textStrokeWidth');
    var textRotation = document.getElementById('textRotation');
    var fontFamily = document.getElementById('fontFamily');
    textContent.value = selectedElement.content;
    textSize.value = selectedElement.fontSize.toString();
    textColor.value = selectedElement.color;
    textStrokeColor.value = selectedElement.strokeColor;
    textStrokeWidth.value = selectedElement.strokeWidth.toString();
    textRotation.value = selectedElement.rotation.toString();
    fontFamily.value = selectedElement.fontFamily;
    document.getElementById('textSizeValue').textContent = "".concat(selectedElement.fontSize, "px");
    document.getElementById('textStrokeWidthValue').textContent = "".concat(selectedElement.strokeWidth, "px");
    document.getElementById('textRotationValue').textContent = "".concat(selectedElement.rotation, "\u00B0");
}
// 同步贴纸控制值
function syncStickerControls() {
    if ((selectedElement === null || selectedElement === void 0 ? void 0 : selectedElement.type) !== 'sticker')
        return;
    var stickerSize = document.getElementById('stickerSize');
    var stickerRotation = document.getElementById('stickerRotation');
    stickerSize.value = selectedElement.size.toString();
    stickerRotation.value = selectedElement.rotation.toString();
    document.getElementById('stickerSizeValue').textContent = "".concat(selectedElement.size, "px");
    document.getElementById('stickerRotationValue').textContent = "".concat(selectedElement.rotation, "\u00B0");
}
// 显示/隐藏控制
function showTextControls() {
    var textControls = document.getElementById('textControls');
    var stickerControls = document.getElementById('stickerControls');
    if (textControls)
        textControls.style.display = 'block';
    if (stickerControls)
        stickerControls.style.display = 'none';
    console.log('🛠️ 显示文字控制面板');
}
function showStickerControls() {
    var textControls = document.getElementById('textControls');
    var stickerControls = document.getElementById('stickerControls');
    if (textControls)
        textControls.style.display = 'none';
    if (stickerControls)
        stickerControls.style.display = 'block';
    console.log('🛠️ 显示贴纸控制面板');
}
function hideAllControls() {
    var textControls = document.getElementById('textControls');
    var stickerControls = document.getElementById('stickerControls');
    if (textControls)
        textControls.style.display = 'none';
    if (stickerControls)
        stickerControls.style.display = 'none';
    if (selectedElement) {
        console.log('❌ 取消选中元素:', selectedElement.id);
    }
    selectedElement = null;
}
// 删除元素
function deleteElement(element) {
    var index = elements.findIndex(function (el) { return el.id === element.id; });
    if (index > -1) {
        console.log('🗑️ 已删除元素:', element.id);
        elements.splice(index, 1);
        hideAllControls();
        render();
    }
    else {
        console.warn('⚠️ 尝试删除不存在的元素:', element.id);
    }
}
// 鼠标事件处理
function handleMouseDown(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    console.log('🖱️ 鼠标按下:', { x: x, y: y });
    // 从后往前查找点击的元素
    var found = false;
    for (var i = elements.length - 1; i >= 0; i--) {
        if (isPointInElement(x, y, elements[i])) {
            console.log('✅ 检测到点击元素:', elements[i].id);
            selectElement(elements[i]);
            isDragging = true;
            dragOffset.x = x - elements[i].x;
            dragOffset.y = y - elements[i].y;
            found = true;
            return;
        }
    }
    if (!found) {
        console.log('🚫 点击空白区域');
        // 点击空白区域，取消选择
        hideAllControls();
        render();
    }
}
function handleMouseMove(e) {
    if (!isDragging || !selectedElement)
        return;
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    selectedElement.x = x - dragOffset.x;
    selectedElement.y = y - dragOffset.y;
    // 节流日志输出，避免刷屏
    if (Math.random() < 0.1) {
        console.log('🏃 拖拽中:', { x: selectedElement.x, y: selectedElement.y });
    }
    render();
}
function handleMouseUp() {
    isDragging = false;
}
function handleWheel(e) {
    if (!selectedElement)
        return;
    e.preventDefault();
    var delta = e.deltaY > 0 ? -10 : 10;
    if (selectedElement.type === 'text') {
        selectedElement.fontSize = Math.max(20, Math.min(200, selectedElement.fontSize + delta));
        syncTextControls();
    }
    else if (selectedElement.type === 'sticker') {
        selectedElement.size = Math.max(30, Math.min(200, selectedElement.size + delta));
        syncStickerControls();
    }
    render();
}
// 键盘事件处理
function handleKeyDown(e) {
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement) {
        // 如果焦点在输入框上，不删除
        var activeElement = document.activeElement;
        if ((activeElement === null || activeElement === void 0 ? void 0 : activeElement.tagName) === 'INPUT' || (activeElement === null || activeElement === void 0 ? void 0 : activeElement.tagName) === 'TEXTAREA') {
            return;
        }
        deleteElement(selectedElement);
    }
}
// 判断点是否在元素内
function isPointInElement(x, y, element) {
    // 添加点击容差，让用户更容易点击到元素
    var clickPadding = 10;
    if (element.type === 'text') {
        // 使用缓存的文字宽度（如果有的话），否则重新测量
        var textWidth = element.cachedWidth || (function () {
            ctx.save();
            ctx.font = "".concat(element.fontSize, " ").concat(element.fontFamily);
            var metrics = ctx.measureText(element.content);
            ctx.restore();
            return metrics.width;
        })();
        var textHeight = element.fontSize;
        // 考虑旋转角度的点击检测
        if (element.rotation !== 0) {
            // 将点击坐标转换到元素的局部坐标系
            var rad = (element.rotation * Math.PI) / 180;
            var cos = Math.cos(rad);
            var sin = Math.sin(rad);
            var dx = x - element.x;
            var dy = y - element.y;
            // 反向旋转到未旋转的状态
            var localX = dx * cos + dy * sin;
            var localY = -dx * sin + dy * cos;
            return localX >= -textWidth / 2 - clickPadding &&
                localX <= textWidth / 2 + clickPadding &&
                localY >= -textHeight / 2 - clickPadding &&
                localY <= textHeight / 2 + clickPadding;
        }
        else {
            // 没有旋转时的简单矩形检测
            return x >= element.x - textWidth / 2 - clickPadding &&
                x <= element.x + textWidth / 2 + clickPadding &&
                y >= element.y - textHeight / 2 - clickPadding &&
                y <= element.y + textHeight / 2 + clickPadding;
        }
    }
    else if (element.type === 'sticker') {
        var halfSize = element.size / 2;
        return x >= element.x - halfSize - clickPadding &&
            x <= element.x + halfSize + clickPadding &&
            y >= element.y - halfSize - clickPadding &&
            y <= element.y + halfSize + clickPadding;
    }
    return false;
}
// 渲染画布
function render() {
    console.log('🎨 render() 被调用, elements 数量:', elements.length);
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 绘制白色背景
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 绘制背景图
    if (backgroundImage) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }
    // 绘制所有元素
    elements.forEach(function (element, index) {
        ctx.save();
        // 移动到元素位置并旋转
        ctx.translate(element.x, element.y);
        ctx.rotate((element.rotation * Math.PI) / 180);
        if (element.type === 'text') {
            console.log("\u270F\uFE0F \u7ED8\u5236\u6587\u5B57[".concat(index, "]:"), {
                content: element.content,
                content长度: element.content.length,
                fontSize: element.fontSize,
                fontFamily: element.fontFamily,
                x: element.x,
                y: element.y,
                fontString: "".concat(element.fontSize, "px ").concat(element.fontFamily) // 添加这个调试信息
            });
            // 设置字体 - 确保使用正确的格式
            var fontString = "".concat(element.fontSize, "px ").concat(element.fontFamily);
            console.log('🔤 设置的 font:', fontString);
            ctx.font = fontString;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            // 测量文字宽度并缓存
            var metrics = ctx.measureText(element.content);
            element.cachedWidth = metrics.width;
            console.log('📐 测量宽度:', metrics.width, '(已缓存)');
            // 描边
            if (element.strokeWidth > 0) {
                ctx.strokeStyle = element.strokeColor;
                ctx.lineWidth = element.strokeWidth;
                ctx.lineJoin = 'round';
                ctx.strokeText(element.content, 0, 0);
            }
            // 填充
            ctx.fillStyle = element.color;
            ctx.fillText(element.content, 0, 0);
            // 验证实际设置的字体
            console.log('✅ Canvas 实际 font:', ctx.font);
        }
        else if (element.type === 'sticker') {
            // 绘制贴纸
            ctx.font = "".concat(element.size, "px Arial");
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(element.emoji, 0, 0);
        }
        ctx.restore();
    });
    // 单独绘制选中框（在所有元素之后）
    elements.forEach(function (element) {
        if (!element.selected)
            return;
        ctx.save();
        ctx.translate(element.x, element.y);
        ctx.rotate((element.rotation * Math.PI) / 180);
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        if (element.type === 'text') {
            // 使用缓存的文字宽度（在第一个循环中计算的）
            var textWidth = element.cachedWidth || ctx.measureText(element.content).width;
            var textHeight = element.fontSize;
            // 增加额外的边距以适应中文字符的渲染
            var padding = 10;
            console.log('📏 选中框尺寸:', {
                文字宽度: textWidth,
                文字高度: textHeight,
                fontSize: element.fontSize,
                选中框宽度: textWidth + padding * 2,
                选中框高度: textHeight + padding * 2,
                使用了缓存: !!element.cachedWidth
            });
            // 绘制选中框，使用更大的边距
            ctx.strokeRect(-textWidth / 2 - padding, -textHeight / 2 - padding, textWidth + padding * 2, textHeight + padding * 2);
        }
        else if (element.type === 'sticker') {
            var halfSize = element.size / 2;
            ctx.strokeRect(-halfSize - 5, -halfSize - 5, element.size + 10, element.size + 10);
        }
        ctx.restore();
    });
}
// 导出图片
function exportImage() {
    // 临时取消选中状态
    var wasSelected = selectedElement;
    if (wasSelected) {
        wasSelected.selected = false;
        render();
    }
    // 导出
    var link = document.createElement('a');
    link.download = "\u5927\u5B57\u62A5-".concat(Date.now(), ".png");
    link.href = canvas.toDataURL('image/png');
    link.click();
    // 恢复选中状态
    if (wasSelected) {
        wasSelected.selected = true;
        render();
    }
}
