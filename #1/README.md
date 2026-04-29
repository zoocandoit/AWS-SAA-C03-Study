# #1

## 문제 1

### 문제

한 회사에서 300개 이상의 글로벌 웹사이트와 애플리케이션을 호스팅합니다.

이 회사는 매일 30TB 이상의 클릭스트림 데이터를 분석할 플랫폼이 필요합니다.

솔루션 설계자는 클릭스트림 데이터를 전송하고 처리하기 위해 무엇을 해야 합니까?

### 선택지

1. 데이터를 Amazon S3 버킷에 보관하고 데이터로 Amazon EMR 클러스터를 실행하여 분석을 생성하도록 AWS Data Pipeline을 설계합니다.
2. Amazon EC2 인스턴스의 Auto Scaling 그룹을 생성하여 데이터를 처리하고 Amazon Redshift가 분석에 사용할 수 있도록 Amazon S3 데이터 레이크로 보냅니다.
3. 데이터를 Amazon CloudFront에 캐시합니다. 데이터를 Amazon S3 버킷에 저장합니다. 객체가 S3 버킷에 추가될 때 AWS Lambda 함수를 실행하여 분석을 위해 데이터를 처리합니다.
4. Amazon Kinesis Data Streams에서 데이터를 수집합니다. Amazon Kinesis Data Firehose를 사용하여 데이터를 Amazon S3 데이터 레이크로 전송합니다. 분석을 위해 Amazon Redshift에 데이터를 로드합니다.

### 정답

4번

### 해설

대용량 클릭스트림 데이터는 실시간 또는 준실시간으로 안정적으로 수집하고, 분석용 저장소로 적재할 수 있어야 합니다.  
`Kinesis Data Streams`는 대량의 스트리밍 데이터를 낮은 지연 시간으로 수집하는 데 적합하고, `Kinesis Data Firehose`는 수집한 데이터를 `Amazon S3`나 `Amazon Redshift`로 거의 관리 없이 전달할 수 있습니다.

매일 30TB 이상의 데이터를 처리해야 하므로 확장성과 운영 편의성이 중요합니다. 따라서 스트리밍 수집, 적재, 분석까지 자연스럽게 이어지는 4번이 가장 적절합니다.

### 핵심 메모

- `Amazon Kinesis Data Streams`
  실시간 데이터 수집 및 처리를 위한 서비스로, 높은 처리량과 낮은 지연 시간을 제공한다.
- `Amazon Kinesis Data Firehose`
  스트리밍 데이터를 `S3`, `Redshift` 등으로 자동 전송할 수 있는 서비스다.
- `Amazon Redshift`
  대규모 분석에 적합한 데이터 웨어하우스 서비스다. 필요하면 `Redshift Spectrum`으로 `S3` 데이터도 직접 조회할 수 있다.

## 문제 2

### 문제

한 로봇 회사가 의료 수술을 위한 솔루션을 설계하고 있습니다.

로봇은 고급 센서, 카메라 및 AI 알고리즘을 사용하여 환경을 인식하고 수술을 완료합니다.

회사에는 백엔드 서비스와의 원활한 통신을 보장할 AWS 클라우드의 공용 로드 밸런서가 필요합니다.

로드 밸런서는 쿼리 문자열을 기반으로 트래픽을 다른 대상 그룹으로 라우팅할 수 있어야 합니다.

트래픽도 암호화되어야 합니다.

어떤 솔루션이 이러한 요구 사항을 충족합니까?

### 선택지

1. ACM(AWS Certificate Manager)에서 첨부된 인증서와 함께 Application Load Balancer를 사용합니다. 쿼리 매개변수 기반 라우팅을 사용합니다.
2. Network Load Balancer를 사용하십시오. AWS Identity and Access Management(IAM)에서 생성된 인증서를 가져옵니다. 인증서를 로드 밸런서에 연결합니다. 쿼리 매개변수 기반 라우팅을 사용합니다.
3. 게이트웨이 로드 밸런서를 사용합니다. AWS Identity and Access Management(IAM)에서 생성된 인증서를 가져옵니다. 인증서를 로드 밸런서에 연결합니다. HTTP 경로 기반 라우팅을 사용합니다.
4. ACM(AWS Certificate Manager)에서 첨부된 인증서와 함께 Network Load Balancer를 사용하십시오. 쿼리 매개변수 기반 라우팅을 사용합니다.

### 정답

1번

### 해설

요구 사항의 핵심은 두 가지입니다.

- `쿼리 문자열 기반 라우팅`
- `트래픽 암호화`

`Application Load Balancer(ALB)`는 7계층 로드 밸런서이므로 HTTP/HTTPS 요청의 경로, 헤더, 호스트, 쿼리 문자열 등을 기준으로 라우팅할 수 있습니다. 또한 `ACM` 인증서를 연결해 HTTPS 종료도 쉽게 구성할 수 있습니다.

반면 `Network Load Balancer(NLB)`는 4계층 중심이라 쿼리 문자열 기반 라우팅에 적합하지 않습니다. 따라서 1번이 정답입니다.

### 핵심 메모

- `Application Load Balancer`
  HTTP/HTTPS 트래픽에 적합하며, 쿼리 문자열·경로·헤더 기반 라우팅이 가능하다.
- `AWS Certificate Manager`
  SSL/TLS 인증서를 생성, 배포, 갱신할 수 있어 HTTPS 구성에 적합하다.

## 문제 3

### 문제

솔루션 설계자는 Amazon EC2 인스턴스를 호스팅하는 VPC 네트워크를 보호해야 합니다.

EC2 인스턴스는 매우 민감한 데이터를 포함하고 프라이빗 서브넷에서 실행됩니다.

회사 정책에 따라 VPC에서 실행되는 EC2 인스턴스는 타사 URL을 사용하는 소프트웨어 제품 업데이트를 위해 인터넷에서 승인된 타사 소프트웨어 리포지토리에만 액세스할 수 있습니다.

다른 인터넷 트래픽은 차단되어야 합니다.

어떤 솔루션이 이러한 요구 사항을 충족합니까?

### 선택지

1. 아웃바운드 트래픽을 AWS 네트워크 방화벽으로 라우팅하도록 프라이빗 서브넷의 라우팅 테이블을 업데이트합니다. 도메인 목록 규칙 그룹을 구성합니다.
2. AWS WAF 웹 ACL을 설정합니다. 소스 및 대상 IP주소 범위 집합을 기반으로 트래픽 요청을 필터링하는 사용자 지정 규칙 집합을 만듭니다.
3. 엄격한 인바운드 보안 그룹 규칙을 구현합니다. URL을 지정하여 인터넷에서 승인된 소프트웨어 리포지토리에 대한 트래픽만 허용하는 아웃바운드 규칙을 구성합니다.
4. EC2 인스턴스 앞에 Application Load Balancer(ALB)를 구성합니다. 모든 아웃바운드 트래픽을 ALB로 보냅니다. 인터넷에 대한 아웃바운드 액세스를 위해 ALB의 대상 그룹에서 URL 기반 규칙 리스너를 사용합니다.

### 정답

1번

### 해설

요구 사항은 `특정 타사 URL만 허용`하고, 그 외 인터넷 트래픽은 모두 차단하는 것입니다.  
이때 보안 그룹은 도메인 이름 기반 제어를 직접 지원하지 않고, `AWS WAF`는 웹 애플리케이션 보호용이므로 EC2의 일반 아웃바운드 제어 목적에 맞지 않습니다.

`AWS Network Firewall`은 VPC 차원에서 트래픽을 검사하고 제어할 수 있으며, 도메인 목록 규칙을 통해 허용할 URL 기반 정책을 적용할 수 있습니다. 따라서 프라이빗 서브넷의 아웃바운드 트래픽을 네트워크 방화벽으로 보내고, 승인된 리포지토리만 허용하는 구성이 가장 적절합니다.

### 핵심 메모

- `AWS WAF`
  주로 HTTP/HTTPS 웹 애플리케이션 보호에 사용된다.
- `Security Group`
  인스턴스 수준의 트래픽 제어는 가능하지만, URL 기반 제어에는 적합하지 않다.
- `AWS Network Firewall`
  네트워크 레벨에서 상태 기반 검사와 도메인 기반 필터링을 제공한다.

## 키워드

- Kinesis Data Streams
- Kinesis Data Firehose
- Redshift
- Application Load Balancer
- ACM
- AWS Network Firewall
- WAF
- Security Group
