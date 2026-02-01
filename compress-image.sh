#!/bin/bash

# ============================================
# Image Compression Script
# ============================================
# Compresses all images in public/
# JPG/JPEG → quality 80
# PNG → quality 80
# GIF → optimize layers
# ============================================

PUBLIC_DIR="public"

# Output colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== Image Compression Script ===${NC}"
echo ""

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo -e "${RED}ERROR: ImageMagick not found. Install it:${NC}"
    echo "sudo apt install imagemagick"
    exit 1
fi

# Check if public/ directory exists
if [ ! -d "$PUBLIC_DIR" ]; then
    echo -e "${RED}ERROR: Directory '$PUBLIC_DIR' not found${NC}"
    echo "Run the script from the project root"
    exit 1
fi

TOTAL_BEFORE=0
TOTAL_AFTER=0

# ============================================
# Function to compress a single image
# ============================================

compress_image() {
    local input="$1"
    local filename=$(basename "$input")
    local extension="${filename##*.}"
    local temp_output="${input}.tmp"

    # Get size before compression
    local size_before=$(stat -c%s "$input")
    TOTAL_BEFORE=$((TOTAL_BEFORE + size_before))

    # Compress based on format
    case "${extension,,}" in  # ${,,} = lowercase
        jpg|jpeg)
            convert "$input" -quality 80 -strip "$temp_output"
            ;;
        png)
            convert "$input" -quality 80 "$temp_output"
            ;;
        gif)
            convert "$input" -layers Optimize "$temp_output"
            ;;
        *)
            echo -e "  ${YELLOW}Skipping: ${filename} (unsupported format)${NC}"
            return
            ;;
    esac

    # Replace original with compressed file
    mv "$temp_output" "$input"

    # Get size after compression
    local size_after=$(stat -c%s "$input")
    TOTAL_AFTER=$((TOTAL_AFTER + size_after))

    # Calculate savings
    local saved=$(( (size_before - size_after) * 100 / size_before ))

    local before_human=$(numfmt --to=iec $size_before)
    local after_human=$(numfmt --to=iec $size_after)

    echo -e "  ${filename}: ${before_human} → ${after_human} ${GREEN}(${saved}% saved)${NC}"
}

# ============================================
# Compress all images
# ============================================

echo -e "Scanning: ${PUBLIC_DIR}/"
echo ""

# Find all images (excluding videos/ folder)
find "$PUBLIC_DIR" \
    -not -path "*/videos/*" \
    \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" \) \
    -type f | sort | while read file; do
    compress_image "$file"
done

# ============================================
# Results
# ============================================

echo ""
echo -e "${YELLOW}=== Results ===${NC}"
echo ""
echo "All files in public/:"
find "$PUBLIC_DIR" -not -path "*/videos/*" -type f -exec ls -lh {} \; | awk '{print "  " $5 "\t" $NF}'
echo ""
echo -e "${GREEN}=== Compression complete! ===${NC}"