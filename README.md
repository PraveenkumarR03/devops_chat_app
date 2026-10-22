# Chat App — DevOps Demo

A simple real-time Chat App demonstrating the full DevOps lifecycle — from writing code to automatic deployment.

> Built for II Year B.E. CSE students · CS25C10 Object Oriented Software Engineering

---

## DevOps Lifecycle — How this project follows it

| # | Stage | Tool used | What happens in this project |
|---|---|---|---|
| 1 | **Plan** | GitHub Issues | Features and tasks tracked as issues |
| 2 | **Code** | Git + GitHub | Every change committed and pushed to GitHub |
| 3 | **Build** | Node.js + Docker | Dependencies installed, Docker image built |
| 4 | **Test** | Node test runner | 4 automated tests run on every push |
| 5 | **Package** | Docker Hub | Versioned image pushed (`devops_chat_app:<sha>`) |
| 6 | **Deploy** | Render | Docker image pulled and app goes live automatically |
| 7 | **Operate** | Render | App runs as a containerised service on the cloud |
| 8 | **Monitor** | Render logs + `/api/health` | Logs, metrics and health endpoint visible on Render |

---

## CI/CD Pipeline — fully automatic

Every `git push` to `main` triggers 6 jobs in order, each matching a DevOps stage:

```
git push to main
    ↓
Step 1 · Code     — checkout code, log commit info
    ↓
Step 2 · Build    — install Node.js dependencies
    ↓
Step 3 · Test     — run 4 automated tests (stops here if any fail)
    ↓
Step 4 · Package  — build Docker image → push to Docker Hub
                    tags: <your-username>/devops_chat_app:<sha> + latest
    ↓
Step 5 · Deploy   — call Render deploy hook → app goes live
    ↓
Step 6 · Release  — create GitHub Release tag v<date>-<sha>
```

Pull requests only run **Steps 1–3 (code, build, test)** — no deploy on PRs.

---

## GitHub Secrets required

Go to your repo → **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Value |
|---|---|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub → Account Settings → Security → New Access Token |
| `RENDER_DEPLOY_HOOK_URL` | Render service → Settings → Deploy Hook URL |

---

## What is inside

| File / Folder | What it does |
|---|---|
| `src/` | Node.js + Express backend API |
| `public/index.html` | Login page |
| `public/chat.html` | WhatsApp-style chat UI |
| `test/` | 4 automated tests |
| `Dockerfile` | Packages the app into a container image |
| `.github/workflows/pipeline.yml` | Full CI/CD pipeline — 6 steps |

> **Note:** Messages are stored in memory and reset when the server restarts. Intentional — keeps the demo simple.

---

## Run locally

```bash
npm install
npm test        # 4 tests should pass
npm start       # starts server at http://localhost:3000
```

Open **http://localhost:3000** — you will see the login page.

**Multi-tab chat:**
- Open two browser tabs at http://localhost:3000
- Enter a different name in each tab
- Messages from Tab 1 appear on the right (green) in Tab 1 and left (white) in Tab 2
- The app polls every 2.5 seconds — messages appear automatically across tabs

Health check: http://localhost:3000/api/health → `{"status":"ok"}`

---

## Run with Docker

```bash
docker build -t chat-app .
docker run --rm -p 3000:3000 chat-app
```

---

## Set up Render (cloud deployment)

1. Sign in at https://render.com
2. **New → Web Service → Connect GitHub repo**
3. Runtime: **Docker**
4. Create the service
5. **Settings → Deploy Hook** → copy the URL → add as `RENDER_DEPLOY_HOOK_URL` secret in GitHub

---

## Monitor in production

| What to check | Where |
|---|---|
| App logs (requests, errors) | Render dashboard → Logs tab |
| Deploy history | Render dashboard → Events tab |
| Health check | `https://your-app.onrender.com/api/health` |
| Pipeline runs | GitHub repo → Actions tab |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Port 3000 in use | `docker run --rm -p 3001:3000 chat-app` → open http://localhost:3001 |
| Tests fail | Run `npm test` locally, check the first failing test |
| Docker push fails | Check `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets |
| Render not deploying | Check `RENDER_DEPLOY_HOOK_URL` secret and Render build logs |
| Push denied (403) | Run `gh auth login` or use a Personal Access Token |
| Messages disappear | Expected — storage is in memory only |
