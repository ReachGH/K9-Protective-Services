import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import ArrowDownRight from 'lucide-react/dist/esm/icons/arrow-down-right.js';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.js';
import Check from 'lucide-react/dist/esm/icons/check.js';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down.js';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up.js';
import Clock3 from 'lucide-react/dist/esm/icons/clock-3.js';
import HardHat from 'lucide-react/dist/esm/icons/hard-hat.js';
import Crosshair from 'lucide-react/dist/esm/icons/crosshair.js';
import Menu from 'lucide-react/dist/esm/icons/menu.js';
import MoveUpRight from 'lucide-react/dist/esm/icons/move-up-right.js';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check.js';
import Siren from 'lucide-react/dist/esm/icons/siren.js';
import X from 'lucide-react/dist/esm/icons/x.js';
const queryClient = new QueryClient();
const navItems = [
    ['Services', '#services'],
    ['Our standard', '#standard'],
    ['Approach', '#approach'],
    ['Contact', '#contact'],
];
const serviceItems = [
    {
        number: '01',
        title: 'Premises security',
        copy: 'A visible, measured deterrent for commercial premises, industrial sites, construction projects and high-value property.',
        icon: ShieldCheck,
    },
    {
        number: '02',
        title: 'Event security',
        copy: 'A discreet layer of confidence for launches, private gatherings, venues and public-facing events.',
        icon: Crosshair,
    },
    {
        number: '03',
        title: 'Mobile patrols',
        copy: 'Scheduled or responsive patrols that keep your site observed, documented and less predictable to intruders.',
        icon: Clock3,
    },
    {
        number: '04',
        title: 'Personal protection',
        copy: 'Close protection that respects your routine, your privacy and the people around you.',
        icon: Siren,
    },
    {
        number: '05',
        title: 'Construction site protection',
        copy: 'A visible K9 presence, perimeter patrols and access monitoring to help protect tools, machinery and materials from theft and vandalism, including after hours.',
        icon: HardHat,
    },
];
const faqs = [
    ['Are your teams licensed and insured?', 'Yes. K9 Protective Services teams are fully licensed, insured and briefed for the specific environment they work in. Credentials and documentation are available as part of your proposal.'],
    ['Will the dog be suitable around members of the public?', 'Our working dogs are trained for control and neutrality. We plan their deployment around your public, staff, visitors and operating rhythm.'],
    ['Can you cover a single event or short notice?', 'Often, yes. Availability depends on the brief, location and lead time. We will be clear about what is practical from the first conversation.'],
    ['Do you operate outside normal business hours?', 'Our service is built around your risk profile, not office hours. Ask us about scheduled patrols, overnight cover and responsive support.'],
];
function Brand({ footer = false }) {
    return (<a href="#top" className="group flex items-center gap-3" data-testid={footer ? 'link-footer-brand' : 'link-brand'}>
      <span className="relative flex h-10 w-10 items-center justify-center border border-[#8fc4cc]/70 text-[#8fc4cc] transition-colors group-hover:border-[#dcebed] group-hover:text-[#dcebed]">
        <ShieldCheck size={21} strokeWidth={1.4}/>
        <span className="absolute -bottom-px -right-px h-1.5 w-1.5 bg-[#8fc4cc]"/>
      </span>
      <span>
        <span className="block font-[var(--app-font-serif)] text-[16px] font-bold leading-none tracking-[.12em] text-[#f1f4f4]">K9</span>
        <span className="eyebrow mt-1 block text-[8px] tracking-[.18em] text-[#9baab0]">Protective Services</span>
      </span>
    </a>);
}
function Home() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [formState, setFormState] = useState({ name: '', email: '', service: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [openFaq, setOpenFaq] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    const updateForm = (key, value) => setFormState((current) => ({ ...current, [key]: value }));
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        setSubmitError('');
        try {
            const response = await fetch('/api/enquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formState),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Unable to send your enquiry.');
            setSubmitted(true);
        } catch (error) {
            setSubmitError(error.message || 'Unable to send your enquiry. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };
    return (<div className="grain min-h-[100dvh] bg-[#dfe4e5] text-[#111820]">
      <header className={`fixed inset-x-0 top-0 z-40 border-b transition-all duration-300 ${scrolled ? 'border-[#2b3b45] bg-[#0c1218]/95 backdrop-blur-md' : 'border-[#2b3b45] bg-[#0c1218]'}`}>
        <div className="mx-auto flex h-[78px] max-w-[1360px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Brand />
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
            {navItems.map(([label, href]) => (<a key={href} href={href} className="text-[11px] font-semibold uppercase tracking-[.17em] text-[#b8c3c7] transition-colors hover:text-[#8fc4cc]" data-testid={`link-nav-${label.toLowerCase().replace(' ', '-')}`}>{label}</a>))}
          </nav>
          <a href="#contact" className="hidden items-center gap-2 border border-[#8fc4cc]/70 px-5 py-3 text-[10px] font-bold uppercase tracking-[.17em] text-[#d7e9eb] transition-colors hover:bg-[#8fc4cc] hover:text-[#0c1218] sm:flex" data-testid="link-request-assessment">Request an assessment <ArrowDownRight size={15}/></a>
          <button type="button" onClick={() => setMenuOpen((open) => !open)} className="p-2 text-[#edf1f2] sm:hidden" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} data-testid="button-mobile-menu">{menuOpen ? <X size={22}/> : <Menu size={22}/>}</button>
        </div>
        {menuOpen && (<div className="border-t border-[#2b3b45] bg-[#101820] px-5 pb-5 pt-2 sm:hidden">
            {navItems.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="block border-b border-[#2b3b45] py-4 text-[11px] font-bold uppercase tracking-[.16em] text-[#d6dfe1]" data-testid={`link-mobile-${label.toLowerCase().replace(' ', '-')}`}>{label}</a>)}
            <a href="#contact" onClick={() => setMenuOpen(false)} className="mt-4 flex items-center justify-between bg-[#8fc4cc] px-4 py-4 text-[10px] font-bold uppercase tracking-[.16em] text-[#0c1218]" data-testid="link-mobile-assessment">Request an assessment <ArrowRight size={15}/></a>
          </div>)}
      </header>

      <main id="top">
        <section className="hero text-[#edf1f2]">
          <div className="hero-media" aria-hidden="true">
            <img
              className="hero-image"
              src="/northline-hero.jpg"
              alt=""
              width="1024"
              height="1024"
              fetchPriority="high"
              decoding="async"
              onError={(event) => {
                if (!event.currentTarget.src.endsWith('/k9-hero.jpg')) {
                  event.currentTarget.src = '/k9-hero.jpg';
                }
              }}
            />
            <div className="hero-shade" />
          </div>
          <div className="grid-lines absolute inset-0 opacity-20"/>
          <div className="hero-content relative mx-auto flex max-w-[1360px] px-5 sm:px-8 lg:px-12">
            <div className="hero-copy">
              <div className="animate-rise eyebrow mb-7 flex items-center gap-3 text-[#8fc4cc]"><span className="h-px w-10 bg-[#8fc4cc]"/> Australian K9 security</div>
              <h1 className="hero-title animate-rise delay-1 display font-semibold leading-[.9] text-[#edf1f2]">Protection<br /><span className="text-[#8fc4cc]">under control.</span></h1>
              <p className="animate-rise delay-2 mt-9 max-w-[530px] text-[16px] leading-7 text-[#c2ced1] sm:text-[18px]">K9 Protective Services is an Australian company providing canine security for businesses, sites, events and private clients who require a calm, capable presence — properly briefed and ready to act.</p>
              <div className="animate-rise delay-3 mt-10 flex flex-col gap-3 sm:flex-row">
                <a href="#contact" className="flex items-center justify-center gap-3 bg-[#8fc4cc] px-6 py-4 text-[10px] font-extrabold uppercase tracking-[.17em] text-[#0c1218] transition-transform hover:-translate-y-1" data-testid="link-hero-enquiry">Start a conversation <ArrowRight size={16}/></a>
                <a href="#services" className="flex items-center justify-center gap-3 border border-[#aab7bc]/60 px-6 py-4 text-[10px] font-extrabold uppercase tracking-[.17em] text-[#edf1f2] transition-colors hover:border-[#8fc4cc] hover:text-[#8fc4cc]" data-testid="link-hero-services">View capabilities <MoveUpRight size={15}/></a>
              </div>
            </div>
            <div className="hero-principle absolute hidden max-w-[220px] border-l border-[#8fc4cc] pl-4 xl:block">
              <p className="eyebrow text-[#8e9da3]">Our principle</p>
              <p className="mt-2 text-[13px] leading-5 text-[#d7e0e2]">Prepared before the brief becomes urgent.</p>
            </div>
          </div>
        </section>

        <section className="border-b border-[#53626a] bg-[#17232b] text-[#dce6e8]">
          <div className="mx-auto grid max-w-[1360px] grid-cols-2 lg:grid-cols-4">
            {[
            ['01', 'Visible capability'],
            ['02', 'Handlers with judgement'],
            ['03', 'Documented every shift'],
            ['04', 'Ready when required'],
        ].map(([number, text]) => (<div key={number} className="border-r border-[#53626a] px-5 py-6 last:border-r-0 sm:px-8 lg:px-12" data-testid={`text-principle-${number}`}>
                <span className="font-[var(--app-font-mono)] text-[10px] text-[#8fc4cc]">{number}</span>
                <p className="mt-2 max-w-[190px] text-[11px] font-bold uppercase leading-4 tracking-[.08em]">{text}</p>
              </div>))}
          </div>
        </section>

        <section id="services" className="scroll-mt-20 bg-[#dfe4e5] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="mx-auto grid max-w-[1360px] gap-14 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
            <div>
              <div className="eyebrow flex items-center gap-3 text-[#466c74]"><span className="h-px w-8 bg-[#6dabb5]"/> Capabilities</div>
              <h2 className="display mt-5 max-w-[500px] text-[clamp(2.85rem,5vw,5.5rem)] font-semibold leading-[.9]">A security presence built for <em className="not-italic text-[#4b858f]">real conditions.</em></h2>
              <p className="mt-7 max-w-[430px] text-[15px] leading-7 text-[#526067]">Our teams are placed where reassurance matters: at the gate, on the perimeter, alongside your people, before a situation becomes an incident.</p>
              <a href="#contact" className="mt-9 inline-flex items-center gap-3 border-b border-[#17232b] pb-2 text-[10px] font-extrabold uppercase tracking-[.17em] text-[#17232b] transition-colors hover:border-[#4b858f] hover:text-[#4b858f]" data-testid="link-services-consultation">Talk through your requirements <ArrowRight size={15}/></a>
            </div>
            <div className="border-t border-[#9eacb0]">
              {serviceItems.map(({ number, title, copy, icon: Icon }) => (<div key={number} className="scanline group grid grid-cols-[42px_1fr_auto] gap-4 border-b border-[#9eacb0] py-7 sm:grid-cols-[58px_1fr_auto] sm:gap-6" data-testid={`card-service-${number}`}>
                  <span className="font-[var(--app-font-mono)] text-[11px] text-[#4b858f]">{number}</span>
                  <div><h3 className="font-[var(--app-font-serif)] text-[24px] font-semibold tracking-[-.03em] text-[#17232b] sm:text-[29px]">{title}</h3><p className="mt-2 max-w-[490px] text-[13px] leading-6 text-[#637077]">{copy}</p></div>
                  <Icon size={20} strokeWidth={1.5} className="mt-1 text-[#4b858f] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"/>
                </div>))}
            </div>
          </div>
        </section>

        <section id="standard" className="scroll-mt-20 bg-[#101820] text-[#edf1f2]">
          <div className="mx-auto grid max-w-[1360px] lg:grid-cols-[1.06fr_.94fr]">
            <div className="grid-lines px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
              <div className="eyebrow flex items-center gap-3 text-[#8fc4cc]"><span className="h-px w-8 bg-[#8fc4cc]"/> The K9 Protective Services standard</div>
              <h2 className="display mt-6 max-w-[700px] text-[clamp(2.8rem,5.5vw,6.7rem)] font-semibold leading-[.88]">Professionalism is a <span className="text-[#8fc4cc]">behaviour.</span></h2>
              <p className="mt-8 max-w-[500px] text-[15px] leading-7 text-[#bac7ca]">We do not bring aggression to a vulnerable situation. We bring preparation, judgement and the ability to stay clear-headed when other people cannot.</p>
              <div className="mt-12 grid max-w-[590px] gap-7 sm:grid-cols-2">
                {['Licensed and insured teams', 'Scenario-led K9 training', 'Briefings built around you', 'Incident-ready reporting'].map((item) => <div key={item} className="flex items-center gap-3 border-t border-[#38505a] pt-4 text-[11px] font-semibold uppercase tracking-[.08em] text-[#d8e2e4]"><Check size={16} className="shrink-0 text-[#8fc4cc]"/> {item}</div>)}
              </div>
            </div>
            <div className="relative min-h-[420px] overflow-hidden border-l border-[#263943] bg-[#17232b]">
              <div className="absolute inset-0 bg-contain bg-right bg-no-repeat opacity-45 grayscale" style={{ backgroundImage: "url('/northline-hero.jpg'), url('/k9-hero.jpg')" }}/>
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,24,32,.94),rgba(16,24,32,.2))]"/>
              <div className="absolute bottom-8 left-8 right-8 border border-[#8fc4cc]/45 p-6 sm:bottom-12 sm:left-12 sm:right-12"><p className="eyebrow text-[#8fc4cc]">In the field</p><p className="mt-3 max-w-[360px] font-[var(--app-font-serif)] text-[24px] leading-tight text-[#edf1f2]">“Quiet enough to fit in. Capable enough to change the outcome.”</p></div>
            </div>
          </div>
        </section>

        <section id="approach" className="scroll-mt-20 bg-[#cbd3d5] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1360px]">
            <div className="flex flex-col justify-between gap-6 border-b border-[#8e9da2] pb-8 sm:flex-row sm:items-end"><div><div className="eyebrow text-[#466c74]">Operating method</div><h2 className="display mt-4 text-[clamp(2.7rem,5vw,5.7rem)] font-semibold leading-[.88]">Clear from<br />the first call.</h2></div><p className="max-w-[310px] text-[14px] leading-6 text-[#526067]">A straightforward process that takes the unknowns out of protective security.</p></div>
            <div className="grid gap-0 md:grid-cols-3">
              {[['01', 'Listen first', 'We learn the site, the people, the pressures and the outcome you need.'], ['02', 'Build the brief', 'Your plan balances visibility, discretion, response and budget.'], ['03', 'Stay accountable', 'Your handler reports clearly, reviews regularly and keeps improving.']].map(([num, title, copy], index) => <div key={num} className={`border-b border-[#8e9da2] py-8 md:border-b-0 md:border-r md:px-8 md:py-12 ${index === 0 ? 'md:pl-0' : ''} ${index === 2 ? 'md:border-r-0' : ''}`} data-testid={`card-approach-${num}`}><span className="flex h-11 w-11 items-center justify-center border border-[#4b858f] font-[var(--app-font-mono)] text-[11px] text-[#386772]">{num}</span><h3 className="mt-9 font-[var(--app-font-serif)] text-[28px] font-semibold tracking-[-.03em]">{title}</h3><p className="mt-3 max-w-[260px] text-[14px] leading-6 text-[#526067]">{copy}</p>{index !== 2 && <ArrowRight className="mt-8 text-[#4b858f]" size={20}/>}</div>)}
            </div>
          </div>
        </section>

        <section className="bg-[#0c1218] px-5 py-24 text-[#edf1f2] sm:px-8 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1360px]"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-24"><div><div className="eyebrow text-[#8fc4cc]">Questions, answered</div><h2 className="display mt-5 text-[clamp(2.7rem,4vw,4.8rem)] font-semibold leading-[.9]">No theatre.<br />No hard sell.</h2><p className="mt-6 max-w-[310px] text-[14px] leading-6 text-[#9eabb0]">Tell us what you are protecting. We will tell you what we would do.</p></div><div className="border-t border-[#30414b]">{faqs.map(([question, answer], index) => <div key={question} className="border-b border-[#30414b]"><button type="button" className="flex w-full items-center justify-between gap-5 py-6 text-left" onClick={() => setOpenFaq(openFaq === index ? null : index)} data-testid={`button-faq-${index}`}><span className="text-[15px] font-semibold text-[#edf1f2]">{question}</span>{openFaq === index ? <ChevronUp size={18} className="shrink-0 text-[#8fc4cc]"/> : <ChevronDown size={18} className="shrink-0 text-[#8fc4cc]"/>}</button>{openFaq === index && <p className="max-w-[650px] pb-6 pr-10 text-[14px] leading-6 text-[#aab7bb]" data-testid={`text-faq-answer-${index}`}>{answer}</p>}</div>)}</div></div></div>
        </section>

        <section id="contact" className="scroll-mt-20 bg-[#17232b] px-5 py-20 text-[#edf1f2] sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto grid max-w-[1360px] gap-14 lg:grid-cols-[.82fr_1.18fr] lg:gap-24">
            <div><div className="eyebrow text-[#8fc4cc]">Start with a conversation</div><h2 className="display mt-5 text-[clamp(3rem,5.5vw,6.4rem)] font-semibold leading-[.86]">Put the right<br /><span className="text-[#8fc4cc]">people in place.</span></h2><p className="mt-8 max-w-[390px] text-[15px] leading-7 text-[#b8c5c8]">For a site assessment, event brief or confidential conversation, use the form. We will respond with a clear next step.</p><div className="mt-10 border-t border-[#3d535d] pt-6 text-[13px] leading-6 text-[#afbdc0]"><p className="font-bold uppercase tracking-[.1em] text-[#edf1f2]">K9 Protective Services</p><p className="mt-2">Australian security company<br />Site assessments by appointment<br />Enquire about availability in your area</p></div></div>
            <div className="bg-[#dfe4e5] p-6 text-[#111820] shadow-[10px_10px_0_#8fc4cc] sm:p-9">
              {submitted ? <div className="flex min-h-[410px] flex-col justify-center" data-testid="status-enquiry-success"><span className="flex h-14 w-14 items-center justify-center bg-[#4b858f] text-[#edf1f2]"><Check size={27}/></span><h3 className="display mt-7 text-[38px] font-semibold leading-none">Message received.</h3><p className="mt-5 max-w-[390px] text-[14px] leading-6 text-[#59666a]">Thank you, {formState.name.split(' ')[0] || 'there'}. Your enquiry has been received by K9 Protective Services.</p><button type="button" onClick={() => { setSubmitted(false); setFormState({ name: '', email: '', service: '', message: '' }); }} className="mt-8 inline-flex w-fit items-center gap-2 border-b border-[#17232b] pb-2 text-[10px] font-bold uppercase tracking-[.15em] text-[#17232b]" data-testid="button-send-another">Send another enquiry <ArrowRight size={15}/></button></div> : <form onSubmit={handleSubmit} className="space-y-5" noValidate><div className="mb-8"><p className="eyebrow text-[#4b858f]">Enquiry form</p><h3 className="display mt-3 text-[36px] font-semibold leading-none text-[#111820]">Tell us what<br />needs protecting.</h3></div><div className="grid gap-5 sm:grid-cols-2"><label className="block"><span className="eyebrow text-[#647278]">Your name</span><input required value={formState.name} onChange={(event) => updateForm('name', event.target.value)} className="mt-2 w-full border-0 border-b border-[#aab7bb] bg-transparent px-0 py-3 text-[14px] text-[#111820] outline-none transition-colors placeholder:text-[#7b898e] focus:border-[#4b858f]" placeholder="Full name" data-testid="input-enquiry-name"/></label><label className="block"><span className="eyebrow text-[#647278]">Email address</span><input required type="email" value={formState.email} onChange={(event) => updateForm('email', event.target.value)} className="mt-2 w-full border-0 border-b border-[#aab7bb] bg-transparent px-0 py-3 text-[14px] text-[#111820] outline-none transition-colors placeholder:text-[#7b898e] focus:border-[#4b858f]" placeholder="you@company.com" data-testid="input-enquiry-email"/></label></div><label className="block"><span className="eyebrow text-[#647278]">What can we help with?</span><select required value={formState.service} onChange={(event) => updateForm('service', event.target.value)} className="mt-2 w-full border-0 border-b border-[#aab7bb] bg-transparent px-0 py-3 text-[14px] text-[#111820] outline-none focus:border-[#4b858f]" data-testid="select-enquiry-service"><option value="">Select a service</option><option value="Premises security">Premises security</option><option value="Event security">Event security</option><option value="Mobile patrols">Mobile patrols</option><option value="Personal protection">Personal protection</option><option value="Construction site protection">Construction site protection</option><option value="Not sure yet">Not sure yet</option></select></label><label className="block"><span className="eyebrow text-[#647278]">A little about the brief</span><textarea required rows={3} value={formState.message} onChange={(event) => updateForm('message', event.target.value)} className="mt-2 w-full resize-none border-0 border-b border-[#aab7bb] bg-transparent px-0 py-3 text-[14px] text-[#111820] outline-none transition-colors placeholder:text-[#7b898e] focus:border-[#4b858f]" placeholder="Location, timing and what you need..." data-testid="textarea-enquiry-message"/></label>{submitError && <p role="alert" className="text-sm text-red-700">{submitError}</p>}<button type="submit" disabled={submitting} className="mt-3 flex w-full items-center justify-between bg-[#0c1218] px-5 py-4 text-[10px] font-bold uppercase tracking-[.16em] text-[#edf1f2] transition-colors hover:bg-[#4b858f]" data-testid="button-submit-enquiry">{submitting ? 'Sending...' : 'Submit enquiry'} <ArrowRight size={17}/></button><p className="text-[11px] leading-5 text-[#68767b]">We will only use these details to respond to your enquiry. No marketing list, no automated follow-up.</p></form>}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0c1218] px-5 py-12 text-[#edf1f2] sm:px-8 lg:px-12"><div className="mx-auto flex max-w-[1360px] flex-col justify-between gap-10 sm:flex-row"><div><Brand footer/><p className="mt-5 max-w-[280px] text-[12px] leading-5 text-[#93a2a7]">Disciplined canine security for places, people and peace of mind.</p></div><div className="flex flex-col gap-3 text-left sm:text-right"><p className="eyebrow text-[#71848a]">Australian K9 security</p><a href="#contact" className="text-[13px] text-[#c5d0d2] hover:text-[#8fc4cc]" data-testid="link-footer-enquiry">Contact K9 Protective Services</a><p className="text-[12px] text-[#93a2a7]">Assessments by appointment</p></div></div><div className="mx-auto mt-12 flex max-w-[1360px] flex-col justify-between gap-3 border-t border-[#2b3b45] pt-5 text-[10px] uppercase tracking-[.12em] text-[#71848a] sm:flex-row"><span>© {new Date().getFullYear()} K9 Protective Services</span><span>Professional presence. Measured response.</span></div></footer>
    </div>);
}
function Router() {
    return <RoutedErrorBoundary><Switch><Route path="/" component={Home}/><Route component={NotFound}/></Switch></RoutedErrorBoundary>;
}
function RoutedErrorBoundary({ children }) {
    const [location] = useLocation();
    return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}
function App() {
    return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}
export default App;

