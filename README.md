<div align="center">
  <img src="https://github.com/user-attachments/assets/8f678279-b2c6-4c53-8f36-10e09f9a8a2a" alt="Login" width="600">
</div>

## news-garden
- 세계의 트렌드를 한 눈에: 뉴스, 검색어, 라디오, 동영상이 살아 숨쉬는 인터랙티브 플랫폼

<br>
<br>

## Team

- [강건](https://www.notion.so/a9f5fe76226a458b976db96edcffcf20?pvs=21) - Backend

> [geon314159 - Overview](https://github.com/geon314159)

- [신민철](https://www.notion.so/82622d0cbda3422a93ec0754d80feb79?pvs=21) - Frontend

> [minchurl - Overview](https://github.com/minchurl)

<br>
<br>

## Tech Stack

- **Server - AWS**
- **Frontend - React**
- **Backend - Flask + Mysql**

<br>
<br>

## Detail

### Earth View
- 처음 접속하면, 로고가 fade out 되며, 회전하는 지구본이 보인다.
- 이후에 지구본을 스크롤하거나, 자유롭게 드레그하여 원하는 시점으로 이동할 수 있다.

<div align="center">
  <img src="https://github.com/user-attachments/assets/8fb19225-9ead-4261-9b18-7719b26a4a8f" alt="Login" width="800">
</div>

<br>
<br>

### Country View
- 지구본에서 원하는 나라를 클릭하면 해당 나라의 country view로 이동한다.
- 우측 하단에서 나라를 확인할 수 있고, Word, Paper, Radio, Media 네 개의 인터렉션 페이지로 이동할 수 있다.

<div align="center">
  <img src="https://github.com/user-attachments/assets/bd888270-a277-4e41-bb95-ba576793a4e2" alt="Login" width="800">
</div>

<br>
<br>

### Word
- `fetch_trends.py` 코드 실행을 통해, DB에는 48개 국가의 최신 구글 검색어 Top 20이 저장되어있다.
- 저장된 검색어를 wordcloud 형식으로 나타내며, 글자의 크기가 클 수록 순위가 높은 검색어를 의미한다.
- 마우스를 단어로 이동하면 툴팁이 표시되며, 단어를 클릭하면 구글 검색 페이지로 이동한다.

<div align="center">
  <img src="https://github.com/user-attachments/assets/7fbbe850-e120-4143-bb08-1724f2d3fef6" alt="Login" width="800">
</div>

<br>
<br>

### Paper
- `fetch_trends.py` 코드에서는 각 국가 키워드별로 최신 기사 정보를 가져오는 로직이 포함되어있으며, 기사 제목, 기사 링크, 기사 요약을 DB에 저장한다.
- 기사 사이트의 html 테그를 분석하여, 기사의 내용이 포함되어있는 부분을 가져와 기사 요약에 저장한다.
- 타 국가의 기사 사이트 접속이 불가하거나, 적절한 기사의 요약이 존재하지 않을 경우 handling 하는 로직을 구현하고, 그 수가 많을 경우 기사 요약 페이지는 지원되지 않는다는 메시지를 띄운다.
- 처음 접속 시 페이퍼가 랜덤으로 흩뿌려지며, 드레그하여 위치를 이동하거나 클릭하여 확대가 가능하다.


<div align="center">
  <img src="" alt="Login" width="800">
</div>

<br>
<br>

### Radio
- `at1.api.radio-browser`를 활용하여 국가별 라디오 정보를 가져온다.
- 처음 접속 시 레코드판이 회전하며 랜덤으로 라디오 채널이 선택되고, 이를 드레그하여 다른 채널을 선택할 수 있다.

<div align="center">
  <img src="https://github.com/user-attachments/assets/b1ee4d06-f8ae-4f8f-82ca-00e1366852ba" alt="Login" width="800">
</div>

<br>
<br>

### Media
- `fetch_videos.py` 코드에서는 Youtube Api를 활용하여, 해당 국가의 인기 동영상 40개를 가져오고 이를 DB에 저장한다.
- 접속 시 다수의 영상 화면이 회전하는 3D 화면을 볼 수 있다.
- 이후 스크롤하거나, 자유롭게 드레그하여 원하는 시점으로 이동할 수 있다.

<div align="center">
  <img src="https://github.com/user-attachments/assets/4e03fff5-131f-4c86-bc7c-5fcc6a9e0d89" alt="Login" width="800">
</div>

<br>
<br>

## DB Design
- https://dbdiagram.io/d/6691fbd39939893daed0bd99

<div align="center">
  <img src="https://github.com/user-attachments/assets/a92ef07b-7375-4f2b-ba89-de13a26a78bf" alt="Login" width="800">
</div>

<br>
<br>

## Resources
- https://d3js.org/d3-geo
- https://github.com/timdream/wordcloud2.js/tree/gh-pages
- https://github.com/GeneralMills/pytrends
- https://github.com/wention/BeautifulSoup4

<br>
<br>

## APIs & Codes
  - /get_keyword_and_news/<country_code> : 국가별 키워드 요청
  - /get_news_summary/<country_code> : 국가별 뉴스 제목과 요약 요청
  - /get_video_ids/<country_code> : 국가별 인기 동영상 ID 요청
  - fetch_trends.py : 국가 키워드 및 뉴스 정보 업데이트
  - fetch_videos.py : 국가 키워드 정보 업데이트
