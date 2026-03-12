import { useState } from 'react';
import { Brain, FileText, TrendingUp, ExternalLink, X, BookOpen, Calendar } from 'lucide-react';
import { SlideContainer, SlideHeader, SlideFooter } from './design-system';

export function SlideCompetitiveIntel({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showGlossaryModal, setShowGlossaryModal] = useState(false);
  const [showPagesModal, setShowPagesModal] = useState(false);
  const [showPagesDropdown, setShowPagesDropdown] = useState(false);
  const [showBlogsDropdown, setShowBlogsDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'paloalto' | 'crowdstrike'>('paloalto');
  const [showCrowdstrikeDropdown, setShowCrowdstrikeDropdown] = useState(false);

  const glossaryPages = [
    { category: 'AI Fundamentals', title: 'Artificial Intelligence (AI)', url: 'https://www.paloaltonetworks.com/cyberpedia/artificial-intelligence-ai' },
    { category: 'AI Fundamentals', title: 'Machine Learning (ML)', url: 'https://www.paloaltonetworks.com/cyberpedia/machine-learning-ml' },
    { category: 'AI Fundamentals', title: 'What is Generative AI', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-generative-ai' },
    { category: 'AI Fundamentals', title: 'What is Responsible AI', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-responsible-ai' },
    { category: 'AI Fundamentals', title: 'What is AI Bias', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-ai-bias' },
    { category: 'AI Fundamentals', title: 'What is Federated Learning', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-federated-learning' },
    { category: 'AI Fundamentals', title: 'Black Box AI', url: 'https://www.paloaltonetworks.com/cyberpedia/black-box-ai' },
    { category: 'AI Fundamentals', title: 'What is RLHF', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-rlhf' },
    { category: 'AI Fundamentals', title: 'AI Explainability', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-explainability' },
    { category: 'AI Fundamentals', title: 'Explainable AI', url: 'https://www.paloaltonetworks.com/cyberpedia/explainable-ai' },
    { category: 'AI Fundamentals', title: 'AI Development Lifecycle', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-development-lifecycle' },
    { category: 'AI Fundamentals', title: 'What is Retrieval Augmented Generation', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-retrieval-augmented-generation' },
    { category: 'AI Security', title: 'AI Security', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-security' },
    { category: 'AI Security', title: 'AI in Threat Detection', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-in-threat-detection' },
    { category: 'AI Security', title: 'AI Infrastructure Security', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-infrastructure-security' },
    { category: 'AI Security', title: 'AI Security Policy', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-security-policy' },
    { category: 'AI Security', title: 'What is AI Prompt Security', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-ai-prompt-security' },
    { category: 'AI Security', title: 'Generative AI Security Risks', url: 'https://www.paloaltonetworks.com/cyberpedia/generative-ai-security-risks' },
    { category: 'AI Security', title: 'What is Shadow AI', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-shadow-ai' },
    { category: 'AI Security', title: 'What is Agentic AI Security', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-agentic-ai-security' },
    { category: 'AI Security', title: 'AI Security Posture Management (AI-SPM)', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-security-posture-management-aispm' },
    { category: 'AI Security', title: 'What is AI in Endpoint Security', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-ai-in-endpoint-security' },
    { category: 'AI Security', title: 'What is AI Model Security', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-ai-model-security' },
    { category: 'AI Security', title: 'What is an AI BOM', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-an-ai-bom' },
    { category: 'AI Security', title: 'AI Security Concepts', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-security-concepts' },
    { category: 'AI Security', title: 'What is Data Poisoning', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-data-poisoning' },
    { category: 'AI Security', title: 'What is Inline Deep Learning', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-inline-deep-learning' },
    { category: 'AI Security', title: 'What is Precision AI', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-precision-ai' },
    { category: 'AI Security', title: 'What are AI Hallucinations', url: 'https://www.paloaltonetworks.com/cyberpedia/what-are-ai-hallucinations' },
    { category: 'Frameworks & Governance', title: 'AI Governance', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-governance' },
    { category: 'Frameworks & Governance', title: 'AI Risk Management Framework', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-risk-management-framework' },
    { category: 'Frameworks & Governance', title: 'NIST AI Risk Management Framework', url: 'https://www.paloaltonetworks.com/cyberpedia/nist-ai-risk-management-framework' },
    { category: 'Frameworks & Governance', title: 'Google Secure AI Framework', url: 'https://www.paloaltonetworks.com/cyberpedia/google-secure-ai-framework' },
    { category: 'Frameworks & Governance', title: 'MITRE ATLAS Matrix', url: 'https://www.paloaltonetworks.com/cyberpedia/mitre-sensible-regulatory-framework-atlas-matrix' },
    { category: 'Frameworks & Governance', title: 'IEEE Ethically Aligned Design', url: 'https://www.paloaltonetworks.com/cyberpedia/ieee-ethically-aligned-design' },
    { category: 'Frameworks & Governance', title: 'AI TRiSM', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-trism' },
    { category: 'Frameworks & Governance', title: 'What is Quantum Security', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-quantum-security' },
    { category: 'Adoption & Strategy', title: 'Steps to Successful AI Adoption in Cybersecurity', url: 'https://www.paloaltonetworks.com/cyberpedia/steps-to-successful-ai-adoption-in-cybersecurity' },
    { category: 'Adoption & Strategy', title: 'AI Risks and Benefits in Cybersecurity', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-risks-and-benefits-in-cybersecurity' },
    { category: 'Adoption & Strategy', title: 'What are Barriers to AI Adoption in Cybersecurity', url: 'https://www.paloaltonetworks.com/cyberpedia/what-are-barriers-to-ai-adoption-in-cybersecurity' },
    { category: 'Adoption & Strategy', title: 'Predictions of AI in Cybersecurity', url: 'https://www.paloaltonetworks.com/cyberpedia/predictions-of-artificial-intelligence-ai-in-cybersecurity' },
    { category: 'Adoption & Strategy', title: 'Role of AI in Security Automation', url: 'https://www.paloaltonetworks.com/cyberpedia/role-of-artificial-intelligence-ai-in-security-automation' },
    { category: 'Adoption & Strategy', title: 'What is Cybersecurity Platformization', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-cybersecurity-platformization' },
    { category: 'Adoption & Strategy', title: 'What is MLOps', url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-mlops' },
    { category: 'Technologies', title: 'Generative AI in Cybersecurity', url: 'https://www.paloaltonetworks.com/cyberpedia/generative-ai-in-cybersecurity' },
    { category: 'Technologies', title: 'AI-Powered SASE', url: 'https://www.paloaltonetworks.com/cyberpedia/ai-powered-sase' },
    { category: 'Technologies', title: 'Zero Trust and SASE', url: 'https://www.paloaltonetworks.com/cyberpedia/zero-trust-and-sase' },
    { category: 'Technologies', title: 'Threat Intelligence Use Cases and Examples', url: 'https://www.paloaltonetworks.com/cyberpedia/threat-intelligence-use-cases-and-examples' },
    { category: 'Technologies', title: 'Static Analysis, Dynamic Analysis & ML', url: 'https://www.paloaltonetworks.com/cyberpedia/why-you-need-static-analysis-dynamic-analysis-machine-learning' },
  ];

  const glossaryCategories = [
    { label: 'AI Fundamentals', color: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-400' },
    { label: 'AI Security', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
    { label: 'Frameworks & Governance', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
    { label: 'Adoption & Strategy', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
    { label: 'Technologies', color: 'bg-lime-100 text-lime-700 border-lime-200', dot: 'bg-lime-500' },
  ];

  const blogPosts = [
    { month: 'January', url: 'https://www.paloaltonetworks.com/blog/2026/01/alien-franchise-taught-cybersecurity/', title: 'What the Alien Franchise Taught Us About Cybersecurity' },
    { month: 'January', url: 'https://www.paloaltonetworks.com/blog/2026/01/bridging-cybersecurity-and-ai/', title: 'Bridging Cybersecurity and AI' },
    { month: 'January', url: 'https://www.paloaltonetworks.com/blog/2026/01/unified-ai-powered-security/', title: 'Unified AI-Powered Security' },
    { month: 'February', url: 'https://www.paloaltonetworks.com/blog/2026/02/power-of-glean-and-prisma-airs-integration/', title: 'Power of Glean and Prisma AIR\'s Integration' },
    { month: 'February', url: 'https://www.paloaltonetworks.com/blog/2026/02/raf-association-next-generation-cyber-resilience/', title: 'RAF Association Next-Generation Cyber Resilience' },
    { month: 'February', url: 'https://www.paloaltonetworks.com/blog/2026/02/securing-every-identity-in-the-age-of-ai/', title: 'Securing Every Identity in the Age of AI' },
    { month: 'February', url: 'https://www.paloaltonetworks.com/blog/2026/02/securing-the-agentic-endpoint/', title: 'Securing the Agentic Endpoint' },
    { month: 'February', url: 'https://www.paloaltonetworks.com/blog/2026/02/soc-agentic-next-evolution-cortex/', title: 'SOC Agentic: The Next Evolution of Cortex' },
    { month: 'February', url: 'https://www.paloaltonetworks.com/blog/2026/02/when-security-becomes-an-afterthought/', title: 'When Security Becomes an Afterthought' },
    { month: 'March', url: 'https://www.paloaltonetworks.com/blog/2026/03/service-providers-become-secure-ai-factories/', title: 'Service Providers Become Secure AI Factories' },
  ];

  const monthGroups = [
    { label: 'January 2026', color: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-500', posts: blogPosts.filter(p => p.month === 'January') },
    { label: 'February 2026', color: 'bg-violet-100 text-violet-700 border-violet-200', dot: 'bg-violet-500', posts: blogPosts.filter(p => p.month === 'February') },
    { label: 'March 2026', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500', posts: blogPosts.filter(p => p.month === 'March') },
  ];

  const newPages = [
    {
      title: 'What is Workload Identity',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-workload-identity',
      category: 'Identity Security'
    },
    {
      title: 'What is a Non-Human Identity',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-a-non-human-identity',
      category: 'Identity Security'
    },
    {
      title: 'Zero Standing Privileges',
      url: 'https://www.paloaltonetworks.com/cyberpedia/zero-standing-privileges',
      category: 'Access Control'
    },
    {
      title: 'Identity Security',
      url: 'https://www.paloaltonetworks.com/cyberpedia/identity-security',
      category: 'Identity Security'
    },
    {
      title: 'Improper Inventory Management (API9)',
      url: 'https://www.paloaltonetworks.com/cyberpedia/improper-inventory-management-api9',
      category: 'API Security'
    },
    {
      title: 'IoT Security Issues',
      url: 'https://www.paloaltonetworks.com/cyberpedia/iot-security-issues',
      category: 'IoT Security'
    },
    {
      title: 'What are Agentic Browsers',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-are-agentic-browsers',
      category: 'AI/ML Operations'
    },
    {
      title: 'What are Shared Local Admin Credentials',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-are-shared-local-admin-credentials',
      category: 'Access Control'
    },
    {
      title: 'What is Agentic AI Governance',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-agentic-ai-governance',
      category: 'AI/ML Operations'
    },
    {
      title: 'What is Authentication and Authorization',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-authentication-and-authorization',
      category: 'Identity Security'
    },
    {
      title: 'What is CIAM',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-ciam',
      category: 'Identity Security'
    },
    {
      title: 'What is Defense in Depth',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-defense-in-depth',
      category: 'Security Strategy'
    },
    {
      title: 'What is Identity Governance and Administration (IGA)',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-identity-governance-and-administration-iga',
      category: 'Identity Security'
    },
    {
      title: 'What is Identity Lifecycle Management',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-identity-lifecycle-management',
      category: 'Identity Security'
    },
    {
      title: 'What is Identity Security',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-identity-security',
      category: 'Identity Security'
    },
    {
      title: 'What is Just-in-Time Access (JIT)',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-just-in-time-access-jit',
      category: 'Access Control'
    },
    {
      title: 'What is Machine Identity',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-machine-identity',
      category: 'Identity Security'
    },
    {
      title: 'What is Machine Identity Security (MIS)',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-machine-identity-security-mis',
      category: 'Identity Security'
    },
    {
      title: 'What is Modern Identity Governance Administration (IGA)',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-modern-identity-governance-administration-iga',
      category: 'Identity Security'
    },
    {
      title: 'What is NIST SP 800-207',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-nist-sp-800-207',
      category: 'Security Standards'
    },
    {
      title: 'What is Passwordless Authentication',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-passwordless-authentication',
      category: 'Identity Security'
    },
    {
      title: 'What is Privileged Access Management',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-privileged-access-management',
      category: 'Access Control'
    },
    {
      title: 'What is Process Injection',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-process-injection',
      category: 'Threat Protection'
    },
    {
      title: 'What is Single Sign-On',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-single-sign-on',
      category: 'Identity Security'
    },
    {
      title: 'What is the DORA Act',
      url: 'https://www.paloaltonetworks.com/cyberpedia/what-is-the-dora-act',
      category: 'Compliance'
    },
  ];

  const pageCategories = [
    { label: 'Identity Security', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
    { label: 'Access Control', color: 'bg-sky-100 text-sky-700 border-sky-200', dot: 'bg-sky-500' },
    { label: 'AI/ML Operations', color: 'bg-cyan-100 text-cyan-700 border-cyan-200', dot: 'bg-cyan-500' },
    { label: 'Security Standards', color: 'bg-teal-100 text-teal-700 border-teal-200', dot: 'bg-teal-500' },
    { label: 'Compliance', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
    { label: 'API Security', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
    { label: 'IoT Security', color: 'bg-lime-100 text-lime-700 border-lime-200', dot: 'bg-lime-500' },
    { label: 'Security Strategy', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
    { label: 'Threat Protection', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  ];

  const crowdstrikePages = [
    {
      title: 'Secure By Design',
      url: 'https://www.crowdstrike.com/en-us/cybersecurity-101/application-security/secure-by-design/',
      category: 'Application Security'
    },
    {
      title: 'AI Detection and Response (AIDR)',
      url: 'https://www.crowdstrike.com/en-us/cybersecurity-101/artificial-intelligence/ai-detection-and-response-aidr/',
      category: 'Artificial Intelligence'
    },
    {
      title: 'Code to Cloud Security',
      url: 'https://www.crowdstrike.com/en-gb/cybersecurity-101/cloud-security/code-to-cloud-security/',
      category: 'Cloud Security'
    },
  ];

  const crowdstrikeCategories = [
    { label: 'Application Security', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
    { label: 'Artificial Intelligence', color: 'bg-orange-100 text-orange-700 border-orange-200', dot: 'bg-orange-500' },
    { label: 'Cloud Security', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  ];

  return (
    <SlideContainer slideNumber={21} onNavigateHome={onNavigateHome} source="">
      <div className="mb-6">
      <SlideHeader 
        title="Content Gap" 
        subtitle="Key Insights & Strategic Actions"
      />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab('paloalto')}
          className={`px-6 py-3 rounded-lg font-bold text-[13px] transition-all ${
            activeTab === 'paloalto'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Palo Alto
        </button>
        <button
          onClick={() => setActiveTab('crowdstrike')}
          className={`px-6 py-3 rounded-lg font-bold text-[13px] transition-all ${
            activeTab === 'crowdstrike'
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          CrowdStrike
        </button>
      </div>

      {/* Palo Alto Content */}
      {activeTab === 'paloalto' && (
        <div className="flex-1 space-y-6">
          {/* Key Finding 1: AI Cybersecurity Category */}
          {/* Removed */}

          {/* Key Finding 2: New Pages Added */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-[18px] font-bold text-gray-900">
                    1. New Cyberpedia Pages Added in Feb 2026
                  </h3>
                  <div className="flex-shrink-0 px-3 py-1 bg-blue-500 text-white text-[11px] font-bold rounded-full">
                    697 TOTAL PAGES
                  </div>
                </div>
                <ul className="space-y-1.5 mb-4 pl-1">
                  <li className="flex items-start gap-2 text-[14px] text-gray-600">
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-blue-500" />
                    <span>697 total pages in the Cyberpedia glossary — the industry's most comprehensive AI security knowledge base.</span>
                  </li>
                  <li className="flex items-start gap-2 text-[14px] text-gray-600">
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-blue-400" />
                    <span>25 new pages created in Feb 2026, focused on <strong>Identity Security</strong>, <strong>Access Control</strong> (JIT, PAM), <strong>Agentic AI</strong>, and compliance (<strong>DORA</strong>, <strong>NIST SP 800-207</strong>).</span>
                  </li>
                </ul>
                <button
                  onClick={() => setShowPagesDropdown(!showPagesDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-[12px] font-bold">{showPagesDropdown ? 'Hide' : 'View All'} 25 Pages</span>
                </button>
              </div>
            </div>

            {/* Pages Dropdown */}
            {showPagesDropdown && (
              <div className="mt-5 pt-5 border-t-2 border-gray-200">
                <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2">
                  {pageCategories.map((cat) => {
                    const pages = newPages.filter(p => p.category === cat.label);
                    if (pages.length === 0) return null;
                    return (
                      <div key={cat.label}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${cat.color}`}>
                            {cat.label}
                          </span>
                          <span className="text-[11px] text-gray-400">{pages.length} page{pages.length > 1 ? 's' : ''}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pl-1">
                          {pages.map((page, idx) => (
                            <a
                              key={idx}
                              href={page.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-start gap-2.5 p-2.5 rounded-lg border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all"
                            >
                              <div className={`flex-shrink-0 mt-1.5 w-2 h-2 rounded-full ${cat.dot}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-semibold text-gray-800 group-hover:text-blue-700 leading-snug">
                                  {page.title}
                                </p>
                              </div>
                              <ExternalLink className="flex-shrink-0 w-3 h-3 text-gray-300 group-hover:text-blue-500 mt-1" />
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Key Finding 3: AI Cybersecurity Blogs */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                <TrendingUp className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-[18px] font-bold text-gray-900">
                    2. <span className="text-purple-600 underline decoration-2 decoration-purple-400">Palo Alto</span> – AI Cybersecurity in Blogs
                  </h3>
                  <div className="flex-shrink-0 px-4 py-1.5 bg-purple-600 text-white text-[13px] font-extrabold rounded-full shadow-[0_0_15px_rgba(147,51,234,0.5)] ring-2 ring-purple-300 flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-200 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                    </span>
                    104 TOTAL BLOGS
                  </div>
                </div>
                <ul className="space-y-2 mb-4 pl-1">
                  <li className="flex items-start gap-2 text-[14px] text-gray-700">
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-purple-500" />
                    <span>Active blog published on AI Cybersecurity out of a massive <strong className="text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded border border-purple-200">104 total blogs</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2 text-[14px] text-gray-700">
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-purple-400" />
                    <span><strong>10 new posts</strong> in Feb 2026.</span>
                  </li>
                </ul>
                {/* View Blogs Button */}
                <button
                  onClick={() => setShowBlogsDropdown(!showBlogsDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="text-[12px] font-bold whitespace-nowrap">{showBlogsDropdown ? 'Hide' : 'View'} 10 Blogs</span>
                </button>
              </div>
            </div>

            {/* Blog Dropdown */}
            {showBlogsDropdown && (
              <div className="mt-5 pt-5 border-t-2 border-purple-200">
                <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2">
                  {monthGroups.filter(g => g.posts.length > 0).map((group) => (
                    <div key={group.label}>
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${group.color}`}>
                          {group.label}
                        </span>
                        <span className="text-[11px] text-gray-400">{group.posts.length} post{group.posts.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="space-y-2 pl-1">
                        {group.posts.map((post, idx) => (
                          <a
                            key={idx}
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-purple-300 hover:bg-purple-50 transition-all"
                          >
                            <div className={`flex-shrink-0 mt-1.5 w-2 h-2 rounded-full ${group.dot}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-semibold text-gray-800 group-hover:text-purple-700 leading-snug">
                                {post.title}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-0.5 truncate">{post.url}</p>
                            </div>
                            <ExternalLink className="flex-shrink-0 w-3.5 h-3.5 text-gray-300 group-hover:text-purple-500 mt-1" />
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CrowdStrike Content */}
      {activeTab === 'crowdstrike' && (
        <div className="flex-1 space-y-6">
          {/* Cybersecurity 101 Pages */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-[18px] font-bold text-gray-900">
                    <span className="text-red-600 underline decoration-2 decoration-red-400">CrowdStrike</span> – Cybersecurity 101 Pages
                  </h3>
                  <div className="flex-shrink-0 px-3 py-1 bg-red-500 text-white text-[11px] font-bold rounded-full">
                    545 TOTAL PAGES
                  </div>
                </div>
                <ul className="space-y-2 mb-4 pl-1">
                  <li className="flex items-start gap-2 text-[14px] text-gray-700">
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-red-500" />
                    <span>Comprehensive Cybersecurity 101 resource hub with <strong className="text-red-700 bg-red-100 px-1.5 py-0.5 rounded border border-red-200">545 total pages</strong> covering threat intel, cloud security, AI & automation.</span>
                  </li>
                  <li className="flex items-start gap-2 text-[14px] text-gray-700">
                    <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-red-400" />
                    <span><strong>3 new pages added in Feb 2026</strong>, expanding coverage across Application Security, AI, and Cloud Security.</span>
                  </li>
                </ul>
                <button
                  onClick={() => setShowCrowdstrikeDropdown(!showCrowdstrikeDropdown)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-[12px] font-bold">{showCrowdstrikeDropdown ? 'Hide' : 'View'} 3 New Pages</span>
                </button>
              </div>
            </div>

            {/* Pages Dropdown */}
            {showCrowdstrikeDropdown && (
              <div className="mt-5 pt-5 border-t-2 border-red-200">
                <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2">
                  {crowdstrikeCategories.map((cat) => {
                    const pages = crowdstrikePages.filter(p => p.category === cat.label);
                    if (pages.length === 0) return null;
                    return (
                      <div key={cat.label}>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${cat.color}`}>
                            {cat.label}
                          </span>
                          <span className="text-[11px] text-gray-400">{pages.length} page{pages.length > 1 ? 's' : ''}</span>
                        </div>
                        <div className="space-y-2 pl-1">
                          {pages.map((page, idx) => (
                            <a
                              key={idx}
                              href={page.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-start gap-2.5 p-2.5 rounded-lg border border-gray-100 hover:border-red-300 hover:bg-red-50 transition-all"
                            >
                              <div className={`flex-shrink-0 mt-1.5 w-2 h-2 rounded-full ${cat.dot}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-semibold text-gray-800 group-hover:text-red-700 leading-snug">
                                  {page.title}
                                </p>
                              </div>
                              <ExternalLink className="flex-shrink-0 w-3 h-3 text-gray-300 group-hover:text-red-500 mt-1" />
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <SlideFooter source="Source: Semrush" />
    </SlideContainer>
  );
}