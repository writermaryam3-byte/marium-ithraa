import React from 'react'

interface FeatureCardProps {
  title: string
  description: string
  iconBg: string
  icon: string
}

const WhyCard: React.FC<FeatureCardProps> = ({ title, description, iconBg, icon }) => (
  <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] text-right flex flex-col items-start hover:shadow-md transition duration-300">
    <div
      className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center text-white text-lg mb-4`}
    >
      {icon}
    </div>
    <h3 className="text-slate-900 font-extrabold text-sm mb-2">{title}</h3>
    <p className="text-slate-400 text-xs leading-relaxed">{description}</p>
  </div>
)

export const WhyUsSection: React.FC = () => {
  const features = [
    {
      title: 'مقاييس علمية معتمدة',
      description:
        'اختبارات ودراسات تربوية مبنية على نظريات الذكاءات المتعددة، تقدم تقارير مخصصة لكل طالب لتوجيه قراراتك الحالية والمسقبلية بوضوح تام.',
      iconBg: 'bg-[#2b4683]',
      icon: '🔬',
    },
    {
      title: 'شبكة أنشطة ثرية',
      description:
        'أكثر من 200 نشاط وبرنامج إثرائي يغطي الفنون والتقنية والرياضة والقيادة، يقدمها متخصصون مدربون ومعتمدون.',
      iconBg: 'bg-[#7222e3]',
      icon: '🧮',
    },
    {
      title: 'إدارة شاملة بنقرة واحدة',
      description:
        'حل متكامل للتسجيل، الجدولة، الدفع، والتقارير؛ يوفر على إدارة المدرسة ساعات طويلة من العمل اليدوي التقليدي والمجهد.',
      iconBg: 'bg-[#ff9ad7]',
      icon: '🪄',
    },
    {
      title: 'دخل إضافي للمدرسة',
      description:
        'شراكة استراتيجية تشارك العوائد من الأنشطة المقامة في مقر مدرستك، وتحوّل مساحاتك إلى مصدر دخل مستدام دون تكاليف تشغيل إضافية.',
      iconBg: 'bg-[#2b4683]',
      icon: '💳',
    },
    {
      title: 'تواصل فعّال مع الأهالي',
      description:
        'ندوات واستشارات دورية مع نخبة من الخبراء تضع أولياء الأمور في قلب رحلة أبنائهم الإثرائية بشكل تفاعلي وتكاملي مستمر.',
      iconBg: 'bg-[#e88ecf]',
      icon: '💬',
    },
    {
      title: 'تقارير تُسهّل القرار',
      description:
        'تقارير فصلية وسنوية شاملة عن ذكاءات ومواهب طلاب مدرستك كافة، تدعم تنمية الشراكة البرامجية والخطط الطموحة.',
      iconBg: 'bg-[#7222e3]',
      icon: '🕒',
    },
  ]

  return (
    <section className="py-16 px-4 bg-slate-50/40" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-black text-slate-950 mb-2">لماذا إثراء الذكاء؟</h2>
          <p className="text-slate-400 text-xs max-w-xl mx-auto">
            أكثر من مجرد منصة — شراكة استراتيجية تجمع بين العلم والتقنية والخبرة لتمنح طلابك أفضل
            فرص النمو.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <WhyCard key={idx} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
