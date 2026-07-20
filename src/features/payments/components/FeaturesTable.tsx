import React from 'react'

interface RowProps {
  label: string
  free: string | boolean
  basic: string | boolean
  premium: string | boolean
}

const TableRow: React.FC<RowProps> = ({ label, free, basic, premium }) => {
  const renderCell = (val: string | boolean) => {
    if (typeof val === 'boolean') {
      return val ? (
        <span className="text-[#7222e3] font-bold text-base">✓</span>
      ) : (
        <span className="text-slate-200">—</span>
      )
    }
    return <span className="text-slate-600 text-xs font-medium">{val}</span>
  }

  return (
    <div className="grid grid-cols-4 border-b border-slate-100 py-3.5 px-4 items-center hover:bg-slate-50/50 transition">
      <div className="text-slate-700 font-bold text-xs text-right">{label}</div>
      <div className="text-center">{renderCell(free)}</div>
      <div className="text-center">{renderCell(basic)}</div>
      <div className="text-center">{renderCell(premium)}</div>
    </div>
  )
}

const SectionHeader = ({ title }: { title: string }) => (
  <div className="bg-slate-50/80 grid grid-cols-4 py-2 px-4 border-b border-slate-100 text-right">
    <div className="col-span-4 text-[#7222e3] font-extrabold text-xs flex items-center gap-1">
      <span>✦</span> {title}
    </div>
  </div>
)

export const FeaturesTable: React.FC = () => {
  return (
    <section className="py-16 px-4 max-w-5xl mx-auto" dir="rtl">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-slate-950 mb-2">اختر ما يناسب مدرستك تماماً</h2>
        <p className="text-slate-400 text-xs">مقارنة شاملة لجميع الخصائص والميزات الفنية</p>
        <div className="w-12 h-1 bg-[#e88ecf] mx-auto mt-3 rounded-full" />
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {/* رأس الجدول الأساسي */}
        <div className="grid grid-cols-4 bg-white border-b border-slate-100 py-4 px-4 text-center font-black text-xs text-slate-800">
          <div className="text-right text-slate-400 font-medium">المميزات</div>
          <div>الباقة المجانية</div>
          <div>الباقة الأساسية</div>
          <div className="text-[#7222e3]">الباقة الشاملة</div>
        </div>

        {/* 1. عدد الطلاب والوصول */}
        <SectionHeader title="عدد الطلاب والوصول" />
        <TableRow label="عدد الطلاب" free="حتى 100" basic="عدد غير محدود" premium="عدد غير محدود" />
        <TableRow
          label="استضافة أبناء المعلمات والموظفات"
          free={false}
          basic={true}
          premium={true}
        />
        <TableRow label="إضافة أطفال خارج المدرسة" free={false} basic={false} premium={true} />

        {/* 2. المقاييس والتقارير */}
        <SectionHeader title="المقاييس والتقارير" />
        <TableRow
          label="مكتبة المقاييس والاختبارات"
          free="1 مجاني"
          basic="كاملة"
          premium="شاملة + تقارير خاصة"
        />
        <TableRow label="تحديث مستمر للمقاييس" free={false} basic={true} premium={true} />
        <TableRow
          label="تقرير أولياء الأمور"
          free="أساسية"
          basic="شاملة لكل مقياس"
          premium="شاملة ومخصصة"
        />

        {/* 3. الأنشطة والشراكة */}
        <SectionHeader title="الأنشطة والشراكة" />
        <TableRow label="أنشطة أون لاين للطلاب" free={true} basic={true} premium={true} />
        <TableRow label="خصومات أنشطة إثراء الذكاء" free={true} basic={true} premium={true} />
        <TableRow label="توظيف مقدمي أنشطة مساعدين" free={false} basic={true} premium={true} />
        <TableRow
          label="أنشطة اليوم الواحد بالمدرسة"
          free={false}
          basic="محدودة"
          premium="غير محدودة"
        />
        <TableRow
          label="أنشطة ما بعد المدرسة والمعسكرات"
          free={false}
          basic={false}
          premium={true}
        />
        <TableRow label="مشاركه العوائد مع المدرسة" free={false} basic={false} premium={true} />
        <TableRow
          label="ترشيح الأنشطة للأطفال خارج المدرسة"
          free={false}
          basic={false}
          premium={true}
        />

        {/* 4. الإدارة والتشغيل */}
        <SectionHeader title="الإدارة والتشغيل" />
        <TableRow label="التعديل والجدولة" free={false} basic={true} premium={true} />
        <TableRow label="بوابة الدفع وخدمة التقسيط" free={true} basic={true} premium={true} />
        <TableRow label="تعيين أدوار" free={false} basic={true} premium={true} />

        {/* 5. التطوير المهني والمجتمع */}
        <SectionHeader title="التطوير المهني والمجتمع" />
        <TableRow
          label="ندوات واستشارات للأهالي"
          free="عن بعد فقط"
          basic="من غرف فقط"
          premium="في المدرسة وعن بعد"
        />
        <TableRow label="دورات معتمدة للمعلمات" free={false} basic={false} premium={true} />
      </div>
    </section>
  )
}
