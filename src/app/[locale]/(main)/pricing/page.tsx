import { FeaturesTable } from '@/features/payments/components/FeaturesTable'
import { PricingSection } from '@/features/payments/components/PricingSection'
import { WhyUsSection } from '@/features/payments/components/WhyUseSection'

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-[#f8fafc] to-white pt-24 pb-12">
      {/* 1. كروت الباقات الأساسية وتحويل العملات (شهري/سنوي) */}
      <PricingSection />

      {/* 2. جدول مقارنة الخصائص التفصيلي المأخوذ من الـ image_6d43be.png */}
      <FeaturesTable />

      {/* 3. سيكشن المزايا الستة "لماذا إثراء الذكاء؟" المأخوذ من الـ image_6d4327.png */}
      <WhyUsSection />

      {/* 4. البانر الختامي التحفيزي */}
      <div className="max-w-4xl mx-auto mt-16 px-4">
        <div className="bg-linear-to-r from-[#2b4683] to-[#7222e3] p-8 rounded-2xl text-center text-white shadow-lg">
          <h3 className="text-lg md:text-xl font-bold mb-2">مدرستك تستحق أن تكون حاضنة مواهب</h3>
          <p className="text-white/80 text-xs max-w-md mx-auto mb-5">
            تأهيل وتعليم الأطفال أصبح أسهل مع خدماتنا الرقمية المدعومة بأحدث المناهج العلمية.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-[#7222e3] px-6 py-2.5 rounded-xl font-bold text-xs shadow hover:bg-opacity-90 transition">
              احسب التكلفة المخصصة لمدرستك
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
