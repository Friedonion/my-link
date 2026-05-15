import HomeClient from "./HomeClient";

export const metadata = {
  title: "홈",
  description: "인스타그램, 유튜브, 블로그까지. 나만의 모든 링크를 한 페이지에 담고 실시간 통계까지 확인하세요. 마이링크(MY-link)와 함께 당신의 개성을 세상에 알리세요.",
  alternates: {
    canonical: "/",
  },
};

export default function Page() {
  return <HomeClient />;
}
