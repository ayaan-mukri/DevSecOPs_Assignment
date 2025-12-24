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
        * **Trivy:** Used for scanning the final Docker image for OS-level vulnerabilities.

# 📂 Repository Structure

Based on the project files, the repository is organized as follows:
-    `public/`: Static assets including `index.html`, `favicon.ico`, and manifest files.
-    `src/`: The core React application logic, containing `App.js`, `index.js`, and associated CSS styles.
-    `terraform/`: **Infrastructure as Code (IaC)** files, specifically `main.tf`, used to provision the required cloud environment.
-    `Jenkinsfile`: Defines the automation pipeline for building, testing and deploying the application via **Jenkins**.
-    `Dockerfile` & `docker-compose.yml`: Configuration files for containerizing the application for consistent development and production environments.
-    `package.json`: Lists the project dependencies and scripts for the React frontend.

# 🛡️ Security Features (CI/CD Pipeline)

The GitHub Actions workflow is triggered on every push to the main branch and performs the following steps:
-    **Code Checkout:** Pulls the latest code from the repository.
-    **Docker Build:** Builds the image locally to prepare for scanning.
-    **Trivy Image Scan:** Scans the built Docker image for known vulnerabilities **(CVEs)** and provides a detailed report.

# 🔍Trivy Findings & Remediation Summary

During the CI/CD process, we integrated Trivy to perform static analysis security testing (SAST) on both our infrastructure and application layers. Below is a summary of the critical findings and the steps taken to secure the environment.
**Infrastructure (Terraform) Findings**
-    **Finding (AVD-AWS-0107):** SSH Port 22 was found open to the public internet `(0.0.0.0/0)`.
        - **Remediation:** Refactored `main.tf` to use a variable `my_ip`. The Jenkins pipeline now dynamically fetches the agent's IP and restricts SSH access to that specific address using a **/32 CIDR** block.
-    **Finding (AVD-AWS-0104):** Unrestricted Egress traffic.
        - **Remediation:** While maintained for development flexibility (to allow Docker image pulls), security groups were structured to prioritize stateful tracking.
-    **Finding (AVD-AWS-0028): Instance Metadata Service (IMDS) v1** was enabled.
        - **Remediation:** Hardened the EC2 instance by adding `metadata_options` requiring `http_tokens = "required"` **(IMDSv2)**.
-    **Finding (AVD-AWS-0131):** Unencrypted Root Volume.
        - **Remediation:** Modified the `root_block_device` block in **Terraform** to set `encrypted = true`.

# 🧠Generative AI Integration

This project utilized **Generative AI (Gemini 2.0 Flash)** as a DevSecOps thought partner to accelerate the development lifecycle and ensure industry-standard security practices.
How AI was Utilized:
-    **Pipeline Architecture:** AI was used to brainstorm the integration of Terraform within a Jenkins declarative pipeline, specifically handling the dynamic installation of binaries (terraform, trivy, docker-compose) in a minimal root environment.
-    **Error Debugging:** AI assisted in resolving complex **"Exit Code 127"** errors by identifying missing dependencies (like `wget`) and suggesting robust alternatives like curl.
-    **Security Logic:** AI acted as a security consultant to interpret **Trivy** scan results, providing the specific **HCL (HashiCorp Configuration Language)** and **Dockerfile** syntax required to remediate **High** and **Critical** vulnerabilities.
-    **Troubleshooting Network Connectivity:** AI provided step-by-step guidance on debugging SSH timeouts and **Security Group** logic, helping to differentiate between Jenkins-side access and local developer access.
-    [AI Usage Log](https://docs.google.com/document/d/1bAtxdVb9GrVRMFzLtR2jNDFWMtfcCT9wBkpPAJuZGXY/edit?usp=sharing)

# 📃Build Failure and Success Screenshots
The project implements a robust, end-to-end Jenkins Pipeline designed to handle both successful deployments and failure contingencies. This DevSecOps lifecycle automates everything from source code checkout and Trivy security scanning to automated infrastructure provisioning via Terraform and containerized deployment.
-    [Success Build](https://docs.google.com/document/d/199mCMPFUOpwwnF3GIabmaK0iLWBinJeeM_wZWHwHC5Y/edit?usp=sharing)
-    [Failure Build](https://docs.google.com/document/d/1xdtL-4bJLXLQy3138gTtKHeUDSROtXXSY6MEtUV_5Is/edit?usp=sharing)

# 🖇️Public IP for deployed website
-    **Hosted Website:** http://13.219.183.89:3000/
