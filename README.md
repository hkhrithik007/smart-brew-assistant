<img width="1440" height="900" alt="Screenshot 2026-08-15 at 11 04 16 PM" src="https://github.com/user-attachments/assets/53952a0c-67dd-4440-8251-dfa099952f46" />



# ☕ Smart Brew Assistant

A sleek, serverless web application designed to take the guesswork out of manual coffee brewing. Whether you are dialing in a V60, AeroPress, or French Press, this assistant calculates exact water yields, optimal temperatures, and generates live, step-by-step pour timelines based on your inputs. 

**[🔗 View the Live App Here](https://hkhrithik007.github.io/smart-brew-assistant/)**

---

## ✨ Why It's Built Differently

The Smart Brew Assistant was built to sit right next to a digital scale and manual grinder. It requires no backend database, no login, and no loading screens. It uses a custom-built YAML parsing engine and URL compression to do all the heavy lifting natively in your browser—allowing you to generate, share, and instantly load complete recipes via scan-and-go QR codes.

### 🌟 Key Features

* **Instant QR Sharing & Card Generator:** Share your custom dialed recipes instantly without a database. The app compresses your entire recipe (using `lz-string`) into a URL parameter. It also features an HTML5 Canvas generator that creates beautiful, branded, and downloadable QR code cards for your gallery. Scanning the QR code instantly unpacks the recipe on any device.
* **Dynamic Recipe Engine:** Calculates precise target yields and optimal brewing temperatures on the fly. Temperatures automatically adjust based on your selected coffee roast level and fermentation process (e.g., Natural vs. Washed).
* **Triple-Tier Fallback Architecture:** Built for 100% uptime. The app fetches `.yaml` recipe files simultaneously using `Promise.all()` via:
  1. **Local Directory:** Lightning-fast reads for standard hosting.
  2. **Live GitHub API:** Cloud synchronization for live updates.
  3. **Hardcoded Emergency Cache:** Offline redundancy so the app never breaks.
* **Advanced Custom Recipe Editor:** A built-in workspace to dial in your own pouring steps, times, and water weights. Track your exact **Grinder Name and Grind Size**, add custom brew notes, stage multiple brewing methods, and export them directly to your device as a fully bundled `.yaml` config pack.
* **Mobile-Optimized UX:** Fully responsive design featuring a dedicated "Preview Recipe" popup modal for mobile users, keeping the timeline easily accessible while typing out custom steps on smaller screens.
* **Pre-Loaded Barista Profiles:** Comes default with world-renowned coffee recipes (including James Hoffmann and Morgan Eckroth configurations), pre-dialed for specific grinders like the Timemore C2s.
* **Adaptive Theming:** Seamless light/dark mode toggle using Tailwind CSS, complete with beautifully blended, floating background aesthetics.

---

## 🧠 Under the Hood

* **Frontend:** HTML5, Vanilla JavaScript, Tailwind CSS (via CDN)
* **Data Parsing:** `js-yaml` (Dynamic YAML to JSON conversion)
* **Compression & Sharing:** `lz-string` (URL payload compression) & `qrcode.js` (Canvas QR rendering)
* **Templating:** Custom JS regex templating dynamically injects math into static text (e.g., automatically replacing `{{water}}` with total calculated yield, and `{{chunk_1}}` through `{{chunk_4}}` with calculated 20% fractional pouring increments).
* **Architecture:** 100% Client-Side / Serverless API

---

## 🚀 Future Updates & Roadmap

We are constantly looking to refine the brewing experience. Here is what is on the horizon for the Smart Brew Assistant:

* **Progressive Web App (PWA) Support:** Install the assistant directly to your home screen for true offline use without needing a browser window.
* **Expanded Default Library:** Adding more legendary barista profiles, specific brewer types (like Orea and Kalita Wave), and espresso dial-in tools.
* **Advanced Timer Integration:** Built-in live stopwatch functionality that visually syncs with the generated recipe steps. 

---

## 📜 License & Copyright

&copy; 2026 Smart Brew Assistant&trade; 
Crafted by **Hritik Sharma**
