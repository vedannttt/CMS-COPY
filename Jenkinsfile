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
                    url: 'https://github.com/vedannttt/CMS-COPY.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                // We let the Dockerfile handle npm install and build!
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
    withCredentials([file(credentialsId: 'ec2-pem', variable: 'PEM_FILE')]) {
        sh '''
        chmod 400 $PEM_FILE

        ssh -o StrictHostKeyChecking=no -i $PEM_FILE ubuntu@15.206.73.198 "
            docker pull vedantga/canteen-management-system:latest &&
            docker stop app || true &&
            docker rm app || true &&
            docker run -d -p 80:80 --name app vedantga/canteen-management-system:latest
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
