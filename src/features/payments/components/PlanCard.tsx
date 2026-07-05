import React from 'react'

interface Feature {
  text: string
  included: boolean
}

interface PlanCardProps {
  title: string
  description: string
  price: number
  isYearly: boolean
  isPopular: boolean
  icon: string
  features: Feature[]
}

export const PlanCard: React.FC<PlanCardProps> = ({
  title,
  description,
  price,
  isYearly,
  isPopular,
  icon,
  features,
}) => {
  const whatsappNumber = '966500000000' // 👈 ضع رقم واتساب الخاص بالمنصة هنا بالصيغة الدولية
  const whatsappMessage = encodeURIComponent(
    `مرحباً إثراء الذكاء، أرغب في الاستفسار والاشتراك في "${title}" (باقة ${isYearly ? 'سنوية' : 'شهرية'}).`
  )
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <div
      className={`relative flex flex-col p-6 bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl ${
        isPopular ? 'border-[#7222e3] shadow-md scale-105 z-10' : 'border-slate-200'
      }`}
      dir="rtl"
    >
      {isPopular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-[#7222e3] to-[#e88ecf] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          🌟 الخيار الأفضل للمدارس
        </span>
      )}

      {/* الهيدر الخاص بالكارت */}
      <div className="mb-5 text-right">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{icon}</span>
          <h3
            className={`text-xl font-extrabold ${isPopular ? 'text-[#7222e3]' : 'text-slate-800'}`}
          >
            {title}
          </h3>
        </div>
        <p className="text-slate-500 text-xs min-h-[32px] leading-relaxed">{description}</p>
      </div>

      {/* السعر */}
      <div className="mb-6 text-right border-b border-slate-100 pb-5">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-slate-900">{price}</span>
          <span className="text-sm font-bold text-slate-500">
            ريال / {isYearly ? 'سنوياً' : 'شهرياً'}
          </span>
        </div>
      </div>

      {/* المميزات */}
      <ul className="space-y-3 mb-8 flex-1 text-right">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs">
            <span
              className={`mt-0.5 w-3 h-3 flex justify-center items-center rounded-full p-2.5 font-bold ${feature.included ? 'bg-[#9B3CE1] text-white' : 'bg-[#EFF1F5] text-[#141B34]'} `}
            >
              {feature.included ? '✓' : '-'}
            </span>
            <span
              className={
                feature.included ? 'text-slate-700 font-medium' : 'text-slate-400 line-through'
              }
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      {/* زر التوجيه للواتساب */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 transition-all duration-300 bg-linear-to-r from-[#C800DE] to-[#4F39F6] text-white hover:opacity-95 shadow-md`}
      >
        <span>اشترك الآن</span>
        <span className="text-xs">←</span>
      </a>
    </div>
  )
}
