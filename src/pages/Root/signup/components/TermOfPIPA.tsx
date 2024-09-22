import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { MdChevronLeft } from 'react-icons/md';

export function TermOfPIPA({ onClose }: DefaultModalProps) {
  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative px-5 py-4">
          <button
            type="button"
            className="group absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 touchdevice:active:bg-gray-100 pointerdevice:hover:bg-gray-100"
            onClick={onClose}>
            <MdChevronLeft className="size-6 transition-transform group-active:pointerdevice:scale-95" />
          </button>

          <p className="text-center text-lg font-semibold">FADE 이용 약관</p>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="p-5">
        <div className="space-y-5 [&>h1]:text-h5 [&>h1]:font-semibold [&>h2]:text-h5 [&>h2]:font-semibold [&>h3]:text-h6 [&>h3]:font-semibold [&>ol]:list-decimal [&>ol]:pl-5 [&>ul]:list-disc [&>ul]:pl-5">
          <h1>FADE 개인정보 수집 이용 내역</h1>

          <p>FADE는 "개인정보 보호법"에 따라 아래와 같이 수집하는 개인 정보의 항목, 수집 및 이용 목적, 보유 및 이용 기간을 안내드리고 동의를 받고자 합니다.</p>

          <h2>[개인정보 수집 이용 내역]</h2>

          <h3>1. 회원가입 및 관리</h3>
          <ul>
            <li>
              <strong>목적</strong>: 회원자격 유지/관리
            </li>
            <li>
              <strong>수집 항목</strong>: (필수) 닉네임, 프로필사진
            </li>
            <li>
              <strong>보유 및 이용기간</strong>: 회원 탈퇴시까지
            </li>
          </ul>

          <h3>2. 제품 및 서비스</h3>
          <ul>
            <li>
              <strong>목적</strong>: 제품 및 서비스 제공
            </li>
            <li>
              <strong>수집 항목</strong>: (필수) 서비스 이용 내역, 회원의 선택 성별, 회원이 업로드하는 콘텐츠
            </li>
            <li>
              <strong>보유 및 이용기간</strong>: 회원 탈퇴시까지
            </li>
          </ul>

          <h3>3. 자동으로 수집되는 정보</h3>
          <ul>
            <li>
              <strong>목적</strong>: 웹/앱 방문에 관한 통계 및 분석
            </li>
            <li>
              <strong>수집 항목</strong>: (필수) IP주소, 쿠키, 방문 일시, 서비스 이용기록, 접속 로그, OS종류, OS버젼, 디바이스 종류, 광고 식별자, 디바이스 종류, 서비스
              이용 내역
            </li>
            <li>
              <strong>보유 및 이용기간</strong>: 서비스 종료 시까지
            </li>
          </ul>

          <p>위와 같이 개인정보를 제공하는데 동의합니다.</p>
        </div>
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}
