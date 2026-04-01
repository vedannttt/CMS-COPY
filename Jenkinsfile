pipeline {
    agent any

    environment {
        IMAGE_NAME = "vedantga/canteen-management-system"
        IMAGE_TAG = "${BUILD_NUMBER}"
        EC2_HOST   = "15.206.73.198"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/vedannttt/CMS-COPY.git'
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
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push $IMAGE_NAME:$IMAGE_TAG
                        docker push $IMAGE_NAME:latest
                    '''
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(credentials: ['ec2-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@$EC2_HOST "
                            docker pull $IMAGE_NAME:latest &&
                            docker stop app || true &&
                            docker rm app || true &&
                            docker run -d --restart unless-stopped -p 80:80 --name app $IMAGE_NAME:latest
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