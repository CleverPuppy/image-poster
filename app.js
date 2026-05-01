// 预定义模板库
var TEMPLATE_LIBRARY = [
    {
        name: '经典大字报',
        description: '传统红底黄字风格',
        background: {
            color: '#ff0000'
        },
        textDefaults: {
            fontSize: 80,
            fontFamily: 'SimHei',
            color: '#ffff00',
            strokeColor: '#000000',
            strokeWidth: 4,
            position: {
                x: 'center',
                y: 'center'
            }
        },
        canvasSize: {
            width: 1200,
            height: 800
        }
    },
    {
        name: '现代简约',
        description: '白底黑字简洁风格',
        background: {
            color: '#ffffff'
        },
        textDefaults: {
            fontSize: 60,
            fontFamily: 'Microsoft YaHei',
            color: '#000000',
            strokeColor: '#ffffff',
            strokeWidth: 2,
            position: {
                x: 'center',
                y: 'center'
            }
        },
        canvasSize: {
            width: 1000,
            height: 1000
        }
    },
    {
        name: '渐变时尚',
        description: '紫色渐变背景配白色文字',
        background: {
            gradient: {
                type: 'linear',
                colors: ['#667eea', '#764ba2'],
                angle: 45
            }
        },
        textDefaults: {
            fontSize: 70,
            fontFamily: 'Microsoft YaHei',
            color: '#ffffff',
            strokeColor: '#000000',
            strokeWidth: 3,
            position: {
                x: 'center',
                y: 'center'
            }
        },
        canvasSize: {
            width: 1200,
            height: 800
        }
    },
    {
        name: '复古海报',
        description: '米黄色复古风格',
        background: {
            color: '#f4e4c1'
        },
        textDefaults: {
            fontSize: 75,
            fontFamily: 'KaiTi',
            color: '#8b4513',
            strokeColor: '#d2691e',
            strokeWidth: 2,
            position: {
                x: 'center',
                y: 'center'
            }
        },
        canvasSize: {
            width: 1000,
            height: 1200
        }
    },
    {
        name: '科技蓝',
        description: '深蓝科技感风格',
        background: {
            gradient: {
                type: 'linear',
                colors: ['#0a0e27', '#1a237e'],
                angle: 90
            }
        },
        textDefaults: {
            fontSize: 65,
            fontFamily: 'FangSong',
            color: '#00ffff',
            strokeColor: '#0000ff',
            strokeWidth: 3,
            position: {
                x: 'center',
                y: 'center'
            }
        },
        canvasSize: {
            width: 1200,
            height: 800
        }
    },
    {
        name: '清新绿色',
        description: '绿色自然风格',
        background: {
            gradient: {
                type: 'radial',
                colors: ['#a8e6cf', '#7fcdcd']
            }
        },
        textDefaults: {
            fontSize: 70,
            fontFamily: 'Microsoft YaHei',
            color: '#2d5016',
            strokeColor: '#ffffff',
            strokeWidth: 2,
            position: {
                x: 'center',
                y: 'center'
            }
        },
        canvasSize: {
            width: 1000,
            height: 1000
        }
    }
];
// 全局状态
var canvas;
var ctx;
var backgroundImage = null;
var elements = [];
var selectedElement = null;
var isDragging = false;
var dragOffset = { x: 0, y: 0 };
var elementCounter = 0;
var currentTemplate = null; // 当前使用的模板
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
    // 模板管理
    bindTemplateControls();
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
// 绑定模板控制
function bindTemplateControls() {
    var templateSelect = document.getElementById('templateSelect');
    var applyTemplateBtn = document.getElementById('applyTemplateBtn');
    // 填充模板选项
    TEMPLATE_LIBRARY.forEach(function (template, index) {
        var option = document.createElement('option');
        option.value = index.toString();
        option.textContent = template.name;
        templateSelect.appendChild(option);
    });
    // 应用模板按钮
    applyTemplateBtn.addEventListener('click', function () {
        var selectedIndex = parseInt(templateSelect.value);
        if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < TEMPLATE_LIBRARY.length) {
            applyTemplate(TEMPLATE_LIBRARY[selectedIndex]);
        }
    });
    // 显示模板详情
    templateSelect.addEventListener('change', function () {
        showTemplateDetails(parseInt(templateSelect.value));
    });
}
// 应用模板
function applyTemplate(template) {
    console.log('🎨 应用模板:', template.name);
    currentTemplate = template;
    // 清空现有元素
    elements = [];
    selectedElement = null;
    hideAllControls();
    // 设置画布尺寸
    if (template.canvasSize) {
        canvas.width = template.canvasSize.width;
        canvas.height = template.canvasSize.height;
        console.log('📏 设置画布尺寸:', "".concat(canvas.width, "x").concat(canvas.height));
    }
    // 清除背景图（如果有的话）
    backgroundImage = null;
    // 添加一个默认的文字元素
    addTextElementWithTemplate(template);
    // 重新渲染
    render();
    console.log('✅ 模板已应用');
}
// 使用模板配置添加文字元素
function addTextElementWithTemplate(template) {
    var position = calculatePosition(template.textDefaults.position);
    var textElement = {
        id: "text-".concat(++elementCounter),
        type: 'text',
        content: '双击编辑文字',
        x: position.x,
        y: position.y,
        fontSize: template.textDefaults.fontSize,
        fontFamily: template.textDefaults.fontFamily,
        color: template.textDefaults.color,
        strokeColor: template.textDefaults.strokeColor,
        strokeWidth: template.textDefaults.strokeWidth,
        rotation: 0,
        selected: false
    };
    console.log('➕ 使用模板添加文字元素:', textElement.id);
    elements.push(textElement);
    selectElement(textElement);
    render();
    showTextControls();
}
// 添加文字元素
function addTextElement() {
    // 如果有当前模板，使用模板配置；否则使用默认配置
    var template = currentTemplate || TEMPLATE_LIBRARY[0];
    var position = calculatePosition(template.textDefaults.position);
    var textElement = {
        id: "text-".concat(++elementCounter),
        type: 'text',
        content: '双击编辑文字',
        x: position.x,
        y: position.y,
        fontSize: template.textDefaults.fontSize,
        fontFamily: template.textDefaults.fontFamily,
        color: template.textDefaults.color,
        strokeColor: template.textDefaults.strokeColor,
        strokeWidth: template.textDefaults.strokeWidth,
        rotation: 0,
        selected: false
    };
    console.log('➕ 添加文字元素:', textElement.id);
    elements.push(textElement);
    selectElement(textElement);
    render();
    showTextControls();
}
// 计算位置
function calculatePosition(position) {
    if (!position) {
        return {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
    }
    var x = canvas.width / 2;
    var y = canvas.height / 2;
    // 计算 X 坐标
    if (typeof position.x === 'number') {
        x = position.x;
    }
    else if (position.x === 'left') {
        x = canvas.width * 0.2;
    }
    else if (position.x === 'right') {
        x = canvas.width * 0.8;
    }
    // 'center' 是默认值
    // 计算 Y 坐标
    if (typeof position.y === 'number') {
        y = position.y;
    }
    else if (position.y === 'top') {
        y = canvas.height * 0.2;
    }
    else if (position.y === 'bottom') {
        y = canvas.height * 0.8;
    }
    // 'center' 是默认值
    return { x: x, y: y };
}
// 显示模板详情
function showTemplateDetails(index) {
    var _a, _b, _c, _d;
    var template = TEMPLATE_LIBRARY[index];
    var detailsDiv = document.getElementById('templateDetails');
    if (detailsDiv) {
        detailsDiv.innerHTML = "\n            <div class=\"template-info\">\n                <h4>".concat(template.name, "</h4>\n                <p>").concat(template.description, "</p>\n                ").concat(((_a = template.background) === null || _a === void 0 ? void 0 : _a.color) ? "<p>\u80CC\u666F\u8272: ".concat(template.background.color, "</p>") : '', "\n                ").concat(((_b = template.background) === null || _b === void 0 ? void 0 : _b.gradient) ? "<p>\u6E10\u53D8: ".concat(template.background.gradient.colors.join(' → '), "</p>") : '', "\n                <p>\u5B57\u4F53: ").concat(template.textDefaults.fontFamily, "</p>\n                <p>\u5B57\u53F7: ").concat(template.textDefaults.fontSize, "px</p>\n                <p>\u753B\u5E03: ").concat(((_c = template.canvasSize) === null || _c === void 0 ? void 0 : _c.width) || '自定义', " \u00D7 ").concat(((_d = template.canvasSize) === null || _d === void 0 ? void 0 : _d.height) || '自定义', "</p>\n            </div>\n        ");
    }
}
// 渲染画布
function render() {
    console.log('🎨 render() 被调用, elements 数量:', elements.length);
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 绘制白色背景或模板背景
    if (currentTemplate === null || currentTemplate === void 0 ? void 0 : currentTemplate.background) {
        drawBackground();
    }
    else {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    // 绘制背景图（如果有的话，会覆盖背景色）
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
// 绘制背景
function drawBackground() {
    if (!(currentTemplate === null || currentTemplate === void 0 ? void 0 : currentTemplate.background))
        return;
    // 如果有纯色背景
    if (currentTemplate.background.color) {
        ctx.fillStyle = currentTemplate.background.color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    // 如果有渐变背景
    if (currentTemplate.background.gradient) {
        var gradient_1 = currentTemplate.background.gradient;
        var gradientObj_1;
        if (gradient_1.type === 'linear') {
            var angle = (gradient_1.angle || 0) * Math.PI / 180;
            var x1 = canvas.width / 2 - Math.cos(angle) * canvas.width / 2;
            var y1 = canvas.height / 2 - Math.sin(angle) * canvas.height / 2;
            var x2 = canvas.width / 2 + Math.cos(angle) * canvas.width / 2;
            var y2 = canvas.height / 2 + Math.sin(angle) * canvas.height / 2;
            gradientObj_1 = ctx.createLinearGradient(x1, y1, x2, y2);
        }
        else {
            // 径向渐变
            gradientObj_1 = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        }
        gradient_1.colors.forEach(function (color, index) {
            gradientObj_1.addColorStop(index / (gradient_1.colors.length - 1), color);
        });
        ctx.fillStyle = gradientObj_1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
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
