# Furnitize / Homedesigner

## Overview

Furnitize is a full-stack application that integrates React, Node.js, Express, MongoDB, and advanced AI technologies to provide a seamless furniture shopping and design experience. The app offers two main features:

1. **AI-Powered Furniture Search**: An AI assistant helps users find matching furniture from a client's website by asking style-relevant questions.
2. **3D/AR Home Design**: Users can design their homes in a 3D/AR environment using selected furniture.

## Features

### AI Assistant Chat
- Helps users discover furniture that matches their style preferences.
- Uses **OpenAI models** and a **Boolean based ranking system** to recommend relevant products.
- Furniture data is scraped from the client's website.

### 3D/AR Home Design
- Utilizes **Three.js** to create an interactive 3D/AR design environment.
- Allows users to visualize how selected furniture fits into their home.

## Tech Stack

### Frontend
- **React**: Dynamic UI for the AI assistant and design tool.
- **Three.js**: For 3D/AR visualizations.

### Backend
- **Node.js & Express**: API and server logic.
- **MongoDB**: Database for storing furniture data and user preferences.
- **OpenAI API**: Powering the AI assistant.

### Other Tools
- **Web scraping**: To collect furniture data from the client’s website.
