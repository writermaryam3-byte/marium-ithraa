import React from 'react'

import { cn } from '@/lib/utils'

type Direction = 'rtl' | 'ltr'

export type ChildTestCardData = {
  id: string
  title: string
  actionLabel: string
  actionDisabled?: boolean
  datePrefixLabel: string
  dateValue: string
  statusLabel: string
  statusColorHex: string
  dateValueColorHex: string
}

export type ChildTestsScreenProps = {
  direction?: Direction
  profileName: string
  gradeLabel: string
  schoolLabel: string
  evaluationStatusLabel: string
  evaluationStatusColorHex: string
  tabs: Array<{ id: string; label: string; active?: boolean }>
  descriptionTitle: string
  description: string
  childTests: ChildTestCardData[]
}

const imgFrame1000003890 =
  'https://www.figma.com/api/mcp/asset/914c83b1-1f96-454f-908f-ad26fed6d5de'
const imgGroup = 'https://www.figma.com/api/mcp/asset/45423da0-d121-46ff-aef1-452084d81cda'
const imgGroup1 = 'https://www.figma.com/api/mcp/asset/d54daec1-5234-4023-a225-56bd1e3c1ce7'
const imgArrowCaretDownSm =
  'https://www.figma.com/api/mcp/asset/d0e28161-f641-4b34-83ff-d59c024c7d73'

function GradientText({
  text,
  style,
  className,
}: {
  text: string
  style: React.CSSProperties
  className?: string
}) {
  return (
    <p
      className={cn('bg-clip-text text-transparent', className)}
      style={style}
      dir="auto"
      aria-label={text}
    >
      {text}
    </p>
  )
}

function TopNav({ activeLabel, direction }: { activeLabel: string; direction: Direction }) {
  const items = ['الحجوزات', 'خريطة الذكاءات', 'الاختبارات', 'أطفالى', 'الرئيسية']
  return (
    <header
      className="absolute bg-white h-[80px] left-0 top-0 w-full overflow-hidden"
      dir={direction}
    >
      <div className="absolute contents inset-[18.75%_5.56%_19.4%_82.64%]" aria-hidden="true">
        <div className="absolute inset-[18.75%_12.13%_19.4%_82.64%]">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup} />
        </div>
        <div className="absolute inset-[23.3%_5.56%_23.94%_88.44%]">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup1} />
        </div>
      </div>

      <nav
        className={cn(
          '-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex gap-[24px] items-center leading-[1.6] left-[50%] top-1/2 whitespace-nowrap',
          'font-sans',
        )}
        aria-label="Top navigation"
      >
        {items.map((label) => {
          const isActive = label === activeLabel
          if (isActive) {
            return (
              <GradientText
                key={label}
                text={label}
                style={{
                  backgroundImage:
                    'linear-gradient(160.85689659442198deg, rgb(211, 22, 153) 14.486%, rgb(114, 34, 227) 108.76%)',
                }}
                className="font-semibold text-[24px] text-center leading-[1.6]"
              />
            )
          }

          return (
            <p
              key={label}
              className="relative shrink-0 text-[24px] text-brand-navy text-center leading-[1.6]"
              dir="auto"
            >
              {label}
            </p>
          )
        })}
      </nav>

      <div
        className="absolute -translate-y-1/2 border border-brand-purple border-solid content-stretch flex gap-[2px] items-center top-1/2"
        style={{ insetInlineStart: '80px' }}
      >
        <div className="relative shrink-0 size-[24px]">
          <img
            alt=""
            className="absolute block inset-0 max-w-none size-full"
            src={imgArrowCaretDownSm}
          />
        </div>
        <GradientText
          text="مريم أحمد"
          style={{
            backgroundImage:
              'linear-gradient(161.7225707032975deg, rgb(211, 22, 153) 14.486%, rgb(114, 34, 227) 108.76%)',
          }}
          className="font-bold leading-[1.6] not-italic text-[16px] whitespace-nowrap text-center"
        />
      </div>
    </header>
  )
}

function ReevaluationSummaryCard({
  profileName,
  gradeLabel,
  schoolLabel,
  evaluationStatusLabel,
  evaluationStatusColorHex,
}: {
  profileName: string
  gradeLabel: string
  schoolLabel: string
  evaluationStatusLabel: string
  evaluationStatusColorHex: string
}) {
  return (
    <section className="bg-white h-[148px] overflow-clip relative rounded-[12px] shadow-[0px_0px_24px_0px_rgba(0,0,0,0.12)] shrink-0 w-full">
      <div className="absolute content-stretch flex items-end justify-between left-[16px] top-[16px] w-[1248px]">
        <div
          className="h-[38px] relative rounded-[8px] shrink-0 w-[178px] flex items-center justify-center"
          style={{
            backgroundImage:
              'linear-gradient(170.1537233907345deg, rgb(211, 22, 153) 14.486%, rgb(114, 34, 227) 108.76%)',
          }}
        >
          <p
            className="text-white font-bold text-[16px] leading-[1.6] whitespace-nowrap"
            dir="auto"
          >
            إعادة التقييم
          </p>
        </div>

        <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0">
          <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-[148px]">
            <p
              className="font-sans leading-[1.6] relative shrink-0 text-brand-navy text-end w-min"
              dir="auto"
            >
              <span className="font-bold text-[16px]">الأسم:</span>
              <span className="leading-[1.6] text-[14px]">&nbsp;</span>
              <span className="leading-[1.6] text-brand-purple text-[16px]">{profileName}</span>
            </p>
            <p
              className="font-sans leading-[1.6] relative shrink-0 text-brand-navy text-end w-min"
              dir="auto"
            >
              <span className="font-bold text-[16px]">الصف:</span>
              <span className="leading-[1.6] text-[14px]">&nbsp;</span>
              <span className="leading-[1.6] text-brand-navy text-[14px]">{gradeLabel}</span>
            </p>
            <p
              className="font-sans leading-[1.6] relative shrink-0 text-brand-navy text-end w-min"
              dir="auto"
            >
              <span className="font-bold text-[16px]">المدرسة:</span>
              <span className="leading-[1.6] text-[14px]">&nbsp;</span>
              <span className="leading-[1.6] text-brand-purple text-[16px]">{schoolLabel}</span>
            </p>

            <div className="content-stretch flex items-center justify-center relative shrink-0">
              <div className="content-stretch flex gap-[4px] items-center justify-center relative shrink-0">
                <div className="flex flex-col font-bold justify-center leading-0 not-italic relative shrink-0 text-[16px] text-end whitespace-nowrap">
                  <p className="leading-[1.6]" dir="auto">
                    {evaluationStatusLabel}
                  </p>
                </div>
                <div
                  className="rounded-full shrink-0 size-[12px]"
                  style={{ backgroundColor: evaluationStatusColorHex }}
                />
              </div>
            </div>
          </div>

          <div className="h-[74px] relative rounded-[12px] shrink-0 w-[93px]">
            <img
              alt=""
              className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full"
              src={imgFrame1000003890}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function TestsTabs({ tabs }: { tabs: ChildTestsScreenProps['tabs'] }) {
  return (
    <div className="content-stretch flex gap-[20px] items-center relative shrink-0 w-full">
      {tabs.map((tab) => {
        const active = !!tab.active
        return (
          <button
            key={tab.id}
            type="button"
            className={cn(
              'h-[48px] overflow-clip relative rounded-[12px] shrink-0 w-[305px] font-bold text-[18px] leading-[1.6] whitespace-nowrap',
              active ? 'border border-brand-purple bg-[#d3baf6]' : 'bg-muted/30',
            )}
            aria-current={active ? 'page' : undefined}
          >
            <span
              className={cn(
                'absolute inset-0 flex items-center justify-center',
                active ? 'text-brand-navy' : 'text-black',
              )}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function TestCard({ test }: { test: ChildTestCardData }) {
  return (
    <article className="bg-white content-stretch flex flex-col gap-[8px] items-end overflow-clip px-[8px] py-[16px] relative shadow-[0px_0px_24px_0px_rgba(0,0,0,0.12)] shrink-0 w-full md:w-[413px]">
      <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-[329px]">
        <p
          className="font-sans font-bold leading-[1.6] not-italic relative shrink-0 text-[16px] text-brand-purple text-end whitespace-nowrap"
          dir="auto"
        >
          {test.title}
        </p>

        <div className="content-stretch flex flex-col gap-[4px] items-end relative shrink-0 w-[175px]">
          <p
            className="font-sans leading-[1.6] not-italic relative shrink-0 text-black text-end whitespace-nowrap"
            dir="auto"
          >
            <span className="font-bold text-[16px] text-brand-navy">{test.datePrefixLabel}</span>
            <span className="leading-[1.6] text-[14px]">&nbsp;</span>
            <span className="leading-[1.6] text-[14px]" style={{ color: test.dateValueColorHex }}>
              {test.dateValue}
            </span>
          </p>

          <div className="flex items-center justify-center relative shrink-0">
            <div className="flex gap-[4px] items-center justify-center relative shrink-0">
              <div className="flex flex-col font-bold justify-center leading-0 not-italic relative shrink-0 text-[16px] text-end whitespace-nowrap">
                <p className="leading-[1.6]" dir="auto" style={{ color: test.statusColorHex }}>
                  {test.statusLabel}
                </p>
              </div>
              <div
                className="rounded-full shrink-0 size-[12px]"
                style={{ backgroundColor: test.statusColorHex }}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="h-[38px] relative rounded-[8px] shrink-0 w-full disabled:opacity-70 disabled:cursor-not-allowed"
        style={{
          backgroundImage:
            'linear-gradient(175.55028576478475deg, rgb(211, 22, 153) 14.486%, rgb(114, 34, 227) 108.76%)',
        }}
        disabled={test.actionDisabled}
        aria-label={test.actionLabel}
      >
        <span className="absolute inset-0 flex items-center justify-center font-sans font-normal text-[16px] text-white whitespace-nowrap">
          {test.actionLabel}
        </span>
      </button>
    </article>
  )
}

export default function ChildTestsScreen({
  direction = 'rtl',
  profileName = 'كريم محمد علي',
  gradeLabel = 'الرابع الإبتدائى',
  schoolLabel = 'مدرسة الإبداع',
  evaluationStatusLabel = 'تم التقييم',
  evaluationStatusColorHex = '#2ccc00',
  tabs = [
    { id: 'plan', label: 'الخطة الإثرائية' },
    { id: 'reports', label: 'التقارير' },
    { id: 'indicators', label: 'المؤشرات' },
    { id: 'tests', label: 'الاختبارات', active: true },
  ],
  descriptionTitle = 'الاختبارات',
  description = 'اطّلع على اختبارات طفلك وتابع نتائج تقييم ذكاءاته ومهاراته.',
  childTests = [
    {
      id: 't1',
      title: 'اختبار الصفات السلوكية للموهبة',
      datePrefixLabel: 'تاريخ الإجراء:',
      dateValue: '10 مايو 2026',
      dateValueColorHex: '#7222e3',
      statusLabel: 'لم يبدأ',
      statusColorHex: '#cc001b',
      actionLabel: 'بدء الاختبار',
    },
    {
      id: 't2',
      title: 'اختبار الصفات السلوكية للموهبة',
      datePrefixLabel: 'تاريخ الإجراء:',
      dateValue: '10 مايو 2026',
      dateValueColorHex: '#7222e3',
      statusLabel: 'لم يبدأ',
      statusColorHex: '#cc001b',
      actionLabel: 'بدء الاختبار',
    },
    {
      id: 't3',
      title: 'اختبار الذكاءات المتعددة',
      datePrefixLabel: 'تاريخ الإجراء:',
      dateValue: 'متاح الآن',
      dateValueColorHex: '#7222e3',
      statusLabel: 'مكتمل',
      statusColorHex: '#2ccc00',
      actionLabel: 'إعادة الاختبار',
    },
  ],
}: ChildTestsScreenProps) {
  return (
    <div className="bg-white relative w-full min-h-dvh overflow-hidden" dir={direction}>
      <TopNav activeLabel="الاختبارات" direction={direction} />

      {/* Desktop layout: matches the original frame pixel grid */}
      <div className="hidden md:flex absolute content-stretch flex-col gap-[29px] items-end left-[79px] top-[277px] w-[1281px]">
        <ReevaluationSummaryCard
          profileName={profileName}
          gradeLabel={gradeLabel}
          schoolLabel={schoolLabel}
          evaluationStatusLabel={evaluationStatusLabel}
          evaluationStatusColorHex={evaluationStatusColorHex}
        />

        <TestsTabs tabs={tabs} />

        <p
          className="font-sans font-bold leading-[1.6] not-italic relative shrink-0 text-muted-icon text-[16px] text-end w-full"
          dir="auto"
        >
          هذه الاختبارات مساعدة عملية للكشف المبكر و ليست أداة تشخيص ولا تغني عن الذهاب لأي مختص
          وحقوق ملكيتها الفكرية مملوكة لإثراء
        </p>

        <div className="content-stretch flex gap-[21px] items-center relative shrink-0 w-full">
          {childTests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden pt-[100px] px-4">
        <div className="flex flex-col gap-[29px] items-end">
          <ReevaluationSummaryCard
            profileName={profileName}
            gradeLabel={gradeLabel}
            schoolLabel={schoolLabel}
            evaluationStatusLabel={evaluationStatusLabel}
            evaluationStatusColorHex={evaluationStatusColorHex}
          />

          <div className="overflow-x-auto w-full">
            <div className="flex gap-[12px] items-center min-w-max">
              {tabs.map((tab) => {
                const active = !!tab.active
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={cn(
                      'h-[48px] px-6 overflow-clip relative rounded-[12px] shrink-0 font-bold text-[18px] leading-[1.6] whitespace-nowrap',
                      active ? 'border border-brand-purple bg-[#d3baf6]' : 'bg-muted/30',
                    )}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span
                      className={cn(
                        'flex items-center justify-center',
                        active ? 'text-brand-navy' : 'text-black',
                      )}
                    >
                      {tab.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <p
            className="font-sans font-bold leading-[1.6] not-italic relative shrink-0 text-muted-icon text-[16px] text-end w-full"
            dir="auto"
          >
            هذه الاختبارات مساعدة عملية للكشف المبكر و ليست أداة تشخيص ولا تغني عن الذهاب لأي مختص
            وحقوق ملكيتها الفكرية مملوكة لإثراء
          </p>

          <div className="flex flex-col gap-[16px] items-stretch w-full">
            {childTests.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>

          <div className="pt-2 w-full">
            <h2 className="font-sans font-bold text-[32px] text-end leading-[1.6]">
              {descriptionTitle}
            </h2>
            <p className="font-sans font-normal text-[16px] text-center leading-[1.6]">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop hero text */}
      <div className="hidden md:flex absolute content-stretch flex-col gap-[8px] items-end leading-[1.6] left-[calc(66.67%+39px)] not-italic text-brand-navy top-[160px] w-[361px] whitespace-nowrap">
        <p
          className="font-sans font-bold relative shrink-0 text-[32px] text-end leading-[1.6]"
          dir="auto"
        >
          {descriptionTitle}
        </p>
        <p
          className="font-sans font-normal relative shrink-0 text-[16px] text-center leading-[1.6]"
          dir="auto"
        >
          {description}
        </p>
      </div>
    </div>
  )
}
