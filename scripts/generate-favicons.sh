#!/bin/bash
# Generate all favicon sizes from SVG source
# Usage: ./scripts/generate-favicons.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Paths
SOURCE_SVG="favicon-source.svg"
FAVICON_DIR="public/static/favicons"
IMAGES_DIR="public/static/images"

echo -e "${BLUE}🎨 Generating favicons from ${SOURCE_SVG}...${NC}\n"

# Create source SVG with explicit colors for ImageMagick
# (ImageMagick can't process CSS media queries, so we need explicit fill colors)
echo -e "${GREEN}✓${NC} Creating ${SOURCE_SVG} from favicon.svg"
cat > "$SOURCE_SVG" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
<rect x="2" y="2" width="4" height="28" fill="#0085E8"/>
<rect x="10" y="2" width="4" height="28" fill="#0085E8"/>
<rect x="18" y="2" width="4" height="28" fill="#0085E8"/>
<rect x="6" y="14" width="4" height="4" fill="#0085E8"/>
<rect x="24" y="14" width="6" height="4" fill="#0085E8"/>
<rect x="26" y="18" width="4" height="12" fill="#0085E8"/>
<rect x="26" y="2" width="4" height="8" fill="#0085E8"/>
<rect x="22" y="2" width="4" height="4" fill="#0085E8"/>
<rect x="22" y="26" width="4" height="4" fill="#0085E8"/>
</svg>
EOF

# Generate PNG favicons with exact sizes for crisp rendering
echo -e "${GREEN}✓${NC} Generating favicon-16x16.png"
magick +antialias -background none -size 16x16 "$SOURCE_SVG" PNG32:"$FAVICON_DIR/favicon-16x16.png"

echo -e "${GREEN}✓${NC} Generating favicon-32x32.png"
magick +antialias -background none -size 32x32 "$SOURCE_SVG" PNG32:"$FAVICON_DIR/favicon-32x32.png"

echo -e "${GREEN}✓${NC} Generating favicon-48x48.png"
magick +antialias -background none -size 48x48 "$SOURCE_SVG" PNG32:"$FAVICON_DIR/favicon-48x48.png"

echo -e "${GREEN}✓${NC} Generating android-chrome-96x96.png"
magick +antialias -background none -size 96x96 "$SOURCE_SVG" PNG32:"$FAVICON_DIR/android-chrome-96x96.png"

echo -e "${GREEN}✓${NC} Generating apple-touch-icon.png (180x180)"
magick +antialias -background none -size 180x180 "$SOURCE_SVG" PNG32:"$FAVICON_DIR/apple-touch-icon.png"

echo -e "${GREEN}✓${NC} Generating android-chrome-192x192.png"
magick +antialias -background none -size 192x192 "$SOURCE_SVG" PNG32:"$FAVICON_DIR/android-chrome-192x192.png"

echo -e "${GREEN}✓${NC} Generating android-chrome-512x512.png"
magick +antialias -background none -size 512x512 "$SOURCE_SVG" PNG32:"$FAVICON_DIR/android-chrome-512x512.png"

echo -e "${GREEN}✓${NC} Generating apple-touch-icon-152x152.png (iPad)"
magick +antialias -background none -size 152x152 "$SOURCE_SVG" PNG32:"$FAVICON_DIR/apple-touch-icon-152x152.png"

echo -e "${GREEN}✓${NC} Generating mstile-150x150.png"
magick +antialias -background none -size 150x150 "$SOURCE_SVG" PNG32:"$FAVICON_DIR/mstile-150x150.png"

echo -e "${GREEN}✓${NC} Generating icon-1024.png (future-proof)"
magick +antialias -background none -size 1024x1024 "$SOURCE_SVG" PNG32:"$FAVICON_DIR/icon-1024.png"

echo -e "${GREEN}✓${NC} Generating favicon.ico (multi-size)"
magick "$FAVICON_DIR/favicon-16x16.png" \
  "$FAVICON_DIR/favicon-32x32.png" \
  "$FAVICON_DIR/favicon-48x48.png" \
  "$FAVICON_DIR/favicon.ico"

echo -e "${GREEN}✓${NC} Generating avatar.png (1024x1024 with padding)"
# Create avatar with 20% padding using a temporary SVG with proper viewBox
cat > "avatar-source.svg" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
<g transform="translate(4, 4)">
<rect x="2" y="2" width="4" height="28" fill="#0085E8"/>
<rect x="10" y="2" width="4" height="28" fill="#0085E8"/>
<rect x="18" y="2" width="4" height="28" fill="#0085E8"/>
<rect x="6" y="14" width="4" height="4" fill="#0085E8"/>
<rect x="24" y="14" width="6" height="4" fill="#0085E8"/>
<rect x="26" y="18" width="4" height="12" fill="#0085E8"/>
<rect x="26" y="2" width="4" height="8" fill="#0085E8"/>
<rect x="22" y="2" width="4" height="4" fill="#0085E8"/>
<rect x="22" y="26" width="4" height="4" fill="#0085E8"/>
</g>
</svg>
EOF
magick +antialias -background none -size 1024x1024 "avatar-source.svg" PNG32:"$IMAGES_DIR/avatar.png"
rm -f "avatar-source.svg"

echo -e "\n${BLUE}✨ All favicons and avatar generated successfully!${NC}"
echo -e "\nGenerated files:"
ls -lh "$FAVICON_DIR"/*.png "$FAVICON_DIR"/*.ico "$IMAGES_DIR/avatar.png" 2>/dev/null | awk '{printf "  %s (%s)\n", $9, $5}'

# Cleanup temporary source file
echo -e "\n${GREEN}✓${NC} Cleaning up ${SOURCE_SVG}"
rm -f "$SOURCE_SVG"
