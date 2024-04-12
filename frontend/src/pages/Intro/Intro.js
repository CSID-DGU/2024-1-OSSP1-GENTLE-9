import React from "react";
import styles from "./Intro.module.css";

function Intro() {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img src="/title.png" alt="title" />
        <div className={styles.textOverImage}>
          GENERATE NEUTRAL NEWS SERVICE
        </div>
      </div>

      <div className={styles.content_wrapper}>
        <p className={styles.title}>ABOUT US</p>
        <hr />

        <div className={styles.content}>
          <p className={styles.small_title}>GENTLE 팀 소개</p>
          <p className={styles.intro}>
            안녕하세요, 저희는 GENTLE(GENERATE NEUTRAL NEWS)입니다.
            <br />
            <br /> 정보의 바다 시대에서 진실과 거짓을 구분하는 일은 쉽지
            않습니다. 또한 완벽한 진실, 완벽한 거짓은 존재하지 않는 것 같습니다.
            때로는 감정이나 개인의 신념이 진실을 압도하기도 합니다. 이러한
            탈진실의 시대에 진실과 거짓을 따지는 것은 무의미한 일일 것 입니다.
            <br />
            <br />
            따라서 저희는 사용자들이 글쓴이의 감정이나 신념을 파악하고, 객관적인
            정보에 집중할 수 있도록 요약 기사와 분석을 제공하는 GENTLE 서비스를
            기획하게 되었습니다.
          </p>
        </div>

        <div className={styles.content}>
          <p className={styles.small_title}>서비스 소개</p>
          <p className={styles.intro}>
            저희 서비스가 제공하는 분석은 다음과 같습니다.
          </p>
          <p className={styles.intro}>
            <b>1. 언론 성향 수치화</b> : RSS 기반으로 각 언론사의 뉴스 본문을
            추출하고, 이를 바탕으로 언론사의 정치적 성향을 분석합니다. 분석을
            제공하는 언론사는 다음과 같습니다.
          </p>
          <img src="/news1.png" alt="조선일보" />
          <img src="/news2.png" alt="중앙일보" />
          <img src="/news3.png" alt="한겨레" />
          <img src="/news4.png" alt="경향신문" />
          <img src="/news5.png" alt="서울신문" />
          <img src="/news6.png" alt="한국일보" />
          <p className={styles.intro}>
            <b>2. 기사 분석 기능</b> : 입력된 URL에 해당하는 뉴스 기사 본문을
            추출하고, 이를 요약 및 분석하여 제공합니다.
          </p>
          <p className={styles.intro}>
            <b>3. 검색 키워드 추천 </b> : 기사 본문에서 중요도가 높은 키워드
            3개를 추출한 후, 키워드 빈도수 시각화를 통해 워드 클라우드를
            추가적으로 제공합니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Intro;
