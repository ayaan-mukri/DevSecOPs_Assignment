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
                git branch: 'main', url: 'https://github.com/ayaan-mukri/DevSecOPs_Assignment.git'
            }
        }

        stage('Security Scan (Trivy)') {
            steps {
                sh '''
                  if ! command -v trivy &> /dev/null; then
                    curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
                  fi
                  trivy config . --severity HIGH,CRITICAL || true
                '''
            }
        }

        stage('Infrastructure (Terraform)') {
            steps {
                dir('terraform') {
                    sh '''
                    # 1. Install Terraform if not present
                    if ! command -v terraform &> /dev/null; then
                        curl -LO https://releases.hashicorp.com/terraform/1.6.6/terraform_1.6.6_linux_amd64.zip
                        unzip -o terraform_1.6.6_linux_amd64.zip
                        mv terraform /usr/local/bin/
                    fi

                    # 2. Get the current Public IP of the Jenkins agent
                    # We add /32 to make it a valid CIDR block for AWS
                    CURRENT_IP=$(curl -s https://checkip.amazonaws.com)/32
                    echo "Deploying with allowed SSH IP: $CURRENT_IP"

                    # 3. Initialize and Apply with the variable
                    terraform init
                    terraform apply -var="my_ip=$CURRENT_IP" -auto-approve
                    '''
                }
            }
        }

        stage('Deploy Frontend (Docker)') {
            steps {
                echo 'Deploying React Frontend via Docker Compose...'
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