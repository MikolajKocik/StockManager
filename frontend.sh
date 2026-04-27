#!/bin/bash

# frontend.sh - Frontend Run Script

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Starting Frontend...${NC}"
cd Frontend
npm run dev
