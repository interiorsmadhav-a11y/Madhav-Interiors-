import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, User } from 'lucide-react';
import { getPageContent } from '@/services/contentService';

export default function Contact() {
  const [content, setContent] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    projectType: '',
    message: ''
  });

  useEffect(() => {
    const fetchContent = async () => {
      const data = await getPageContent('contact');
      if (data) setContent(data);
    };
    fetchContent();
  }, []);

  const phone1 = content?.phone1 || "+91 7387383117";
  const phone2 = content?.phone2 || "+91 9922210180";
  const email = content?.email || "Interiorsmadhav@gmail.com";
  const address = content?.address || "Katraj Pune, Maharashtra - 411046";

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`New Enquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nCity: ${formData.city}\nProject Type: ${formData.projectType}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:Interiorsmadhav@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    // Reset form after a delay
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="text-brand-wood uppercase tracking-widest text-xs font-semibold mb-4 block">Get in Touch</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-brand-charcoal mb-8">
            Let's discuss your project.
          </h1>
          <p className="text-lg text-brand-charcoal/70 leading-relaxed">
            Whether you're looking to redesign a single room or your entire home, we're here to help. Reach out to us for a consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="bg-brand-ivory p-10 md:p-16 rounded-2xl">
            <h3 className="text-2xl font-serif text-brand-charcoal mb-8">Contact Information</h3>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <MapPin className="text-brand-wood shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-medium text-brand-charcoal mb-1">Our Studio</h4>
                  <p className="text-brand-charcoal/70 leading-relaxed">
                    {address}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Phone className="text-brand-wood shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-medium text-brand-charcoal mb-1">Phone</h4>
                  <p className="text-brand-charcoal/70 leading-relaxed">
                    Tulsiram Jangir: {phone1}<br />
                    Arjun Jangir: {phone2}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Mail className="text-brand-wood shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-medium text-brand-charcoal mb-1">Email</h4>
                  <p className="text-brand-charcoal/70 leading-relaxed">
                    {email}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <User className="text-brand-wood shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-medium text-brand-charcoal mb-1">Founders</h4>
                  <p className="text-brand-charcoal/70 leading-relaxed">
                    Tulsiram Jangir & Arjun Jangir
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="text-brand-wood shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-medium text-brand-charcoal mb-1">Working Hours</h4>
                  <p className="text-brand-charcoal/70 leading-relaxed">
                    Monday - Saturday: 10:00 AM - 7:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-serif text-brand-charcoal mb-8">Send us a message</h3>
            {submitted ? (
              <div className="bg-brand-wood/10 border border-brand-wood/20 p-8 rounded-2xl text-center">
                <h4 className="text-xl font-serif text-brand-charcoal mb-2">Thank you!</h4>
                <p className="text-brand-charcoal/70">Your message has been prepared. Please send the email that just opened to complete your enquiry.</p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-brand-charcoal mb-2">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border-b border-brand-charcoal/20 py-3 bg-transparent focus:outline-none focus:border-brand-wood transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-brand-charcoal mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full border-b border-brand-charcoal/20 py-3 bg-transparent focus:outline-none focus:border-brand-wood transition-colors"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-brand-charcoal mb-2">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border-b border-brand-charcoal/20 py-3 bg-transparent focus:outline-none focus:border-brand-wood transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-brand-charcoal mb-2">City</label>
                    <input 
                      type="text" 
                      id="city" 
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full border-b border-brand-charcoal/20 py-3 bg-transparent focus:outline-none focus:border-brand-wood transition-colors"
                      placeholder="Pune"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="projectType" className="block text-sm font-medium text-brand-charcoal mb-2">Project Type</label>
                  <select 
                    id="projectType" 
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-brand-charcoal/20 py-3 bg-transparent focus:outline-none focus:border-brand-wood transition-colors text-brand-charcoal/70"
                  >
                    <option value="">Select a project type</option>
                    <option value="full-home">Full Home Interiors</option>
                    <option value="kitchen">Modular Kitchen</option>
                    <option value="living-room">Living Room</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="commercial">Commercial/Office</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-brand-charcoal mb-2">Message</label>
                  <textarea 
                    id="message" 
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-brand-charcoal/20 py-3 bg-transparent focus:outline-none focus:border-brand-wood transition-colors resize-none"
                    placeholder="Tell us a bit about your project..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="bg-brand-charcoal text-white px-8 py-4 text-sm uppercase tracking-wider font-medium hover:bg-brand-wood transition-colors w-full mt-4"
                >
                  Submit Enquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
