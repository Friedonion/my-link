export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL 
  ? process.env.NEXT_PUBLIC_BASE_URL 
  : process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : "http://localhost:3000";

export const APP_NAME = "MY-link";
export const APP_DESCRIPTION = "인스타그램, 유튜브, 블로그까지. 나만의 모든 링크를 한 페이지에 담고 실시간 통계까지 확인하세요.";
