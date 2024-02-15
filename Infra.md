# Speechless Infra Setting

##

## 배포

### 우분투 서버 기본 세팅
- 우분투 서버의 시간을 한국 표준시로 변경 (UTC+9)
```shell
sudo timedatectl set-timezone Asia/Seoul
```

- 미러 서버를 카카오 서버로 변경
```shell
sudo sed -i 's/ap-northeast-2.ec2.archive.ubuntu.com/mirror.kakao.com/g' /etc/apt/sources.list
```

## MySQL 설치
```shell
sudo apt-get install mysql-server
```

## JAVA17 설치
```shell
sudo apt-get install openjdk-17-jdk
```

## NGINX  설치

```shell
sudo apt-get -y install nginx
```

### SPA 설정
- nginx는 기본 설정으로 SPA를 지원하지 않아 추가 설정 필요
- 아래 경로의 설정 파일을 수정
    - ```try_files $uri $uri/ =404;``` 를
      ```try_files $uri $uri/ /index.html =404;``` 로 변경

```shell
sudo vim /etc/nginx/sites-available/default
```

- 설정 파일 수정 완료 후 Nginx 재시작
```shell
sudo systemctl reload nginx
```

## SSL 인증서 발급
- WebRTC를 사용하기 위해서 HTTPS로 접근 필요

## CertBot 설치 및 인증서 발급
```shell
sudo snap install --classic certbot
sudo apt-add-repository -r ppa:certbot/certbot
sudo apt-get -y install python3-certbot-nginx
sudo certbot --nginx -d <도메인 이름>
```

### Nginx deafult.conf
- Nginx 설정 확인 및 변경
```shell
server {
        root /var/www/html;
        # Add index.php to the list if you are using PHP
        index index.html index.htm index.nginx-debian.html;
        server_name i10a806.p.ssafy.io; # managed by Certbot
        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                try_files $uri $uri/ /index.html  =404;
        }
    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/i10a806.p.ssafy.io/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/i10a806.p.ssafy.io/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
server {
    if ($host = i10a806.p.ssafy.io) {
        return 301 https://$host$request_uri;
    } # managed by Certbot
        listen 80 ;
        listen [::]:80 ;
    server_name i10a806.p.ssafy.io;
    return 404; # managed by Certbot

}
```

### Nginx 내 페이지 배포
- 빌드 후 산출물이 저장된 dist 폴더 내 파일을 nginx로 이동
```shell
cp -r <프로젝트 폴더>/frontend/dist/* /var/www/html/
```
- 바로 반영되지 않는 경우, 브라우저의 캐시를 삭제 후 NGINX를 재시작

## Jenkins 설치
- Long Term Support release version / Ubuntu
```shell
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt-get update
sudo apt-get install jenkins
```
- Start Jenkins
```shell
sudo systemctl start jenkins
sudo systemctl status jenkins
```

#### Jenkins Port 변경
```shell
sudo ufw allow 8081
sudo vim /etc/default/jenkins
sudo chmod 777 /usr/lib/systemd/system/jenkins.service
sudo vim /usr/lib/systemd/system/jenkins.service
# Environment="JENKINS_PORT=8081" 로 변경
sudo chmod 444 /usr/lib/systemd/system/jenkins.service
sudo service jenkins restart
```
- Jenkins 권한 부여
```shell
sudo chown -R jenkins:jenkins .
```

### Jenkins Pipeline 구성
- BE, FE 분리되어 작성되어 있음 아래는 BE 기준으로 작성되었음.
```
pipeline {
    agent any
    tools {
        gradle 'gradle'
    }
    
    stages {
        stage('check repository') {
            steps {
                git branch: 'develop-backend',
                credentialsId: 'hyunnique_gitlab',
                url: 'https://lab.ssafy.com/s10-webmobile1-sub2/S10P12A806'
            }
        }
        stage('Copy setting file'){
            steps{
                sh '''
                    cp /home/ubuntu/backend-yml/application-prod.yml /var/lib/jenkins/workspace/Speechless/backend/src/main/resources
                    cp /home/ubuntu/backend-yml/application.yml /var/lib/jenkins/workspace/Speechless/backend/src/main/resources
                    cp /home/ubuntu/backend-yml/keystore.p12 /var/lib/jenkins/workspace/Speechless/backend/src/main/resources
                '''
            }
        }
        stage('build project') {
            steps {
                dir('backend') {
                    sh '''
                        rm -rf /var/lib/jenkins/workspace/Speechless/backend/build/*
                        chmod +x ./gradlew
                        ./gradlew clean build
                    '''
                }
            }
        }

        stage('deploy release') {
            steps {
                dir('backend/build/libs') { 
                    sh ''' 
                        sudo systemctl restart speechless.service
                    '''
                    
                }
            }
        }
        
    }
    post {
        success {
        	script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend (color: 'good', 
                message: "빌드 성공: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)", 
                endpoint: 'https://meeting.ssafy.com/hooks/64qscr66xpbjub4qdc6xwr6maw', 
                channel: 'A806-Alert'
                )
            }
        }
        failure {
        	script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend (color: 'danger', 
                message: "빌드 실패: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)", 
                endpoint: 'https://meeting.ssafy.com/hooks/64qscr66xpbjub4qdc6xwr6maw', 
                channel: 'A806-Alert'
                )
            }
        }
    }
}
```

### speechless.service unit 등록
```shell
sudo vi /etc/systemd/system/speechless.service
```
- speechless service
- unit 파일로 등록하는 이유 -> 자동시작, 사용자 정의 실행, 서비스 관리, 자동 재시작, 종료 상태관리
```
[Unit]
Description=Speechless Service
After=network.target

[Service]
User=jenkins
ExecStart=/usr/bin/java -jar /var/lib/jenkins/workspace/Speechless/backend/build/libs/speechless-0.0.1-SNAPSHOT.war
SuccessExitStatus=143
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```
- 데몬 리로드 및 재시작
```shell
sudo systemctl daemon-reload
sudo systemctl speechless.service
sudo systemctl enable speechless.service
sudo systemctl start speechless.service
```

## OpenVidu 설치
- 포트 설정
```shell
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3478/tcp
ufw allow 3478/udp
ufw allow 40000:57000/tcp
ufw allow 40000:57000/udp
ufw allow 57001:65535/tcp
ufw allow 57001:65535/udp
```

- 폴더 이동 및 설치
```shell
cd /opt
curl https://s3-eu-west-1.amazonaws.com/aws.openvidu.io/install_openvidu_latest.sh | bash
```

- SSL 적용
```shell
cd /opt/openvidu/owncert
# 발급받은 키를 복사 후 해당 폴더에 붙여넣기
```
- OpenVidu 설정 변경
```shell
cd /opt/openvidu
sudo vi .env
```
- 변경사항 적용 후 restart
```
DOMAIN_OR_PUBLIC_IP=i10a806.p.ssafy.io
OPENVIDU_SECRET=deer4
CERTIFICATE_TYPE=owncert
HTTP_PORT=4442
HTTPS_PORT=4443
```