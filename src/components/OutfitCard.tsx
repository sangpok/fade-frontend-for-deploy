import { OUTFIT_CATEGORY_LIST } from '@/constants';
import { TOutfitItem } from '@Types/model';
import { ItemBadge } from './ItemBadge';

interface TOutfitCard {}

type OutfitCardProps = TOutfitCard & Omit<TOutfitItem, 'id'>;

export function OutfitCard({ brandName, categoryId, details }: OutfitCardProps) {
  return (
    <div className="flex w-full flex-row gap-3 rounded-lg border border-purple-50 bg-white p-3">
      <ItemBadge variants="primary">{OUTFIT_CATEGORY_LIST.at(categoryId)}</ItemBadge>

      <div className="flex w-full flex-col justify-center">
        <p className="text-left">{brandName}</p>
        {details && <p className="text-left text-sm text-gray-500">{details}</p>}
      </div>
    </div>
  );
}
