# #8

## 문제 1

### 문제

회사는 웹 사이트에서 항목의 검색 가능한 저장소를 유지 관리합니다.

데이터는 1,000만 개 이상의 행을 포함하는 Amazon RDS for MySQL 데이터베이스 테이블에 저장됩니다.

데이터베이스에는 2TB의 범용 SSD 스토리지가 있습니다.

회사 웹 사이트를 통해 매일 이 데이터에 대한 수백만 건의 업데이트가 있습니다.

회사는 일부 삽입 작업이 10초 이상 걸리는 것을 발견했습니다. 회사는 데이터베이스 스토리지 성능이 문제라고 판단했습니다.

이 성능 문제를 해결하는 솔루션은 무엇입니까?

### 선택지

1. 스토리지 유형을 프로비저닝된 IOPS SSD로 변경합니다.
2. DB 인스턴스를 메모리 최적화 인스턴스 클래스로 변경합니다.
3. DB 인스턴스를 버스트 가능한 성능 인스턴스 클래스로 변경합니다.
4. MySQL 기본 비동기 복제로 다중 AZ RDS 읽기 복제본을 활성화합니다.

### 정답

1번

### 해설

문제의 핵심은 `스토리지 성능 문제`로 인해 삽입 작업이 느려졌다는 점입니다.  
Amazon RDS의 `Provisioned IOPS SSD`는 일관된 높은 I/O 성능이 필요한 데이터베이스 워크로드에 적합합니다. 매일 수백만 건의 업데이트가 발생하는 환경에서는 범용 SSD보다 필요한 IOPS를 명시적으로 프로비저닝하는 방식이 쓰기 성능을 안정적으로 확보하는 데 유리합니다.

메모리 최적화 인스턴스는 메모리 부족이나 캐싱 문제가 원인일 때 고려할 수 있지만, 이 문제에서는 스토리지 성능이 원인이라고 명시되어 있습니다. 버스트 가능한 인스턴스는 지속적인 고성능 쓰기 워크로드에 적합하지 않습니다. 읽기 복제본은 읽기 부하 분산에는 도움이 되지만 삽입 성능 문제를 직접 해결하지 못합니다.

### 핵심 메모

- `Provisioned IOPS SSD`
  높은 I/O 성능과 일관된 지연 시간이 필요한 RDS 워크로드에 적합하다.
- `General Purpose SSD`
  범용 워크로드에는 적합하지만, 지속적인 대량 쓰기에서는 IOPS 한계가 병목이 될 수 있다.
- `Read Replica`
  읽기 확장에는 유용하지만 쓰기 성능 병목 해결책은 아니다.

## 문제 2

### 문제

회사에서 UDP 연결을 사용하는 VoIP(Voice over Internet Protocol) 서비스를 제공합니다.

이 서비스는 Auto Scaling 그룹에서 실행되는 Amazon EC2 인스턴스로 구성됩니다.

이 회사는 여러 AWS 지역에 배포했습니다.

회사는 지연 시간이 가장 짧은 리전으로 사용자를 라우팅해야 합니다.

회사는 또한 리전 간에 자동화된 장애 조치가 필요합니다.

이러한 요구 사항을 충족하는 솔루션은 무엇입니까?

### 선택지

1. NLB(Network Load Balancer) 및 연결된 대상 그룹을 배포합니다. 대상 그룹을 Auto Scaling 그룹과 연결합니다. 각 리전에서 NLB를 AWS Global Accelerator 엔드포인트로 사용합니다.
2. ALB(Application Load Balancer) 및 연결된 대상 그룹을 배포합니다. 대상 그룹을 Auto Scaling 그룹과 연결합니다. 각 리전에서 ALB를 AWS Global Accelerator 엔드포인트로 사용합니다.
3. NLB(Network Load Balancer) 및 연결된 대상 그룹을 배포합니다. 대상 그룹을 Auto Scaling 그룹과 연결합니다. 각 NLB의 별칭을 가리키는 Amazon Route 53 지연 시간 레코드를 생성합니다. 지연 시간 레코드를 오리진으로 사용하는 Amazon CloudFront 배포를 생성합니다.
4. ALB(Application Load Balancer) 및 연결된 대상 그룹을 배포합니다. 대상 그룹을 Auto Scaling 그룹과 연결합니다. 각 ALB의 별칭을 가리키는 Amazon Route 53 가중치 레코드를 생성합니다. 가중 레코드를 오리진으로 사용하는 Amazon CloudFront 배포를 배포합니다.

### 정답

1번

### 해설

문제의 핵심은 `UDP 기반 VoIP`, `가장 낮은 지연 시간`, `리전 간 자동 장애 조치`입니다.  
`AWS Global Accelerator`는 AWS 글로벌 네트워크를 사용해 사용자를 가장 성능이 좋은 엔드포인트로 라우팅하고, 엔드포인트 상태를 확인해 장애 발생 시 다른 리전으로 자동 장애 조치를 수행할 수 있습니다. UDP 트래픽에는 `Network Load Balancer`가 적합하므로 각 리전의 NLB를 Global Accelerator 엔드포인트로 구성하는 방식이 요구 사항에 가장 잘 맞습니다.

`Application Load Balancer`는 HTTP/HTTPS 트래픽에 최적화되어 UDP VoIP 트래픽에 적합하지 않습니다. `CloudFront`는 HTTP 기반 콘텐츠 전송에 적합하며 UDP VoIP 트래픽의 오리진 라우팅 솔루션으로 사용할 수 없습니다.

### 핵심 메모

- `AWS Global Accelerator`
  글로벌 네트워크를 통해 지연 시간을 줄이고 리전 간 자동 장애 조치를 제공한다.
- `Network Load Balancer`
  TCP, UDP, TLS 트래픽 처리에 적합하며 낮은 지연 시간이 필요한 서비스에 사용한다.
- `Application Load Balancer`
  HTTP/HTTPS 기반 애플리케이션 계층 로드 밸런싱에 적합하다.

## 문제 3

### 문제

회사에는 매일 총 1TB의 상태 알림을 생성하는 수천 개의 에지 장치가 있습니다.

각 알림의 크기는 약 2KB입니다.

솔루션 설계자는 향후 분석을 위해 경고를 수집하고 저장하는 솔루션을 구현해야 합니다.

회사는 고가용성 솔루션을 원합니다.

그러나 회사는 비용을 최소화해야 하며 추가 인프라를 관리하기를 원하지 않습니다.

또한 회사는 즉각적인 분석을 위해 14일간의 데이터를 유지하고 14일보다 오래된 모든 데이터를 보관하기를 원합니다.

이러한 요구 사항을 충족하는 운영상 가장 효율적인 솔루션은 무엇입니까?

### 선택지

1. Amazon Kinesis Data Firehose 전송 스트림을 생성하여 알림을 수집합니다. Amazon S3 버킷에 알림을 전달하도록 Kinesis Data Firehose 스트림을 구성합니다. 14일 후에 데이터를 Amazon S3 Glacier로 전환하도록 S3 수명 주기 구성을 설정합니다.
2. 두 가용 영역에서 Amazon EC2 인스턴스를 시작하고 이를 Elastic Load Balancer 뒤에 배치하여 알림을 수집합니다. Amazon S3 버킷에 알림을 저장할 EC2 인스턴스에서 스크립트를 생성합니다. 14일 후에 데이터를 Amazon S3 Glacier로 전환하도록 S3 수명 주기 구성을 설정합니다.
3. Amazon Kinesis Data Firehose 전송 스트림을 생성하여 알림을 수집합니다. Amazon OpenSearch Service(Amazon Elasticsearch Service) 클러스터에 알림을 전달하도록 Kinesis Data Firehose 스트림을 구성합니다. 매일 수동 스냅샷을 생성하고 14일보다 오래된 클러스터에서 데이터를 삭제하도록 Amazon OpenSearch Service(Amazon Elasticsearch Service) 클러스터를 설정합니다.
4. 알림을 수집할 Amazon Simple Queue Service(Amazon SQS) 표준 대기열을 생성하고 메시지 보존 기간을 14일로 설정합니다. 소비자가 SQS 대기열을 폴링하고 메시지 수명을 확인하고 필요에 따라 메시지 데이터를 분석하도록 구성합니다. 메시지가 14일이 지난 경우 소비자는 메시지를 Amazon S3 버킷에 복사하고 SQS 대기열에서 메시지를 삭제해야 합니다.

### 정답

1번

### 해설

요구 사항은 `수천 개 장치의 대량 알림 수집`, `고가용성`, `최소 비용`, `인프라 관리 없음`, `14일 이후 보관`입니다.  
`Amazon Kinesis Data Firehose`는 서버리스 방식으로 스트리밍 데이터를 수집하고 Amazon S3 같은 대상으로 전달할 수 있습니다. S3에 저장하면 Athena 같은 서버리스 분석 도구로 즉시 분석할 수 있고, `S3 Lifecycle Policy`를 사용해 14일이 지난 데이터를 S3 Glacier로 자동 전환할 수 있습니다.

EC2 기반 수집기는 직접 인스턴스와 스크립트를 운영해야 하므로 운영 오버헤드가 큽니다. OpenSearch는 검색과 분석에는 강력하지만 클러스터 비용과 운영 부담이 커서 비용 최소화 요구 사항에 맞지 않습니다. SQS는 메시지 보존 목적의 장기 분석 저장소가 아니며, 소비자 애플리케이션을 별도로 운영해야 합니다.

### 핵심 메모

- `Kinesis Data Firehose`
  스트리밍 데이터를 서버리스 방식으로 수집하고 S3, OpenSearch, Redshift 등으로 전달할 수 있다.
- `Amazon S3`
  대량 데이터 저장에 비용 효율적이며 Athena를 통한 즉시 분석에도 적합하다.
- `S3 Lifecycle Policy`
  일정 기간이 지난 객체를 S3 Glacier 같은 저비용 보관 스토리지로 자동 전환한다.

## 키워드

- RDS for MySQL
- Provisioned IOPS SSD
- General Purpose SSD
- Read Replica
- AWS Global Accelerator
- Network Load Balancer
- UDP
- VoIP
- Route 53 Latency Routing
- CloudFront
- Kinesis Data Firehose
- Amazon S3
- S3 Lifecycle Policy
- S3 Glacier
- Amazon Athena
