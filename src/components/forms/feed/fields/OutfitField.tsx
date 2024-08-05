import { OutfitCard } from '@Components/OutfitCard';
import { FormLabel } from '@Components/ui/form';
import { useModalActions } from '@Hooks/modal';
import { Control, useFieldArray } from 'react-hook-form';
import { OutfitFieldReturnType, OutfitItemSheet } from '../_components/OutfitFieldSheet';
import { FeedSchema, OutfitItemSchema } from '../_feedSchema';

interface TOutfitField {
  control: Control<FeedSchema>;
}

type OutfitFieldProps = TOutfitField;

export function OutfitField({ control }: OutfitFieldProps) {
  const { fields: outfitFields, append, remove, update } = useFieldArray({ name: 'outfits', control });

  return (
    <div className="space-y-3">
      <FormLabel className="text-lg font-semibold">착장 정보</FormLabel>
      {outfitFields.length !== 0 && (
        <div className="space-y-2">
          {outfitFields
            .sort((a, b) => a.categoryId - b.categoryId)
            .map((outfitField, index) => (
              <OutfitItemCard key={outfitField.id} {...outfitField} onDeleteOutfit={() => remove(index)} onEditOutfit={(outfitItem) => update(index, outfitItem)} />
            ))}
        </div>
      )}

      <AddOutfitItemButton onOutfitAdded={(outfitField) => append({ ...outfitField })} />
    </div>
  );
}

interface TOutfitItemCard {
  onDeleteOutfit: () => void;
  onEditOutfit: (outfitItem: OutfitItemSchema) => void;
}

type OutfitItemCardProps = OutfitItemSchema & TOutfitItemCard;

function OutfitItemCard({ onDeleteOutfit, onEditOutfit, ...outfitItem }: OutfitItemCardProps) {
  const { showModal } = useModalActions();

  const handleClick = async () => {
    const mutationResult = await startOutfitMutation();

    if (mutationResult === undefined) {
      return;
    }

    const { type, outfitField } = mutationResult;

    if (type === 'edit') {
      return onEditOutfit(outfitField!);
    }

    if (type === 'delete') {
      return onDeleteOutfit();
    }
  };

  const startOutfitMutation = async () => {
    return showModal<OutfitFieldReturnType>({
      type: 'bottomSheet',
      Component: OutfitItemSheet,
      props: { type: 'edit', defaultOutfitField: outfitItem },
    });
  };

  return (
    <button type="button" className="w-full" onClick={handleClick}>
      <OutfitCard {...outfitItem} />
    </button>
  );
}

function AddOutfitItemButton({ onOutfitAdded }: { onOutfitAdded: (outfits: OutfitItemSchema) => void }) {
  const { showModal } = useModalActions();

  const handleClick = async () => {
    const addResult = await startAddOutfitFlow();
    addResult?.outfitField && onOutfitAdded(addResult.outfitField);
  };

  const startAddOutfitFlow = async () => {
    return showModal<OutfitFieldReturnType>({ type: 'bottomSheet', Component: OutfitItemSheet, props: { type: 'add' } });
  };

  return (
    <button type="button" className="w-full rounded-lg border border-purple-50 py-3 transition-colors disabled:bg-gray-100 disabled:text-gray-400" onClick={handleClick}>
      정보 추가
    </button>
  );
}
