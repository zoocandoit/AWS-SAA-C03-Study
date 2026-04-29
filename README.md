# AWS SAA-C03 Review Bank

`#n/README.md` 형식으로 정리한 문제를 브라우저에서 복습할 수 있는 로컬 문제은행 애플리케이션입니다.

새 문제는 계속 `#8`, `#9` 같은 폴더를 추가해서 확장할 수 있고, 서버를 다시 실행하거나 브라우저를 새로고침하면 자동으로 반영됩니다.

## Run

```bash
python server.py
```

서버가 실행되면 브라우저에서 아래 주소로 접속합니다.

```text
http://127.0.0.1:8000
```

## Features

- `#n/README.md` 문제 문서를 자동으로 읽어 문제은행으로 변환
- 세트별 필터
- 키워드 검색
- 정답 가리기 / 정답 확인
- 해설과 핵심 메모 복습
- 랜덤 문제 이동

## Question Format

각 세트는 아래처럼 유지하면 앱에서 자동으로 파싱됩니다.

```md
# #8

## 문제 1

### 문제
...

### 선택지
1. ...
2. ...

### 정답
2번

### 해설
...

### 핵심 메모
- ...

## 키워드
- ...
```

## Project Structure

- [`server.py`](C:/Users/hpjoo/Desktop/dev/AWS-SAA-C03-Study/server.py): 문제 파서 + 로컬 웹 서버
- [`app/index.html`](C:/Users/hpjoo/Desktop/dev/AWS-SAA-C03-Study/app/index.html): 복습 앱 HTML
- [`app/styles.css`](C:/Users/hpjoo/Desktop/dev/AWS-SAA-C03-Study/app/styles.css): 복습 앱 스타일
- [`app/app.js`](C:/Users/hpjoo/Desktop/dev/AWS-SAA-C03-Study/app/app.js): 문제은행 UI 로직
- [`#1`](C:/Users/hpjoo/Desktop/dev/AWS-SAA-C03-Study/#1) ~ [`#7`](C:/Users/hpjoo/Desktop/dev/AWS-SAA-C03-Study/#7): 문제 세트

## Add More Questions

1. 새 폴더를 `#8`처럼 생성합니다.
2. 폴더 안에 `README.md`를 같은 형식으로 작성합니다.
3. 서버 실행 중이면 브라우저를 새로고침합니다.

## Current Sets

- [`#1`](C:/Users/hpjoo/Desktop/dev/AWS-SAA-C03-Study/#1)
- [`#2`](C:/Users/hpjoo/Desktop/dev/AWS-SAA-C03-Study/#2)
- [`#3`](C:/Users/hpjoo/Desktop/dev/AWS-SAA-C03-Study/#3)
- [`#4`](C:/Users/hpjoo/Desktop/dev/AWS-SAA-C03-Study/#4)
- [`#5`](C:/Users/hpjoo/Desktop/dev/AWS-SAA-C03-Study/#5)
- [`#6`](C:/Users/hpjoo/Desktop/dev/AWS-SAA-C03-Study/#6)
- [`#7`](C:/Users/hpjoo/Desktop/dev/AWS-SAA-C03-Study/#7)
