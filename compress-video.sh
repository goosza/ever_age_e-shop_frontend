#!/bin/bash

# ===== For Windows Users =====
# 1. Download ffmpeg from https://ffmpeg.org/download.html
# 2. Unarchive to C:\Program Files\ffmpeg\
# 3. Add to PATH:
#    Windows → Settings → System → Advanced → Environment Variables
#    Path → add: C:\Program Files\ffmpeg\bin

# 4. Check in Git Bash
# ffmpeg -version
# GitBash should see ffmpeg now and run script from git bash terminal

# ============================================
# Video Compression Script
# ============================================
# Compresses video from 4K to 1080p
# Creates poster images for each video
#
# Usage:
#   ./compress-videos.sh                    # Compress all videos
#   ./compress-videos.sh public/videos/bg-01.mp4  # Compress single file
# ============================================

VIDEOS_DIR="public/videos"
TEMP_DIR="public/videos/temp"
SINGLE_FILE="$1"  # Optional: single file to compress

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================
# Checks
# ============================================

echo -e "${YELLOW}=== Video Compression Script ===${NC}"
echo ""

# Check if ffmpeg installed
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}ERROR: ffmpeg not found. Install it:${NC}"
    echo "sudo apt install ffmpeg"
    exit 1
fi

# Check if directory exists
if [ ! -d "$VIDEOS_DIR" ]; then
    echo -e "${RED}ERROR: Directory '$VIDEOS_DIR' not found${NC}"
    echo "Run script from project root"
    exit 1
fi

# Create temp directory
mkdir -p "$TEMP_DIR"

# ============================================
# Function to compress video
# ============================================

compress_video() {
    local input="$1"
    local filename=$(basename "$input")
    local temp_output="${TEMP_DIR}/${filename}"
    local poster="${VIDEOS_DIR}/poster_${filename%.mp4}.jpg"

    echo -e "${YELLOW}Processing: ${filename}${NC}"

    # Size before compression
    local size_before=$(du -h "$input" | cut -f1)
    echo "  Size before: ${size_before}"

    # Compress video to temp file
    ffmpeg -i "$input" \
        -vcodec libx264 \
        -crf 28 \
        -preset medium \
        -vf "scale=1920:1080" \
        -r 30 \
        -movflags +faststart \
        "$temp_output" \
        -y 2>&1 | tail -n 1

    # Creating poster
    ffmpeg -i "$input" \
        -ss 00:00:01 \
        -vframes 1 \
        "$poster" \
        -y 2>/dev/null

    # Replace original video
    mv "$temp_output" "$input"

    # Size after compression
    local size_after=$(du -h "$input" | cut -f1)
    echo -e "  Size after:  ${size_after}"
    echo -e "  ${GREEN}✓ Done${NC}"
    echo ""
}

# ============================================
# Compressing videos
# ============================================

echo -e "Videos directory: ${VIDEOS_DIR}"
echo ""

# If single file specified, compress only that file
if [ -n "$SINGLE_FILE" ]; then
    if [ ! -f "$SINGLE_FILE" ]; then
        echo -e "${RED}ERROR: File '$SINGLE_FILE' not found${NC}"
        echo ""
        echo "Usage: ./compress-videos.sh [file]"
        echo "Example: ./compress-videos.sh public/videos/bg-01.mp4"
        exit 1
    fi
    echo -e "${YELLOW}Compressing single file: $(basename $SINGLE_FILE)${NC}"
    echo ""
    compress_video "$SINGLE_FILE"
else
    # Compress all videos in directory
    echo -e "${YELLOW}Compressing all videos in ${VIDEOS_DIR}${NC}"
    echo ""
    VIDEO_COUNT=0
    for file in "${VIDEOS_DIR}"/*.mp4; do
        if [ -f "$file" ]; then
            compress_video "$file"
            VIDEO_COUNT=$((VIDEO_COUNT + 1))
        fi
    done

    if [ $VIDEO_COUNT -eq 0 ]; then
        echo -e "${YELLOW}No .mp4 files found in ${VIDEOS_DIR}${NC}"
    fi
fi

# ============================================
# Result
# ============================================

echo -e "${YELLOW}=== Results ===${NC}"
echo ""

if [ -n "$SINGLE_FILE" ]; then
    echo "Compressed file:"
    ls -lah "$SINGLE_FILE" | awk '{print "  " $5 "\t" $NF}'
    echo ""
    POSTER="${VIDEOS_DIR}/poster_$(basename ${SINGLE_FILE%.mp4}).jpg"
    if [ -f "$POSTER" ]; then
        echo "Poster image:"
        ls -lah "$POSTER" | awk '{print "  " $5 "\t" $NF}'
    fi
else
    echo "Compressed files:"
    ls -lah "${VIDEOS_DIR}"/*.mp4 2>/dev/null | awk '{print "  " $5 "\t" $NF}'
    echo ""
    echo "Poster images:"
    ls -lah "${VIDEOS_DIR}"/*.jpg 2>/dev/null | awk '{print "  " $5 "\t" $NF}'
fi
echo ""

# Delete temp directory
rm -rf "$TEMP_DIR"

echo -e "${GREEN}=== Compression complete! ===${NC}"