'use client'

import React, { useState } from 'react'
import { PlanCard } from './PlanCard'
import plansData from '../plans/plans.json' // 👈 تأكد من صحة مسار ملف الـ JSON

export const PricingSection: React.FC = () => {
  const [isYearly, setIsYearly] = useState<boolean>(true)

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto" dir="rtl">
      {/* العناوين الرئيسية المقتبسة من الهوية البصرية */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">
          اكتشف ذكاء كل طالب واجعل مدرستك{' '}
          <span className="text-[#7222e3] bg-clip-text">حاضنة مواهب</span>
        </h2>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          اختر ما يناسب مدرستك تماماً وابدأ رحلة التوجيه العلمي المستقبلي الموثوق لأطفالك.
        </p>

        {/* زر التبديل الفليب (شهري / سنوي) */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className={`text-xs font-bold ${!isYearly ? 'text-[#7222e3]' : 'text-slate-400'}`}>
            شهرياً
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="w-12 h-6 bg-slate-200 rounded-full p-1 transition-colors duration-300 focus:outline-none relative"
            aria-label="Toggle pricing"
          >
            <div
              className={`w-4 h-4 bg-[#7222e3] rounded-full shadow-md transition-transform duration-300 transform ${
                isYearly ? 'translate-x-0' : '-translate-x-6'
              }`}
            />
          </button>
          <span className={`text-xs font-bold ${isYearly ? 'text-[#7222e3]' : 'text-slate-400'}`}>
            سنوياً
          </span>
        </div>
      </div>

      {/* شبكة الباقات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
        {plansData.map((plan) => (
          <PlanCard
            key={plan.id}
            title={plan.title}
            description={plan.description}
            price={isYearly ? plan.priceYearly : plan.priceMonthly}
            isYearly={isYearly}
            isPopular={plan.isPopular}
            icon={plan.icon}
            features={plan.features}
          />
        ))}
      </div>
    </section>
  )
}
