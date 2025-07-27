# Love Letter Generator

A beautiful, romantic, and fully responsive web app for generating heartfelt love letters with the help of AI. The app features a realistic paper/ink look, animated handwritten effect, and easy sharing options.

## Features
- Generate deeply emotional, human-like love letters using AI (Gemini)
- Realistic paper background and handwritten animation
- Animated bouncing hearts background
- Responsive design for mobile and desktop
- Share your letter via link, WhatsApp, Instagram, or copy

## Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)
- npm

### Installation
1. Clone the repository:

	### Prerequisites
	- Node.js (v18 or newer recommended)
	- npm

	### Installation
	1. Clone the repository:
		```bash
		git clone https://github.com/Turbash/letter_site.git
		cd letter_site/letter-site
		```
	2. Install dependencies:
		```bash
		npm install
		```
	3. Set up Firebase:
		- Go to [Firebase Console](https://console.firebase.google.com/) and create a new project (or use an existing one).
		- In your project settings, add a new web app and copy the Firebase config values.
		- Create a `.env` file in the root of `letter-site` with the following content:
		  ```env
		  VITE_FIREBASE_API_KEY=your_api_key
		  VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
		  VITE_FIREBASE_PROJECT_ID=your_project_id
		  VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
		  VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
		  VITE_FIREBASE_APP_ID=your_app_id
		  VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
		  ```
		- Replace each value with your actual Firebase project credentials.

	### Running Locally
	Start the development server:
	```bash
	npm run dev
	```
	Open your browser and go to [http://localhost:5173](http://localhost:5173)
MIT

---
Made with ❤️ by Turbash