import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { TOutfitItem } from '@Types/model';
import { BackButton } from './ui/button';
import { OutfitCard } from './OutfitCard';

interface TOutfitDialog {
  outfits: TOutfitItem[];
}

type OutfitDialogProps = DefaultModalProps<void, TOutfitDialog>;

export function OutfitDialog({ outfits, onClose }: OutfitDialogProps) {
  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative py-2">
          <BackButton onClick={onClose} />
          <p className="text-center text-2xl font-semibold">착장 정보</p>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="space-y-3 bg-gray-100 p-5">
        {outfits.map((outfit) => (
          <OutfitCard key={outfit.id} {...outfit} />
        ))}
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}
