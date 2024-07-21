import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { OUTFIT_CATEGORY_LIST, OUTFIT_STYLE_MAP } from '@/constants';
import { ToggleButton } from '@Components/ui/toogleButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useModalActions } from '@Hooks/modal';
import { useToastActions } from '@Hooks/toast';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { OutfitStyle } from '@Types/outfitStyle';
import { useEffect, useTransition } from 'react';
import { Control, useFieldArray, useForm } from 'react-hook-form';
import { MdChevronRight, MdClose, MdInfoOutline } from 'react-icons/md';
import { z } from 'zod';
import { InputImageFile } from './InputImageFile';
import { OutfitFieldReturnType, OutfitItemSheet } from './OutfitFieldSheet';
import { SelectStyleView } from './SelectStyleView';
import { UploadGuideBottomSheet } from './UploadGuideBottomSheet';

/** 착장 정보 스키마 */
const outfitItemSchema = z
  .object({
    category: z.number(),
    brandName: z.string(),
    details: z.string(),
  })
  .refine(
    ({ category, brandName }) => {
      const doseNotSelectCategory = category === -1;
      const doseInputBrandName = !doseNotSelectCategory && brandName !== '';

      return doseNotSelectCategory || doseInputBrandName;
    },
    { path: ['brandName'] }
  );

type OutfitItemSchema = z.infer<typeof outfitItemSchema>;

/** 사진 업로드 스키마 */
const formSchema = z.object({
  image: z.string().refine((value) => value !== '', '사진을 선택해주세요.'),
  styles: z.array(z.number()), // Optional
  outfits: z.array(outfitItemSchema), // Optional
});

type UploadImageSchema = z.infer<typeof formSchema>;

type UploadImageFormProp = { onClose: () => void; onValueChanged: (isChanged: boolean) => void };

export function UploadImageForm({ onClose, onValueChanged }: UploadImageFormProp) {
  const [pending, startTransition] = useTransition();
  const { showToast } = useToastActions();

  const form = useForm<UploadImageSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
      styles: [],
      outfits: [],
    },
    mode: 'onChange',
  });

  const { styles } = form.watch();
  const { isDirty, isValid } = form.formState;

  /** 정보 입력 후 나가기 방지 */
  useEffect(() => {
    onValueChanged(isDirty);
  }, [isDirty]);

  function handleSubmitAfterValidation(values: UploadImageSchema) {
    startTransition(() => {
      console.log(values);
      showToast({ title: '사진을 성공적으로 등록 어쩌구', type: 'success' });
      // onSubmit(values);
    });
  }

  const { fields: outfitFields, append, remove, update } = useFieldArray({ name: 'outfits', control: form.control });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitAfterValidation)} className="h-full space-y-8">
        <fieldset className="flex h-full min-w-full flex-col gap-5" disabled={pending}>
          <FlexibleLayout.Root>
            <FlexibleLayout.Header>
              <Header onClose={onClose} />
            </FlexibleLayout.Header>

            <FlexibleLayout.Content className="space-y-8">
              <AddImageField control={form.control} />
              <SelectStylesField selectedStyles={styles as unknown as OutfitStyle[]} control={form.control} />

              <div className="space-y-3">
                <FormLabel className="text-lg font-semibold">착장 정보</FormLabel>
                {outfitFields.length !== 0 && (
                  <div className="space-y-2">
                    {outfitFields.map((outfitField, index) => (
                      <OutfitItemCard
                        key={outfitField.id}
                        {...outfitField}
                        onDeleteOutfit={() => remove(index)}
                        onEditOutfit={(outfitItem) => update(index, outfitItem)}
                      />
                    ))}
                  </div>
                )}

                <AddOutfitItemButton onOutfitAdded={(outfitField) => append({ ...outfitField })} />
              </div>
            </FlexibleLayout.Content>

            <FlexibleLayout.Footer>
              <UploadButton disabled={!isValid} />
            </FlexibleLayout.Footer>
          </FlexibleLayout.Root>
        </fieldset>
      </form>
    </Form>
  );
}

/* #region Componenets */
function Header({ onClose }: { onClose: () => void }) {
  const { showModal } = useModalActions();

  const handleInfoClick = async () => {
    showUploadGuide();
  };

  const showUploadGuide = async () => {
    return showModal({ type: 'bottomSheet', Component: UploadGuideBottomSheet });
  };

  return (
    <header className="relative px-5 py-4">
      <button type="button" className="group absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 pointerdevice:hover:bg-gray-100" onClick={onClose}>
        <MdClose className="size-6 group-active:pointerdevice:scale-95" />
      </button>

      <p className="text-center text-2xl font-semibold">사진 업로드</p>

      <button
        type="button"
        className="group absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 transition-transform pointerdevice:hover:bg-gray-100"
        onClick={handleInfoClick}>
        <MdInfoOutline className="size-6 group-active:pointerdevice:active:scale-95" />
      </button>
    </header>
  );
}

function UploadButton({ disabled }: { disabled: boolean }) {
  return (
    <div className="flex p-4">
      <button
        className="flex-1 rounded-lg bg-black py-2 text-xl text-white transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:pointerdevice:cursor-not-allowed"
        disabled={disabled}>
        업로드
      </button>
    </div>
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
    <button type="button" className="w-full rounded-lg border border-gray-200 py-3 transition-colors disabled:bg-gray-100 disabled:text-gray-400" onClick={handleClick}>
      정보 추가
    </button>
  );
}

function SelectStyleButton({ selectedStyles, onStylesSelected }: { selectedStyles: OutfitStyle[]; onStylesSelected: (selectedStyles: OutfitStyle[]) => void }) {
  const { showModal } = useModalActions();

  const handleClick = async () => {
    const selectResult = await startSelectStyleFlow(selectedStyles);
    selectResult && onStylesSelected(selectResult);
  };

  const startSelectStyleFlow = async (defaultStyles: OutfitStyle[]) => {
    return showModal<OutfitStyle[]>({
      type: 'fullScreenDialog',
      animateType: 'slideInFromRight',
      Component: SelectStyleView,
      props: { defaultStyles },
    });
  };

  return (
    <button type="button" className="relative block w-full rounded-lg border border-gray-200 bg-white py-3" onClick={handleClick}>
      스타일 선택하기
      <MdChevronRight className="absolute right-3 top-1/2 size-6 -translate-y-1/2" />
    </button>
  );
}

function OutfitItemCard({
  onDeleteOutfit,
  onEditOutfit,
  ...outfitItem
}: OutfitItemSchema & { onDeleteOutfit: () => void; onEditOutfit: (outfitItem: OutfitItemSchema) => void }) {
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
    <button type="button" className="flex w-full flex-row gap-3 rounded-lg border border-purple-50 bg-white p-3" onClick={handleClick}>
      <OutfitBadge categoryType={outfitItem.category} />

      <div className="flex w-full flex-col gap-1">
        <p className="text-left">{outfitItem.brandName}</p>
        <p className="text-left text-sm text-gray-500">{outfitItem.details}</p>
      </div>
    </button>
  );
}

function OutfitBadge({ categoryType }: { categoryType: number }) {
  return (
    <div className="min-w-fit rounded-[1rem] border border-purple-100 bg-purple-50 px-5 py-3">
      <span>{OUTFIT_CATEGORY_LIST[categoryType]}</span>
    </div>
  );
}
/* #endregion */

/* #region Fields */
function AddImageField({ control }: { control: Control<UploadImageSchema> }) {
  return (
    <FormField
      control={control}
      name="image"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-semibold">사진 추가</FormLabel>

          <div>
            <FormControl>
              <InputImageFile value={field.value} onChange={field.onChange} />
            </FormControl>

            <p className="mt-1 pl-2 text-xs text-gray-600">※ 업로드 후에는 사진 수정이 불가하니 가이드에 맞추어 신중히 업로드해주세요!</p>
          </div>

          <FormMessage className="text-pink-400" />
        </FormItem>
      )}
    />
  );
}

function SelectStylesField({ selectedStyles, control }: { selectedStyles: OutfitStyle[]; control: Control<UploadImageSchema> }) {
  const hasSelectedStyles = selectedStyles.length !== 0;

  return (
    <FormField
      control={control}
      name="styles"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="mb-3 text-lg font-semibold">스타일</FormLabel>

          {hasSelectedStyles && (
            <ul className="flex flex-row flex-wrap gap-x-2 gap-y-3">
              {selectedStyles.map((selectedStyle) => (
                <li key={selectedStyle}>
                  <ToggleButton selected={true}>{OUTFIT_STYLE_MAP[selectedStyle]}</ToggleButton>
                </li>
              ))}
            </ul>
          )}

          <FormControl>
            <SelectStyleButton selectedStyles={selectedStyles} onStylesSelected={field.onChange} />
          </FormControl>
          <FormMessage className="text-pink-400" />
        </FormItem>
      )}
    />
  );
}
/* #endregion */
