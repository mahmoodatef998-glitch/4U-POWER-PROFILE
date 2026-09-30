import type { L10n } from "@/lib/utils";

// CONTENT_TODO: have these reviewed by the company's legal adviser before launch.
export type LegalDoc = { h1: L10n; updated: string; intro: L10n; sections: { title: L10n; body: L10n }[] };

export const privacy: LegalDoc = {
  h1: { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  updated: "2026-09-29",
  intro: {
    en: "This policy explains how 4U POWER GENERATION (FZC), SAIF Zone Licence No. 23919 (\"4U\", \"we\"), handles personal data collected through this website. We process data in line with the UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data.",
    ar: "توضح هذه السياسة كيف تتعامل فور يو باور جينيريشن (ش.م.ح)، رخصة سيف زون رقم 23919 (\"فور يو\" أو \"نحن\") مع البيانات الشخصية التي تُجمع عبر هذا الموقع. نعالج البيانات وفق المرسوم بقانون اتحادي رقم 45 لسنة 2021 بشأن حماية البيانات الشخصية في دولة الإمارات.",
  },
  sections: [
    {
      title: { en: "1. Data we collect", ar: "1. البيانات التي نجمعها" },
      body: {
        en: "When you submit a quote or contact form we collect your name, phone/WhatsApp number, optional email, country and message, plus the page you submitted from and any advertising campaign parameters (such as utm_source or gclid). When you use the kVA calculator we store the anonymous inputs and result (load, power factor, recommended kVA) without personal identifiers. Our analytics tools (Google Analytics, Google Tag Manager, Meta Pixel), when enabled, collect device and usage data through cookies.",
        ar: "عند إرسال نموذج طلب السعر أو التواصل نجمع اسمك ورقم الهاتف/الواتساب والبريد الإلكتروني الاختياري والدولة والرسالة، إضافة إلى الصفحة التي أرسلت منها ومعاملات الحملات الإعلانية (مثل utm_source أو gclid). وعند استخدام حاسبة القدرة نحفظ المدخلات والنتيجة بشكل مجهول (الحمل ومعامل القدرة والقدرة الموصى بها) دون أي بيانات تعريفية. وعند تفعيل أدوات التحليل (Google Analytics وGoogle Tag Manager وMeta Pixel) فإنها تجمع بيانات الجهاز والاستخدام عبر ملفات تعريف الارتباط.",
      },
    },
    {
      title: { en: "2. How we use it", ar: "2. كيف نستخدمها" },
      body: {
        en: "To respond to your enquiry, prepare quotations, follow up by phone, WhatsApp or email, improve our website and measure the performance of our advertising. We do not sell personal data.",
        ar: "للرد على استفسارك وإعداد عروض الأسعار والمتابعة عبر الهاتف أو الواتساب أو البريد الإلكتروني، ولتحسين موقعنا وقياس أداء إعلاناتنا. نحن لا نبيع البيانات الشخصية.",
      },
    },
    {
      title: { en: "3. Where it is stored", ar: "3. أين تُخزن" },
      body: {
        en: "Form submissions are stored in a secured database hosted by Supabase and the website is hosted by Vercel; both may process data outside the UAE under appropriate safeguards. Access is limited to authorised 4U staff.",
        ar: "تُخزن بيانات النماذج في قاعدة بيانات آمنة لدى Supabase، ويُستضاف الموقع لدى Vercel، وقد تتم المعالجة خارج دولة الإمارات مع ضمانات مناسبة. ويقتصر الوصول على موظفي فور يو المصرح لهم.",
      },
    },
    {
      title: { en: "4. WhatsApp and phone", ar: "4. الواتساب والهاتف" },
      body: {
        en: "Clicking a WhatsApp button opens WhatsApp, operated by Meta, with a pre-filled message. Conversations there are subject to WhatsApp's own privacy policy.",
        ar: "الضغط على زر الواتساب يفتح تطبيق واتساب التابع لشركة Meta برسالة جاهزة، وتخضع المحادثات هناك لسياسة الخصوصية الخاصة بواتساب.",
      },
    },
    {
      title: { en: "5. Retention", ar: "5. مدة الاحتفاظ" },
      body: {
        en: "We keep enquiry records for up to 5 years for commercial and legal purposes, then delete or anonymise them.",
        ar: "نحتفظ بسجلات الاستفسارات لمدة تصل إلى 5 سنوات لأغراض تجارية وقانونية، ثم نحذفها أو نجعلها مجهولة.",
      },
    },
    {
      title: { en: "6. Your rights", ar: "6. حقوقك" },
      body: {
        en: "You may request access to, correction of, or deletion of your personal data, or object to marketing contact, by writing to info@4ugenerators.com or messaging +971 52 336 7694.",
        ar: "يمكنك طلب الاطلاع على بياناتك الشخصية أو تصحيحها أو حذفها، أو الاعتراض على التواصل التسويقي، بالكتابة إلى info@4ugenerators.com أو مراسلة ‎+971 52 336 7694.",
      },
    },
    {
      title: { en: "7. Contact", ar: "7. التواصل" },
      body: {
        en: "4U POWER GENERATION (FZC), 600 M² Warehouse A2-020, SAIF Zone, P.O. Box 513810, Sharjah, United Arab Emirates.",
        ar: "فور يو باور جينيريشن (ش.م.ح)، مستودع A2-020 (600 م²)، المنطقة الحرة لمطار الشارقة الدولي، ص.ب 513810، الشارقة، الإمارات العربية المتحدة.",
      },
    },
  ],
};

export const terms: LegalDoc = {
  h1: { en: "Terms of Use", ar: "شروط الاستخدام" },
  updated: "2026-09-29",
  intro: {
    en: "These terms govern your use of the website operated by 4U POWER GENERATION (FZC), SAIF Zone Licence No. 23919. By using the site you accept them.",
    ar: "تحكم هذه الشروط استخدامك للموقع الذي تديره فور يو باور جينيريشن (ش.م.ح)، رخصة سيف زون رقم 23919، وباستخدامك للموقع فإنك توافق عليها.",
  },
  sections: [
    {
      title: { en: "1. Product information", ar: "1. معلومات المنتجات" },
      body: {
        en: "Specifications, ratings and images on this site are indicative and may change without notice. Images marked as illustrations are not photographs of actual stock. Binding specifications are those stated in our written quotation and the manufacturer's datasheet.",
        ar: "المواصفات والقدرات والصور في هذا الموقع استرشادية وقد تتغير دون إشعار. الصور الموسومة كرسوم توضيحية ليست صوراً للمخزون الفعلي. المواصفات الملزمة هي الواردة في عرض السعر المكتوب ونشرة الشركة المصنعة.",
      },
    },
    {
      title: { en: "2. kVA calculator", ar: "2. حاسبة القدرة" },
      body: {
        en: "The calculator provides an estimate only. It does not replace a site survey or an engineer's load study. 4U accepts no liability for equipment selected solely on the basis of calculator output.",
        ar: "تقدم الحاسبة تقديراً فقط ولا تغني عن المعاينة الميدانية أو دراسة الأحمال من قبل مهندس. لا تتحمل فور يو أي مسؤولية عن معدات يتم اختيارها بناءً على نتيجة الحاسبة وحدها.",
      },
    },
    {
      title: { en: "3. Quotations and orders", ar: "3. عروض الأسعار والطلبات" },
      body: {
        en: "Prices are provided on request by written quotation. A contract is formed only when we confirm an order in writing. Delivery terms, warranty and payment conditions are those stated in the quotation.",
        ar: "تُقدم الأسعار عند الطلب بعرض سعر مكتوب، ولا ينعقد العقد إلا بتأكيدنا الكتابي للطلب. شروط التسليم والضمان والدفع هي الواردة في عرض السعر.",
      },
    },
    {
      title: { en: "4. Trademarks", ar: "4. العلامات التجارية" },
      body: {
        en: "Perkins, Cummins, Kubota, Volvo Penta and other names are trademarks of their respective owners and are used only to identify the engines and components we supply. Their use does not imply an official dealership unless expressly stated.",
        ar: "بيركنز وكمنز وكوبوتا وفولفو بنتا وغيرها علامات تجارية مملوكة لأصحابها، وتُستخدم فقط لتعريف المحركات والمكونات التي نوردها، ولا يعني استخدامها وجود وكالة رسمية ما لم يُذكر ذلك صراحة.",
      },
    },
    {
      title: { en: "5. Liability", ar: "5. المسؤولية" },
      body: {
        en: "To the extent permitted by law, 4U is not liable for indirect or consequential loss arising from use of this website.",
        ar: "في الحدود التي يسمح بها القانون، لا تتحمل فور يو المسؤولية عن أي خسائر غير مباشرة أو تبعية ناتجة عن استخدام هذا الموقع.",
      },
    },
    {
      title: { en: "6. Governing law", ar: "6. القانون الواجب التطبيق" },
      body: {
        en: "These terms are governed by the laws of the Emirate of Sharjah and the federal laws of the United Arab Emirates. The courts of Sharjah have jurisdiction.",
        ar: "تخضع هذه الشروط لقوانين إمارة الشارقة والقوانين الاتحادية لدولة الإمارات العربية المتحدة، وتختص محاكم الشارقة بالنظر في أي نزاع.",
      },
    },
  ],
};
