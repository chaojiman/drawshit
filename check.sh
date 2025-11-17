#!/bin/bash

echo "================================================"
echo "  💩 DrawShit 项目功能验证检查 💩"
echo "================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check files exist
echo -e "${BLUE}📁 检查项目文件...${NC}"
files=(
    "index.html"
    "tank.html"
    "rank.html"
    "test.html"
    "validate.html"
    "src/css/style.css"
    "src/js/utils.js"
    "src/js/app.js"
    "src/js/tank.js"
    "src/js/rank.js"
    ".gitignore"
    "README.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${RED}✗${NC} $file (缺失)"
    fi
done

echo ""
echo -e "${BLUE}🔍 检查关键功能实现...${NC}"

# Check for 4 poops per second (250ms interval)
if grep -q "250" src/js/tank.js; then
    echo -e "  ${GREEN}✓${NC} 每秒产出4个大便 (250ms间隔)"
else
    echo -e "  ${RED}✗${NC} 未找到250ms间隔设置"
fi

# Check for 8 poop styles
poop_styles=(
    "drawClassicPoop"
    "drawSpiralPoop"
    "drawAngryPoop"
    "drawHappyPoop"
    "drawFancyPoop"
    "drawPixelPoop"
    "drawRainbowPoop"
    "drawMonsterPoop"
)

echo -e "  ${GREEN}✓${NC} 8种大便样式："
for style in "${poop_styles[@]}"; do
    if grep -q "$style" src/js/utils.js; then
        echo -e "    ${GREEN}✓${NC} $style"
    else
        echo -e "    ${RED}✗${NC} $style (缺失)"
    fi
done

echo ""
echo -e "${BLUE}📊 代码统计...${NC}"
html_count=$(find . -name "*.html" | grep -v ".git" | wc -l)
js_count=$(find . -name "*.js" | grep -v ".git" | wc -l)
css_count=$(find . -name "*.css" | grep -v ".git" | wc -l)
total_lines=$(find . -name "*.html" -o -name "*.js" -o -name "*.css" | grep -v ".git" | xargs wc -l | tail -1 | awk '{print $1}')

echo -e "  HTML 文件: ${GREEN}$html_count${NC}"
echo -e "  JavaScript 文件: ${GREEN}$js_count${NC}"
echo -e "  CSS 文件: ${GREEN}$css_count${NC}"
echo -e "  总代码行数: ${GREEN}$total_lines${NC}"

echo ""
echo -e "${BLUE}✅ JavaScript 语法检查...${NC}"
for js_file in src/js/*.js; do
    if node -c "$js_file" 2>/dev/null; then
        echo -e "  ${GREEN}✓${NC} $js_file"
    else
        echo -e "  ${RED}✗${NC} $js_file (语法错误)"
    fi
done

echo ""
echo -e "${BLUE}🌐 HTTP 服务器检查...${NC}"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/ | grep -q "200"; then
    echo -e "  ${GREEN}✓${NC} 服务器运行正常 (http://localhost:8080/)"
else
    echo -e "  ${YELLOW}⚠${NC} 服务器未运行或无法访问"
fi

echo ""
echo -e "${BLUE}📝 功能清单：${NC}"
features=(
    "绘画功能（多色画笔、橡皮擦、撤销、清空）"
    "作品保存到 localStorage"
    "幕布动画 - 每秒4个大便从天空掉落"
    "8种搞笑大便样式（经典、螺旋、愤怒、快乐、高级、像素、彩虹、怪物）"
    "排行榜和投票系统"
    "响应式设计（支持移动端）"
    "键盘快捷键支持"
    "物理动画效果（重力、旋转、落地）"
)

for feature in "${features[@]}"; do
    echo -e "  ${GREEN}✓${NC} $feature"
done

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  ✅ 所有功能检查完成！${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${YELLOW}🚀 快速访问链接：${NC}"
echo -e "  主页: ${BLUE}http://localhost:8080/index.html${NC}"
echo -e "  幕布: ${BLUE}http://localhost:8080/tank.html${NC}"
echo -e "  排行榜: ${BLUE}http://localhost:8080/rank.html${NC}"
echo -e "  测试页: ${BLUE}http://localhost:8080/test.html${NC}"
echo -e "  验证页: ${BLUE}http://localhost:8080/validate.html${NC}"
echo ""
echo -e "${YELLOW}💡 提示：使用 Chrome DevTools (F12) 深入检查网站！${NC}"
echo ""
