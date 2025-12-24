# DevSecOps Assignment: Secure CI/CD Pipeline

This repository demonstrates a complete DevSecOps workflow for a Python-based web application. It integrates automated **security scanning**, **containerization** and **continuous integration** to ensure that security is "shifted left" in the development lifecycle.

# 🚀 Project Overview

The core application is a simple **Flask** web server. The project focuses on the automation of security checks within a **GitHub Actions** pipeline, including **Static Application Security Testing (SAST)**, **Software Composition Analysis (SCA)**, and **Container Image Scanning**.

# 🛠 Tech Stack

-    **Language:** Python 3.9
-    **Framework:** Flask
-    **Containerization:** Docker
-    **CI/CD:** GitHub Actions
-    **Security Tools:**
        * **Snyk:** Used for vulnerability scanning in dependencies and the Dockerfile.
        * **Trivy:** Used for scanning the final Docker image for OS-level vulnerabilities.

# 📂 Repository Structure

-    `app.py`: The main Flask application entry point.
-    `requirements.txt`: Python dependencies.
-    `Dockerfile`: Instructions to containerize the Flask application.
-    `.github/workflows/devsecops.yml`: The CI/CD pipeline definition that automates the build and security testing.

# 🛡️ Security Features (CI/CD Pipeline)

The GitHub Actions workflow is triggered on every push to the main branch and performs the following steps:

-    **Code Checkout:** Pulls the latest code from the repository.
-    **Snyk Auth & Scan:**
        - Authenticates with Snyk using a secret token.
        - Scans the Python environment for vulnerable packages.
        - Scans the Dockerfile for security misconfigurations.
-    **Docker Build:** Builds the image locally to prepare for scanning.
-    **Trivy Image Scan:** Scans the built Docker image for known vulnerabilities (CVEs) and provides a detailed report.
