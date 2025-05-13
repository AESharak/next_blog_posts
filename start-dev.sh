#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting development environment...${NC}"

# Step 1: Check if .env file exists
if [ ! -f .env ]; then
  echo -e "${RED}Error: .env file not found!${NC}"
  echo "Please create a .env file with your database connection string."
  exit 1
fi

# Step 2: Start database server
echo -e "${YELLOW}Starting database server...${NC}"

# Check if using prisma
if [ -f prisma/schema.prisma ]; then
  echo "Detected Prisma ORM"
  
  # Start the database server (This depends on your setup)
  # For example, if using Prisma with SQLite:
  # npx prisma studio &
  # For PostgreSQL:
  # If you're using Docker to run PostgreSQL:
  # docker-compose up -d db
  
  # Ask for confirmation
  echo -e "${YELLOW}Did you start your database server? (y/n)${NC}"
  read -r db_started
  
  if [[ "$db_started" != "y" && "$db_started" != "Y" ]]; then
    echo -e "${RED}Please start your database server before continuing.${NC}"
    exit 1
  fi
  
  # Run database check script
  echo "Checking database connection..."
  node scripts/check-db.js
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Database connection failed. Please ensure your database is running.${NC}"
    echo "Check your .env file for the correct connection string."
    exit 1
  fi
  
  echo -e "${GREEN}Database is ready!${NC}"
else 
  echo "No Prisma schema detected, skipping database start"
fi

# Step 3: Start Next.js
echo -e "${YELLOW}Starting Next.js development server...${NC}"
npm run dev

echo -e "${GREEN}Development environment started successfully!${NC}" 