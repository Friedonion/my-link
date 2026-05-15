import StatsClient from "./StatsClient";

export const metadata = {
  title: "통계 분석",
  description: "내 링크의 방문자 클릭 수를 실시간으로 분석하고 성과를 확인하세요.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <StatsClient />;
}
