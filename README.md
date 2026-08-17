<img width="1440" height="900" alt="Screenshot 2026-08-15 at 11 04 16 PM" src="https://github.com/user-attachments/assets/53952a0c-67dd-4440-8251-dfa099952f46" />



# ☕ Smart Brew Assistant

A sleek, serverless web application designed to take the guesswork out of manual coffee brewing. Whether you are dialing in a V60, AeroPress, or French Press, this assistant calculates exact water yields, optimal temperatures, and generates live, step-by-step pour timelines based on your inputs. 

**[🔗 View the Live App Here](https://hkhrithik007.github.io/smart-brew-assistant/)**

---

## ✨ Why It's Built Differently

The Smart Brew Assistant was built to sit right next to a digital scale and manual grinder. It requires no backend database, no login, and no loading screens. It uses a custom-built YAML parsing engine to do the heavy lifting natively in the browser.

### 🌟 Key Features

* **Dynamic Recipe Engine:** Calculates precise target yields and optimal brewing temperatures on the fly. Temperatures automatically adjust based on your selected coffee roast level and fermentation process (e.g., Natural vs. Washed).
* **Triple-Tier Fallback Architecture:** Built for 100% uptime. The app fetches `.yaml` recipe files simultaneously using `Promise.all()` via:
  1. **Local Directory:** Lightning fast reads for standard hosting.
  2. **Live GitHub API:** Cloud synchronization for live updates.
  3. **Hardcoded Emergency Cache:** Offline redundancy so the app never breaks.
* **Custom Recipe Editor:** A built-in workspace to dial in your own pouring steps, times, and water weights. Add custom brew notes, stage multiple brewing methods, and export them directly to your device as a fully bundled `.yaml` config pack.
* **Pre-Loaded Barista Profiles:** Comes default with world-renowned coffee recipes (including James Hoffmann and Morgan Eckroth configurations).
* **Thumb-Zone Mobile UI:** Fully responsive design featuring a mobile split-view that keeps the timeline visible at the top of the screen (where your eyes are) while you interact with the form at the bottom (where your thumbs are).
* **Adaptive Theming:** Seamless light/dark mode toggle using Tailwind CSS, complete with beautifully blended, floating background aesthetics.

---

## 🧠 Under the Hood

* **Frontend:** HTML5, Vanilla JavaScript, Tailwind CSS 
* **Data Parsing:** `js-yaml` (Dynamic YAML to JSON conversion)
* **Templating:** Custom JS regex templating dynamically injects math into static text (e.g., automatically replacing `{{water}}` with total calculated yield, and `{{chunk_1}}` through `{{chunk_4}}` with calculated 20% fractional pouring increments).
* **Architecture:** 100% Client-Side / Serverless API

---

## 🚀 Future Updates & Roadmap

We are constantly looking to refine the brewing experience. Here is what is on the horizon for the Smart Brew Assistant:

* **Progressive Web App (PWA) Support:** Install the assistant directly to your home screen for true offline use without needing a browser window.
* **Community Config Sharing:** A streamlined way to import `.yaml` files shared by other users and coffee roasters directly into the app.
* **Expanded Default Library:** Adding more legendary barista profiles, specific brewer types (like Orea and Kalita Wave), and espresso dial-in tools.
* **Advanced Timer Integration:** Built-in live stopwatch functionality that visually syncs with the generated recipe steps. 

---

## 📜 License & Copyright

&copy; 2026 Smart Brew Assistant&trade; 
Crafted by **Hritik Sharma**
