pipeline {
    agent any

    environment {
        // These refer to the IDs you set in Jenkins Credentials
        AWS_ACCESS_KEY_ID     = credentials('aws-access-key')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-key')
        AWS_DEFAULT_REGION    = 'us-east-1'
    }

    stages {
        stage('Checkout') {
            steps {
                cleanWs()
                // Points to YOUR new repository
                git branch: 'main', url: 'https://github.com/ayaan-mukri/DevSecOPs_Assignment.git'
            }
        }

        stage('Security Scan (Trivy)') {
            steps {
                sh '''
                  # Install Trivy only if not present
                  if ! command -v trivy &> /dev/null; then
                    curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
                  fi
                  # Scan the current directory
                  trivy config . --severity HIGH,CRITICAL || true
                '''
            }
        }

        stage('Infrastructure (Terraform)') {
            steps {
                // Ensure your main.tf is inside a folder named 'terraform'
                dir('terraform') {
                    sh '''
                    # Check if terraform is installed, if not, download using curl
                    if ! command -v terraform &> /dev/null; then
                        curl -LO https://releases.hashicorp.com/terraform/1.6.6/terraform_1.6.6_linux_amd64.zip
                        unzip -o terraform_1.6.6_linux_amd64.zip
                        mv terraform /usr/local/bin/
                    fi
                    terraform init
                    terraform apply -auto-approve
                    '''
                }
            }
        }

        stage('Deploy Frontend (Docker)') {
            steps {
                echo 'Deploying React Frontend via Docker Compose...'
                // Cleans up old container and builds the new one
                sh 'docker-compose down || true'
                sh 'docker-compose up -d --build'
            }
        }
    }

    post {
        success {
            echo "Successfully deployed! Access your app at http://<AWS_IP>:3000"
        }
        failure {
            echo "Deployment failed. Check Console Output for errors."
        }
    }
}