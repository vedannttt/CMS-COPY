pipeline {
    agent any

    environment {
        // REPLACE 'yourdockerhubusername' with your actual Docker Hub username
        IMAGE_NAME = "vedantga/canteen-management-system"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                // REPLACE the URL below with your actual GitHub repository URL
                git branch: 'main',
                    url: 'https://github.com/vedannttt/CMS-COPY'
            }
        }

        stage('Install Dependencies') {
            agent {
                docker {
                    image 'node:20-alpine'
                    args '-u root:root'
                }
            }
            steps {
                // Tells Jenkins to go into the frontend folder before running npm
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build App') {
            agent {
                docker {
                    image 'node:20-alpine'
                    args '-u root:root'
                }
            }
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('frontend') {
                    sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
                    sh 'docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push $IMAGE_NAME:$IMAGE_TAG'
                    sh 'docker push $IMAGE_NAME:latest'
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    // REPLACE 'YOUR_EC2_PUBLIC_IP' with your actual AWS EC2 Public IPv4 address
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@15.206.73.198 "
                      docker pull $IMAGE_NAME:latest &&
                      docker stop canteen-app || true &&
                      docker rm canteen-app || true &&
                      docker run -d --name canteen-app -p 80:80 $IMAGE_NAME:latest
                    "
                    '''
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}