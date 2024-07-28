import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { MdChevronLeft } from 'react-icons/md';

export function ServicePolicyDialog({ onClose }: DefaultModalProps) {
  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative py-2">
          <BackButton onClick={onClose} />
          <p className="text-center text-2xl font-semibold">서비스 정책</p>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="p-5">
        <div className="space-y-5 [&>h1]:text-h4 [&>h1]:font-semibold [&>h2]:text-h5 [&>h2]:font-semibold [&>h3]:text-h6 [&>h3]:font-semibold [&>ol]:list-decimal [&>ol]:pl-5 [&>ul]:list-disc [&>ul]:pl-5">
          <h1>이용 약관</h1>

          <p>
            <strong>업데이트 2024.07.14</strong>
          </p>

          <p>
            안녕하세요, FADE입니다! 저희가 명시적으로 별도의 약관(본 약관이 아님)이 적용된다고 밝히지 않는 한 본 이용 약관(또는 '약관')이 회원님의 FADE 이용에 적용되며
            아래 설명된 FADE 서비스('서비스')에 대한 정보를 제공합니다. 회원님이 FADE 계정을 만들거나 FADE를 이용하는 경우, 회원님은 본 약관에 동의하는 것으로 간주됩니다.
          </p>

          <h2>[FADE 용어의 정의]</h2>
          <ul>
            <li>
              <strong>FADE</strong>: 본 서비스의 이름입니다. FAshion + DEmocracy의 약자이며, ① 패션 민주주의 - 투표로 정하는 패션 ② FADE; 흐려지고, 사라지다 : 트렌드가
              아닌 패션은 저절로 흐려지고 잊혀진다 는 의미를 담고 있습니다.
            </li>
            <li>
              <strong>FA:P</strong>: 서비스 내 투표를 통해 선정된 1위를 의미합니다. 매일 한 명 씩 선정되며, 홈 캘린더에 노출됩니다.
            </li>
            <li>
              <strong>FADE in / FADE out</strong>: 투표 선택지에 대한 명칭입니다. FADE in은 선택을 하는 것으로, FA:P선정에 집계됩니다. FADE out은 선택을 하지 않는 것으로,
              FA:P선정에 집계되지 않습니다.
            </li>
            <li>
              <strong>계정 ID</strong>: FADE 내에서 사용하는 고유한 계정 ID를 의미합니다.
            </li>
          </ul>

          <h2>[FADE 서비스]</h2>
          <p>FADE는 아래와 같은 서비스를 제공하며, 함께 명시된 규칙에 따라 운영됩니다.</p>

          <h3>게시물의 업로드 및 관리</h3>
          <ul>
            <li>회원님은 패션 사진을 스타일 정보 및 착장 정보와 함께 업로드할 수 있습니다.</li>
            <li>한번 올린 사진은 수정이 불가능하며 삭제만 가능합니다. 단, 스타일 및 착장 정보의 수정은 가능합니다.</li>
            <li>업로드 된 사진은 다른 회원에게 노출되며 다른 회원의 구독, 저장(북마크), 투표, 신고의 대상이 될 수 있습니다.</li>
            <li>FA:P에 선정된 사진은 홈의 FA:P아카이빙 캘린더에 노출됩니다.</li>
            <li>사진 업로드 시, '사진 업로드 정책'에 동의한 것으로 간주됩니다. (최초 1회 동의 후 업로드 가능)</li>
          </ul>

          <h3>패션에 대한 투표</h3>
          <ul>
            <li>회원님은 하루 횟수 제한 없이 패션 사진에 대한 투표를 진행할 수 있습니다.(단, 투표할 사진이 부족한 경우 추가 투표 불가)</li>
            <li>하루 최소 1사이클(10회)의 투표를 진행해야 추가적인 서비스 이용이 가능합니다.(단, 투표할 사진이 없을 경우 0회의 투표에도 서비스 이용 가능)</li>
            <li>업로드 일자에 상관 없이 하루 중 가장 득표를 많이 한 사진이 그날의 FA:P로 선정되며, 해당 사진은 홈탭, 패션 아카이빙 캘린더에 노출됩니다.</li>
          </ul>

          <p>
            <strong>FA:P 동점자 처리 기준은 아래와 같습니다.</strong>
          </p>
          <ol>
            <li>득표 수가 같을 시, FADE OUT 의 수가 적은 사진으로 선정</li>
            <li>FADE OUT의 수가 같을 시, 사진 저장이 많은 사진으로 선정</li>
          </ol>

          <h3>패션 모아보기</h3>
          <ul>
            <li>회원님은 일자별 FA:P를 확인할 수 있으며, 유저들의 전체 사진을 보며 구독, 저장(북마크), 투표, 신고할 수 있습니다.</li>
          </ul>

          <h3>내 피드의 관리</h3>
          <ul>
            <li>회원님은 계정 상세 피드를 관리할 수 있으며, 프로필사진, 프로필 소개, 계정ID, 성별 정보를 변경하고 적용할 수 있습니다.</li>
            <li>또한, 사진의 삭제 및 신고내역 확인, 구독자 수의 확인이 가능합니다.</li>
          </ul>

          <h3>내 활동에 대한 관리</h3>
          <ul>
            <li>회원님은 FADE 서비스를 이용하며 구독, 저장한 사진을 확인할 수 있습니다.</li>
          </ul>

          <h2>[개인정보처리방침]</h2>
          <p>
            저희 서비스를 제공하기 위해서 회원님의 정보를 수집하고 이용해야 합니다. 개인정보 수집 및 이용 동의서는 저희가 회원님의 정보를 수집, 이용하는 방법에 대해
            설명합니다. FADE를 사용하려면 개인정보 수집 및 이용에 동의해야 합니다.
          </p>

          <h2>[회원님의 약속]</h2>
          <p>FADE의 서비스를 사용하며 회원님은 아래와 같은 약속을 해주셔야 합니다.</p>
          <ul>
            <li>만 14세 이상이어야 합니다.</li>
            <li>다른 사람을 사칭하거나 부정확한 정보를 제공하면 안 됩니다.</li>
            <li>
              성적 수치심을 불러일으키는 사진, 도용이나 AI를 이용한 사진, 비하 혹은 혐오의 상징이 포함된 사진, 서비스와 무관한 사진 등 서비스의 정상적인 이용에 해가
              되거나 타인에게 불쾌함을 주는 사진은 임의로 삭제 처리 될 수 있습니다.
            </li>
            <li>회원님의 특정 사진에 다른 회원님의 신고가 5회 누적될 시, 해당 사진은 임의로 삭제 처리됩니다.</li>
            <li>회원님은 다른 사람의 사진 또는 특정 기밀 정보를 허가 없이 게시할 수 없으며 초상권을 포함하여 다른 사람의 권리를 침해하는 행위를 하여서는 안 됩니다.</li>
            <li>
              회원님은 서비스의 정상적인 운영을 방해하거나 지장을 주는 어떠한 행동(근거 없는 신고의 오용 등)도 해서는 안 되며, 서비스의 정상적인 운영에 해가 된다고 판단
              시, 이용이 제한될 수 있습니다.
            </li>
          </ul>

          <p>회원님은 서비스에 가입함으로써 저희에게 아래와 같은 권한을 부여합니다.</p>
          <ol>
            <li>회원님이 올린 사진 및 스타일, 착장 정보를 서비스 내에서 이용할 수 있는 권한 (서비스 내에서 타 회원님들의 투표, 저장, 구독, 신고의 대상이 됨)</li>
            <li>
              계정의 정지 및 가이드라인을 어긴 사진을 삭제할 수 있는 권한
              <ul>
                <li>타 유저에게 5회 신고를 당한 사진의 삭제, FA:P에 선정된 사진을 3회 이상 삭제하는 경우 계정의 정지 등</li>
              </ul>
            </li>
          </ol>

          <h2>[FADE 서비스]</h2>
          <h3>탈퇴 후 서비스 이용에 관한 유의사항</h3>
          <ol>
            <li>탈퇴 이후 1개월 간 재가입이 불가합니다.</li>
            <li>탈퇴 시 FADE에 남아있는 사진과 기록은 모두 삭제됩니다.</li>
            <li>동일한 계정 ID의 사용이 불가능합니다.</li>
          </ol>

          <h3>탈퇴 후 남는 정보에 관련한 고지</h3>
          <p>회원 탈퇴 시, 회원님의 정보는 아래와 같이 삭제되거나 보관됩니다. (삭제 시, 일정 기간 소요 됨)</p>
          <ol>
            <li>소셜 로그인 정보 삭제</li>
            <li>성별 정보 삭제</li>
            <li>앱 내 올린 모든 사진 및 북마크, 구독 목록 삭제</li>
            <li>계정 ID 및 자동으로 수집되는 인터넷 기록 보관</li>
          </ol>

          <p>
            저희는 FADE 서비스 및 정책을 변경할 수 있고, FADE 서비스 및 정책이 정확하게 반영되도록 하기 위해 본 약관을 변경해야 할 경우가 있습니다. 법적으로 달리 요구되지
            않는 한 저희는 본 약관을 변경하기 전에 회원님에게 통지하여, 약관의 효력이 발생하기 최소 30일 전에 검토할 기회를 제공합니다. 변경 발효일 이후에도 회원님이 계속
            FADE 서비스를 이용하실 경우, 회원님은 개정된 약관의 적용을 받게 됩니다. 본 약관 또는 개정된 약관에 동의하지 않을 경우에는 회원 탈퇴를 진행해주시기 바랍니다.
          </p>

          <p>본 약관은 2024년 7월 14일부터 적용됩니다.</p>
        </div>
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="group absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 touchdevice:active:bg-gray-100 pointerdevice:hover:bg-gray-100"
      onClick={onClick}>
      <MdChevronLeft className="size-6 transition-transform touchdevice:group-active:scale-95 pointerdevice:group-active:scale-95" />
    </button>
  );
}
