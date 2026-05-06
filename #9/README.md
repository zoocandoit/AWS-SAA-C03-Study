# #9

## 문제 1

### 문제

회사에서 Amazon API Gateway 및 AWS Lambda를 사용하는 공개적으로 액세스 가능한 서버리스 애플리케이션을 실행하고 있습니다.

최근 애플리케이션의 트래픽이 봇넷의 사기성 요청으로 인해 급증했습니다.

승인되지 않은 사용자의 요청을 차단하기 위해 솔루션 설계자는 어떤 단계를 수행해야 합니까? (두 가지를 선택하세요.)

### 선택지

1. 정품 API 사용자에게만 공유되는 키로 사용량 계획을 생성합니다.
2. 사기성 IP 주소의 요청을 무시하도록 Lambda 함수 내에 논리를 통합합니다.
3. 악성 요청을 대상으로 AWS WAF 하는 규칙을 구현하고 이를 필터링하는 작업을 트리거합니다.
4. 기존 공개 API를 비공개로 전환합니다. DNS 레코드를 업데이트하여 사용자를 새 API 엔드포인트로 리디렉션합니다.
5. API에 액세스를 시도하는 각 사용자에 대해 IAM 역할을 생성합니다. 사용자는 API 호출 시 역할을 맡게 됩니다.

### 정답

1번, 3번

### 해설

문제의 핵심은 `공개 API`, `봇넷의 사기성 요청`, `승인되지 않은 사용자 차단`입니다.  
`Amazon API Gateway`의 사용량 계획과 API 키를 사용하면 정상 사용자에게만 키를 배포하고, 키가 없는 요청을 제한할 수 있습니다. 또한 `AWS WAF`를 API Gateway와 연결하면 IP 주소, 요청 패턴, 속도 기반 조건 등을 기준으로 악성 요청을 필터링할 수 있습니다.

Lambda 함수 내부에서 차단 로직을 처리하면 이미 Lambda가 호출된 뒤라 비용과 부하를 줄이기 어렵습니다. 공개 API를 비공개 API로 전환하면 인터넷 사용자가 직접 접근할 수 없으므로 요구 사항과 맞지 않을 수 있습니다. 각 사용자에게 IAM 역할을 만들고 역할을 맡게 하는 방식은 공개 API 사용자 관리 방식으로 운영 부담이 큽니다.

### 핵심 메모

- `AWS WAF`
  API Gateway, CloudFront, ALB 등에 연결해 웹 요청을 규칙 기반으로 차단할 수 있다.
- `API Gateway Usage Plan`
  API 키와 사용량 제한을 통해 허가된 클라이언트의 API 사용을 제어할 수 있다.
- `Lambda 내부 차단`
  요청이 이미 백엔드까지 도달한 뒤 처리되므로 봇 트래픽 방어의 우선 해법이 아니다.

## 문제 2

### 문제

회사는 Amazon EC2 인스턴스 플릿에서 3계층 전자상거래 애플리케이션을 호스팅합니다.

인스턴스는 Application Load Balancer(ALB) 뒤의 Auto Scaling 그룹에서 실행됩니다.

모든 전자상거래 데이터는 MariaDB 다중 AZ DB 인스턴스용 Amazon RDS에 저장됩니다.

회사는 트랜잭션 중에 고객 세션 관리를 최적화하려고 합니다.

애플리케이션은 세션 데이터를 지속적으로 저장해야 합니다.

이러한 요구 사항을 충족하는 솔루션은 무엇입니까? (두 가지를 선택하세요.)

### 선택지

1. ALB에서 고정 세션 기능 세션 선호도를 켭니다.
2. Amazon DynamoDB 테이블을 사용하여 고객 세션 정보를 저장합니다.
3. Amazon Cognito 사용자 풀을 배포하여 사용자 세션 정보를 관리합니다.
4. Amazon ElastiCache for Redis 클러스터를 배포하여 고객 세션 정보를 저장합니다.
5. 애플리케이션에서 AWS Systems Manager Application Manager를 사용하여 사용자 세션 정보를 관리합니다.

### 정답

2번, 4번

### 해설

요구 사항은 `Auto Scaling 환경`, `고객 세션 관리 최적화`, `세션 데이터의 지속적 저장`입니다.  
세션 데이터는 개별 EC2 인스턴스의 메모리나 로컬 디스크에 저장하지 않고 외부 저장소에 저장해야 Auto Scaling으로 인스턴스가 교체되거나 증가해도 세션을 유지할 수 있습니다. `Amazon DynamoDB`는 확장성과 내구성이 높은 NoSQL 저장소로 세션 데이터 저장에 적합합니다. `Amazon ElastiCache for Redis`는 매우 빠른 인메모리 액세스를 제공하며 세션 스토어로 자주 사용됩니다.

ALB 고정 세션은 같은 사용자를 동일한 인스턴스로 보내는 데는 도움이 되지만, 인스턴스 장애나 교체 시 세션 데이터가 지속적으로 보존되는 구조는 아닙니다. Cognito 사용자 풀은 사용자 인증과 사용자 관리에 적합하지만 애플리케이션의 트랜잭션 세션 데이터를 저장하는 용도는 아닙니다. Systems Manager Application Manager도 세션 관리 서비스가 아닙니다.

### 핵심 메모

- `Amazon DynamoDB`
  확장성과 내구성이 필요한 세션 저장소로 사용할 수 있다.
- `ElastiCache for Redis`
  빠른 세션 조회와 갱신이 필요한 애플리케이션에 적합하다.
- `Sticky Session`
  요청 라우팅에는 도움이 되지만 세션 데이터를 지속적으로 저장하는 해법은 아니다.

## 문제 3

### 문제

회사에서 5개의 Amazon EC2 인스턴스에 애플리케이션을 배포합니다.

ALB(Application Load Balancer)는 대상 그룹을 사용하여 인스턴스에 트래픽을 분산합니다.

각 인스턴스의 평균 CPU 사용량은 대부분 10% 미만이며 때때로 65%까지 급증합니다.

솔루션 설계자는 애플리케이션의 확장성을 자동화하는 솔루션을 구현해야 합니다.

솔루션은 아키텍처의 비용을 최적화하고 급증이 발생할 때 애플리케이션에 충분히 CPU 리소스가 있는지 확인해야 합니다.

이러한 요구 사항을 충족하는 솔루션은 무엇입니까?

### 선택지

1. CPUUtilization 20% 미만일 때 ALARM 상태로 돌아가는 Amazon CloudWatch 경보를 생성합니다. ALB 대상 그룹의 EC2 인스턴스 중 하나를 종료하기 위해 CloudWatch 경보가 호출하는 AWS Lambda 함수를 호출합니다.
2. EC2 Auto Scaling 그룹을 생성합니다. 기존 ALB를 로드 밸런서로 선택하고 기존 대상 그룹을 선택합니다. ASGAverageCPUUtilization 지표를 기반으로 하는 대상 추적 조정 정책을 생성합니다. 최소 인스턴스를 2로, 원하는 용량을 3으로, 최대 인스턴스를 6으로, 목표 값을 50%로 설정합니다. Auto Scaling 그룹에 EC2 인스턴스를 추가합니다.
3. EC2 Auto Scaling 그룹을 생성합니다. 기존 ALB를 로드 밸런서로 선택하고 기존 대상 그룹을 대상 그룹으로 선택합니다. 최소 인스턴스를 2로, 원하는 용량을 3으로 최대 인스턴스를 6으로 설정합니다. Auto Scaling 그룹에 EC2 인스턴스를 추가합니다.
4. 두 개의 Amazon CloudWatch 경보를 생성합니다. 평균 CPUUtilization 20% 미만일 때 ALARM 상태로 들어가도록 첫 번째 CloudWatch 경보를 구성합니다. 평균 CPUUtilization 지표가 50%를 초과하면 ALARM 상태로 들어가도록 두 번째 CloudWatch 경보를 구성합니다. 이메일 메시지를 보내기 위해 Amazon Simple Notification Service(Amazon SNS) 주제에 게시하도록 경보를 구성합니다. 메시지를 받은 후 로그인하여 실행 중인 EC2 인스턴스 수를 줄이거나 늘립니다.

### 정답

2번

### 해설

문제의 핵심은 `자동 확장`, `비용 최적화`, `CPU 급증 시 충분한 리소스 확보`입니다.  
`EC2 Auto Scaling` 그룹에 기존 ALB 대상 그룹을 연결하고, `대상 추적 조정 정책`을 사용하면 평균 CPU 사용률이 목표 값에 가깝게 유지되도록 인스턴스 수를 자동으로 늘리거나 줄일 수 있습니다. 최소, 원하는, 최대 용량을 설정하면 평소에는 비용을 줄이고, CPU 사용률이 급증할 때는 인스턴스를 확장할 수 있습니다.

Lambda로 인스턴스를 직접 종료하는 방식은 Auto Scaling의 상태 관리와 충돌할 수 있고 확장 정책으로 적절하지 않습니다. Auto Scaling 그룹만 만들고 조정 정책을 만들지 않으면 CPU 변화에 따라 자동 조정되지 않습니다. SNS 알림 후 사람이 직접 조정하는 방식은 자동화 요구 사항을 충족하지 못합니다.

### 핵심 메모

- `EC2 Auto Scaling`
  수요에 따라 EC2 인스턴스 수를 자동으로 조정한다.
- `Target Tracking Scaling Policy`
  CPU 사용률 같은 지표를 목표 값에 맞추도록 자동 확장과 축소를 수행한다.
- `ALB Target Group`
  Auto Scaling 그룹과 연결해 새 인스턴스를 로드 밸런서 대상에 자동 등록할 수 있다.

## 키워드

- Amazon API Gateway
- AWS Lambda
- AWS WAF
- Usage Plan
- API Key
- Bot Traffic
- Amazon DynamoDB
- ElastiCache for Redis
- Sticky Session
- Amazon Cognito
- EC2 Auto Scaling
- Application Load Balancer
- Target Tracking Scaling Policy
- CloudWatch
