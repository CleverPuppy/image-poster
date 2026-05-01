# 大字报生成工具

一个基于 TypeScript 和 HTML5 Canvas 的轻量级大字报生成工具，专为自媒体创作者设计。

## ✨ 功能特性

### 📷 背景管理
- ✅ 上传自定义底图
- ✅ 清除背景
- ✅ 默认白色背景

### ✏️ 花字管理
- ✅ 添加文字元素
- ✅ 调整字体大小 (20-200px)
- ✅ 多种字体选择（微软雅黑、黑体、宋体、楷体、仿宋）
- ✅ 自定义字体颜色
- ✅ 描边效果（颜色和宽度可调）
- ✅ 旋转角度 (0-360°)
- ✅ 实时编辑文字内容

### 😊 贴纸管理
- ✅ 12种常用 Emoji 表情
- ✅ 拖拽添加贴纸
- ✅ 调整贴纸大小 (30-200px)
- ✅ 旋转贴纸 (0-360°)

### 🎯 交互操作
- ✅ 鼠标拖拽移动元素
- ✅ 滚轮缩放元素
- ✅ 点击选中元素
- ✅ 键盘 Delete/Backspace 删除
- ✅ 虚线框选中标识

### 💾 导出功能
- ✅ 一键导出高清 PNG 图片
- ✅ 自动去除选中状态

## 🛠️ 技术栈

- **前端**: TypeScript + HTML5 Canvas + CSS3
- **依赖**: 零外部依赖
- **兼容性**: Chrome, Edge, Safari 等现代浏览器

## 📦 项目结构

```
.
├── README.md          # 项目说明文档
├── index.html         # 页面结构与 DOM 元素定义
├── styles.css         # 界面样式与动画效果
├── app.ts             # TypeScript 核心业务逻辑
├── app.js             # 编译后的 JavaScript 文件
└── tsconfig.json      # TypeScript 配置文件
```

## 🚀 快速开始

### 1. 安装 TypeScript 编译器

```bash
npm install -g typescript
```

### 2. 编译 TypeScript

```bash
tsc app.ts
```

或者使用监听模式自动编译：

```bash
tsc app.ts --watch
```

### 3. 运行项目

**方式一：直接打开**
```bash
# 直接双击打开 index.html 文件
```

**方式二：本地服务器（推荐）**
```bash
# 使用 Python 3
python3 -m http.server 8080

# 或使用 Node.js 的 http-server
npx http-server -p 8080
```

然后访问: `http://localhost:8080`

## 📖 使用指南

### 上传底图
1. 点击左侧工具栏「上传底图」按钮
2. 选择要作为背景的图片
3. 画布会自动调整到图片尺寸

### 添加花字
1. 点击「添加文字」按钮
2. 在左侧面板编辑文字内容
3. 调整字体大小、颜色、描边等属性
4. 拖拽文字到合适位置

### 添加贴纸
1. 点击 Emoji 表情图标
2. 贴纸会自动添加到画布中心
3. 拖拽移动到合适位置
4. 调整大小和旋转角度

### 编辑元素
- **选中**: 点击画布上的元素
- **移动**: 拖拽元素到新位置
- **缩放**: 鼠标滚轮上下滚动
- **删除**: 选中后按 Delete 或 Backspace 键

### 导出图片
1. 完成设计后点击「导出图片」按钮
2. 自动下载 PNG 格式的高清图片

## 💡 使用技巧

- 🎨 **组合使用**: 可以叠加多个文字和贴纸创建丰富效果
- ⌨️ **快捷键**: Delete/Backspace 快速删除选中元素
- 🖱️ **滚轮缩放**: 快速调整元素大小
- 📐 **精确调整**: 使用左侧控制面板进行精确数值设置

## 🔧 开发说明

### 类型定义

项目使用 TypeScript 提供了完整的类型安全：

```typescript
interface TextElement {
    type: 'text';
    content: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    strokeColor: string;
    strokeWidth: number;
    // ... 更多属性
}

interface StickerElement {
    type: 'sticker';
    emoji: string;
    size: number;
    // ... 更多属性
}
```

### 核心架构

- **渲染循环**: `render()` 函数负责重绘画布
- **事件系统**: 鼠标和键盘事件处理用户交互
- **状态管理**: 全局状态管理所有元素和选中状态

## 📝 更新日志

### v1.0.0
- ✅ 初始版本发布
- ✅ 支持背景上传
- ✅ 支持花字编辑
- ✅ 支持贴纸管理
- ✅ 支持导出图片

## 📄 许可证

MIT License

## 👨‍💻 作者

邮箱: 919479850@qq.com

---

**享受创作的乐趣！🎉**
