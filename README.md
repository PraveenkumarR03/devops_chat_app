# DevOps Chat App — lecture demo

A small frontend + backend Chat App for demonstrating the DevOps lifecycle, pipeline stages, and continuous practices.

## What is included?

- Frontend: HTML, CSS, browser JavaScript
- Backend: Node.js + Express REST API
- Tests: Node's built-in test runner + Supertest
- CI: GitHub Actions runs tests and builds a Docker image
- Container: Dockerfile
- Deployment: Render can build and run the Dockerfile from the connected GitHub repository

**Demo limitation:** messages are held in memory and disappear when the server restarts. This is intentional to keep the lecture demo small; do not use it as a production chat service.

## 1. Prerequisites

Install:
- Node.js 20 or newer: https://nodejs.org/
- Git: https://git-scm.com/
- Docker Desktop (optional, for the container step): https://www.docker.com/products/docker-desktop/

Verify installation:

```bash
node --version
npm --version
git --version
docker --version
```

If you are not using Docker, skip the final command and Docker steps.

## 2. Run locally

Open a terminal in this project folder:

```bash
npm install
npm test
npm start
```

Open http://localhost:3000 in a browser. Send a message.

Health endpoint: http://localhost:3000/api/health

Expected health response:

```json
{"status":"ok"}
```

Stop the server with Ctrl+C.

## 3. Demonstrate Continuous Testing (CT)

Run:

```bash
npm test
```

Four tests should pass: health check, creating/retrieving a message, rejecting an empty message, and rejecting a message over 280 characters.

For a failure demonstration, temporarily change the expected health status in `test/app.test.js` from `ok` to `broken`, run `npm test`, and observe the failure. Restore it to `ok` before committing.

## 4. Push to GitHub

Create a new empty repository on https://github.com/new named `chat-app-devops-demo`. Do not add a README or license there if you already have this project locally.

From the project folder:

```bash
git init
git add .
git commit -m "Add Chat App and DevOps CI workflow"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/chat-app-devops-demo.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. Open the repository's **Actions** tab. The workflow should install dependencies, run tests, and build the Docker image.

If Git says the remote already exists, run `git remote -v` and update it with:

```bash
git remote set-url origin https://github.com/YOUR-USERNAME/chat-app-devops-demo.git
```

## 5. Explain the GitHub Actions workflow

File: `.github/workflows/ci.yml`

- `checkout`: downloads the repository source onto the runner.
- `setup-node`: selects Node.js 20.
- `npm install`: installs dependencies.
- `npm test`: runs automated tests.
- `docker build`: verifies the Docker image can be built.

This workflow builds the image but does not publish it to a registry or deploy it. That separation makes the first demonstration easier to understand.

## 6. Build and run Docker locally

Make sure Docker Desktop is running, then:

```bash
docker build -t chat-app-demo .
docker run --rm -p 3000:3000 chat-app-demo
```

Open http://localhost:3000. Stop the container with Ctrl+C.

The `-p 3000:3000` option maps port 3000 on your computer to port 3000 inside the container.

## 7. Deploy to Render

1. Push the code to GitHub and confirm GitHub Actions passes.
2. Sign in at https://render.com/.
3. Choose **New → Web Service** and connect the GitHub repository.
4. Select the repository and choose the **Docker** runtime if prompted. Render detects the `Dockerfile`.
5. Create the service and wait for the deployment to finish.
6. Open the Render-provided public URL and send a test message.
7. Visit the service's logs to show application startup and request activity.

For the clearest lecture explanation, keep Render's automatic deployment disabled until the CI workflow has passed, then deploy manually. This starter configuration does not yet enforce a CI-gated deployment automatically. A later extension can use a protected deploy hook or a published container image.

Render may take a few minutes to build and start the service. The free service availability and behavior can change, so rehearse before the lecture.

## 8. Connect each step to the lecture slides

| Slide concept | Demo action |
|---|---|
| Plan | Agree the features and acceptance criteria |
| Code | Change the UI or API |
| Build | GitHub Actions builds the Docker image |
| Test | Run local and automated tests |
| Release | Choose a passing version for release |
| Deploy | Deploy the Dockerfile-based service to Render |
| Operate | Open the app and use its endpoints |
| Monitor | Inspect Render logs and the health endpoint |
| CI | Push code and observe the workflow run |
| CT | Run the automated test suite |
| CD | Explain the passing release and controlled deployment |
| Continuous Monitoring | Check logs, availability and errors |

## Troubleshooting

- **Port 3000 is in use:** stop the other process or use `docker run --rm -p 3001:3000 chat-app-demo` and open http://localhost:3001.
- **`npm` not found:** install Node.js, restart the terminal, and check `node --version`.
- **Docker command fails:** start Docker Desktop and wait until it is ready.
- **GitHub Actions fails:** open the failed job and inspect the first failing step. Run `npm install` and `npm test` locally.
- **Render build fails:** check the Render build logs; ensure the repository includes `Dockerfile`, `package.json`, `src/` and `public/`.
- **Messages disappear:** expected in this demo; storage is in memory only.

## Rehearsal checklist

- [ ] Run `npm install`, `npm test`, and `npm start` before the lecture.
- [ ] Test the app at `http://localhost:3000`.
- [ ] Push the project and confirm GitHub Actions passes.
- [ ] Build and run the Docker image locally.
- [ ] Deploy to Render in advance and save the public URL.
- [ ] Keep screenshots of a passing workflow and deployed app as a fallback.
- [ ] Restore all deliberate test failures before the final commit.
