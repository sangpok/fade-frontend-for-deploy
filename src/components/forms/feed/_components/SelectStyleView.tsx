import { OUTFIT_STYLE_LIST } from '@/constants';
import { ItemBadge } from '@Components/ItemBadge';
import { BackButton, Button } from '@Components/ui/button';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { PropsWithChildren, useState } from 'react';

type SelectStyleViewProp = { defaultStyles: number[] };

export const SelectStyleView = ({ defaultStyles = [], onClose }: DefaultModalProps<number[], SelectStyleViewProp>) => {
  const [selectedStyles, setSelectedStyles] = useState<number[]>(defaultStyles);

  return (
    <FlexibleLayout.Root className="border-l shadow-xl">
      <FlexibleLayout.Header>
        <Header onBack={() => onClose(defaultStyles)} />
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="space-y-3 p-5">
        <p>스타일은 복수선택 가능하며 사진 필터링에 이용됩니다.</p>
        <ul className="flex flex-row flex-wrap gap-x-2 gap-y-3">
          {OUTFIT_STYLE_LIST.map((outfitStyle, index) => (
            <li key={outfitStyle}>
              <OutfitStyleToggleButton
                isSelected={selectedStyles.includes(index)}
                onToggle={(isSelected) => {
                  isSelected && setSelectedStyles((prevStyles) => [...prevStyles, index]);
                  !isSelected && setSelectedStyles((prevStyles) => prevStyles.filter((value) => value !== index));
                }}>
                {outfitStyle}
              </OutfitStyleToggleButton>
            </li>
          ))}
        </ul>
      </FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        <DoneSelectStylesButton onClick={() => onClose(selectedStyles)} />
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
  );
};

function Header({ onBack }: { onBack: () => void }) {
  return (
    <header className="relative py-2">
      <BackButton onClick={onBack} />
      <p className="text-center text-lg font-semibold">스타일 선택</p>
    </header>
  );
}

function DoneSelectStylesButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex p-5">
      <Button variants="secondary" className="w-full text-lg" onClick={onClick}>
        스타일 선택 완료
      </Button>
    </div>
  );
}

interface TOutfitStyleToogleButton {
  isSelected: boolean;
  onToggle: (newValue: boolean) => void;
}

type OutfitStyleToggleButtonProps = PropsWithChildren<TOutfitStyleToogleButton>;

function OutfitStyleToggleButton({ isSelected, onToggle, children }: OutfitStyleToggleButtonProps) {
  return (
    <button type="button" onClick={() => onToggle(!isSelected)}>
      <ItemBadge variants={isSelected ? 'primary' : 'default'}>{children}</ItemBadge>
    </button>
  );
}
