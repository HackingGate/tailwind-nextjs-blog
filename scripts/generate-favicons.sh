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

# Create temporary directory for intermediate files
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Paths
SOURCE_SVG="$TEMP_DIR/favicon-source.svg"
AVATAR_SVG="$TEMP_DIR/avatar-source.svg"
FAVICON_DIR="public/static/favicons"
IMAGES_DIR="public/static/images"

echo -e "${BLUE}🎨 Generating favicons...${NC}\n"

# Create source SVG with explicit colors for ImageMagick
# (ImageMagick can't process CSS media queries, so we need explicit fill colors)
# Using 16x16 viewBox for better scaling to common sizes (16, 32, 48, 96, 192, 512, 1024)
echo -e "${GREEN}✓${NC} Creating temporary source SVG from favicon.svg"
cat > "$SOURCE_SVG" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
<rect x="1" y="1" width="2" height="14" fill="#0085E8"/>
<rect x="5" y="1" width="2" height="14" fill="#0085E8"/>
<rect x="9" y="1" width="2" height="14" fill="#0085E8"/>
<rect x="3" y="7" width="2" height="2" fill="#0085E8"/>
<rect x="12" y="7" width="3" height="2" fill="#0085E8"/>
<rect x="13" y="9" width="2" height="6" fill="#0085E8"/>
<rect x="13" y="1" width="2" height="4" fill="#0085E8"/>
<rect x="11" y="1" width="2" height="2" fill="#0085E8"/>
<rect x="11" y="13" width="2" height="2" fill="#0085E8"/>
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

echo -e "${GREEN}✓${NC} Generating android-chrome-192x192.png"
magick +antialias -background none -size 192x192 "$SOURCE_SVG" PNG32:"$FAVICON_DIR/android-chrome-192x192.png"

echo -e "${GREEN}✓${NC} Generating android-chrome-512x512.png"
magick +antialias -background none -size 512x512 "$SOURCE_SVG" PNG32:"$FAVICON_DIR/android-chrome-512x512.png"

echo -e "${GREEN}✓${NC} Generating icon-1024.png (future-proof)"
magick +antialias -background none -size 1024x1024 "$SOURCE_SVG" PNG32:"$FAVICON_DIR/icon-1024.png"

echo -e "${GREEN}✓${NC} Generating favicon.ico (multi-size)"
magick "$FAVICON_DIR/favicon-16x16.png" \
  "$FAVICON_DIR/favicon-32x32.png" \
  "$FAVICON_DIR/favicon-48x48.png" \
  "$FAVICON_DIR/favicon.ico"

echo -e "${GREEN}✓${NC} Generating avatar.png (1000x1000 with 10% padding)"
# Create avatar with 10% padding using 20x20 viewBox (16x16 icon centered with 2px padding)
# Clean 50x multiple: 1000/20 = 50x
cat > "$AVATAR_SVG" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
<g transform="translate(2, 2)">
<rect x="1" y="1" width="2" height="14" fill="#0085E8"/>
<rect x="5" y="1" width="2" height="14" fill="#0085E8"/>
<rect x="9" y="1" width="2" height="14" fill="#0085E8"/>
<rect x="3" y="7" width="2" height="2" fill="#0085E8"/>
<rect x="12" y="7" width="3" height="2" fill="#0085E8"/>
<rect x="13" y="9" width="2" height="6" fill="#0085E8"/>
<rect x="13" y="1" width="2" height="4" fill="#0085E8"/>
<rect x="11" y="1" width="2" height="2" fill="#0085E8"/>
<rect x="11" y="13" width="2" height="2" fill="#0085E8"/>
</g>
</svg>
EOF
echo -e "${GREEN}✓${NC} Generating avatar.png and avatar.webp (1000x1000 with 10% padding)"
# Generate both formats directly from SVG
magick +antialias -background none -size 1000x1000 "$AVATAR_SVG" PNG32:"$IMAGES_DIR/avatar.png"
magick +antialias -background none -size 1000x1000 "$AVATAR_SVG" -quality 100 -define webp:lossless=true "$IMAGES_DIR/avatar.webp"

echo -e "\n${BLUE}✨ All favicons and avatar generated successfully!${NC}"
echo -e "\nGenerated files:"
ls -lh "$FAVICON_DIR"/*.png "$FAVICON_DIR"/*.ico "$IMAGES_DIR/avatar.png" "$IMAGES_DIR/avatar.webp" 2>/dev/null | awk '{printf "  %s (%s)\n", $9, $5}'

# Temporary files will be cleaned up automatically via trap
