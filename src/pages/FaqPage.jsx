import { useState } from 'react';

const faqs = [
  {
    question: 'Do you ship internationally?',
    answer: 'Yes, we support global export and international delivery coordination for qualified orders and wholesale inquiries.'
  },
  {
    question: 'How do I place an inquiry or order?',
    answer: 'Customers can contact HK FITTERS directly through WhatsApp or email to request product details, pricing, MOQ, and shipping information.'
  },
  {
    question: 'Do you offer OEM or private label partnerships?',
    answer: 'Yes, we support OEM and private label projects for premium sportswear, branding, and export-ready manufacturing.'
  }
];

function FaqPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="page">
      <section className="section">
        <h1>FAQ</h1>
        <div className="faq-list">
          {faqs.map((item, index) => (
            <div className="summary-card faq-item" key={index}>
              <button className="faq-question" onClick={() => setOpenIndex(index === openIndex ? -1 : index)}>
                {item.question}
              </button>
              {openIndex === index && <p>{item.answer}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default FaqPage;
