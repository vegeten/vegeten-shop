# VEGETEN Shop

## [VEGETEN](http://www.elice@kdt-sw2-seoul-team10.elicecoding.com)

- 비건 제품을 판매하는 종합 쇼핑몰
- 카테고리: 간편식, 간식음료, 유기농, 대체육, 서적

<br>

## [구현한 기능](https://www.notion.so/eadcd36027464a40bea5e38c691bdfb9?v=901f3ad324d34a4a925aa99301bf9f5b)

<br>

## 주요 사용 기술

### 1. 프론트엔드

- **Vanilla javascript**, html, css (**Bulma css**)
- Google material icon
- Daum 도로명 주소 api

### 2. 백엔드

- **node**, **Express** (nodemon, babel-node로 실행됩니다.)
- Mongodb, Mongoose
- cors
- AWS S3
- jwt
- nodemailer
- nanoid

<br>

## 협업 툴

| Tool                                                                                            | 사용 이유                                                                                        |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [notion](https://www.notion.so/10-eb71263eb4494e91ad0eac8b587b8f10)                             | 프로젝트 전체적인 관리와 기록                                                                    |
| [gather town](https://app.gather.town/invite?token=oOfrxfGrWIDwt4OAuGjUFavZNi_3fwnv)            | 오프라인 만남을 대체하고 실시간으로 소통                                                         |
| [github](https://github.com/vegeten/vegeten-shop) | 코드 공유                                                                                        |
| [figma](https://www.figma.com/file/O4Zgf6H4iNtGNLQ4ZlOxg9/10%EC%A1%B0?node-id=0%3A1)            | 와이어프레임 제작                                                                                |
| slack                                                                                           | github와 연동하여 merge request, issue 작성 시에 바로 알림을 받아서 빠르게 피드백하기 위한 용도 |


<br>

## 폴더 구조

- 프론트: `src/views` 폴더
- 백: src/views 이외 폴더 전체
- 실행: **프론트, 백 동시에, express로 실행**

<br>

## 팀원 역할

### 프론트엔드

- 경지윤
  - shop, detail 페이지 제작
  - 페이지네이션 구현
  - admin 페이지 상품,카테고리 추가/삭제/수정 구현
  - 홈화면, about, shop 페이지 스타일 추가
- 김정현
  - 로그인 페이지 로그인, 비밀번호 찾기 기능 구현, 회원가입 페이지 구현
  - 마이페이지 주문내역 조회, 유저 정보 수정 기능 구현
  - 어드민 페이지 전체 주문내역 조회 기능 구현, 어드민 로그인 페이지 구현
  - 상품 페이지 상품 검색 기능 구현, 상품 디테일 페이지 리뷰 추가/기능/삭제 기능 구현
  - 홈 페이지 캐러셀 슬라이더, 신규 상품 조회 출력
  - 어바웃 페이지 레이아웃 구현
  - AWS S3 이미지 업로드 기능 구현
- 정유진
  - 장바구니 페이지 구현
  - 결제페이지 구현
  - 로그인 시 받는 토큰들을 저장하고, 토큰 만료시간을 계산하여 갱신
  - 회원가입 시 이메일 인증
  - api 호출 공통 함수 작성
  - UX 총괄

### 백엔드

- 김태훈
  - user api 추가 기능 구현(비밀번호 찾기, 이메일 인증, 기본 배송지 추가 등)
  - jwt 프로세스(access, refresh 토큰 발급 및 만료 시 재발급) 구현
  - 리뷰 api CRUD 및 모델, 스키마 구현
  - 주문 api CRUD 및 모델, 스키마 구현
  - 카테고리 페이지네이션 및 카테고리 필터링 기능 수정
- 나혜지
  - 카테고리 CRUD, 비활성화 API 구현
  - 상품 CRUD, 검색 API 구현
  - 유저 주문 목록 조회 API 구현
  - AWS S3 이미지 업로드 API 구현
  - 커스텀 에러쿼리 구현

## <br>

본 프로젝트에서 제공하는 모든 코드 등의는 저작권법에 의해 보호받는 ㈜엘리스의 자산이며, 무단 사용 및 도용, 복제 및 배포를 금합니다.
Copyright 2022 엘리스 Inc. All rights reserved.
