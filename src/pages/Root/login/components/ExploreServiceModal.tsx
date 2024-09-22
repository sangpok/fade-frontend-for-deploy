import { Button } from '@Components/ui/button';
import { DefaultModalProps } from '@Stores/modal';
import { forwardRef } from 'react';

export const ExploreServiceModal = forwardRef<HTMLDivElement, DefaultModalProps>(({ onClose }: DefaultModalProps, ref) => {
  return (
    <div ref={ref}>
      <header className="relative px-5 py-4">
        <p className="text-center text-lg font-semibold">서비스 둘러보기</p>
      </header>

      <div className="space-y-2 p-5">
        <p>안녕하세요, FADE입니다.</p>
        <p>
          서비스 둘러보기는 실제 환경이 아닌 <strong>API Mocking 환경</strong>에서 동작하며, 이로 인해 실제 환경과 다소 다를 수 있음을 알려드려요.
        </p>
        <p>
          참고로 서비스 가입에 필요한 시간은 <strong>단 10초</strong>입니다. 지금 바로 시작해보세요 :)
        </p>
        <div>
          <p className="text-gray-600">* API Mocking 환경</p>
          <p className="ml-[1rem] text-gray-600">: 실제 데이터가 아닌 테스트 데이터가 반환됩니다.</p>
        </div>
      </div>

      <div className="flex flex-row gap-4 p-5">
        <Button className="flex-1" variants="ghost" onClick={() => onClose(false)}>
          10초 만에 가입하기
        </Button>
        <Button className="flex-1" onClick={() => onClose(true)}>
          계속해서 둘러보기
        </Button>
      </div>
    </div>
  );
});
