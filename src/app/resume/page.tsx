'use client';

import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { ResumeFormBuilder, type ResumeFormData } from '@/components/resume/resume-form-builder';
import { ResumePreview } from '@/components/resume/resume-preview';
import { generateResumePDF } from '@/components/resume/pdf-generator';

export default function ResumePage() {
  const [formData, setFormData] = useState<ResumeFormData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      summary: '',
    },
    education: [],
    experience: [],
    leadershipCommunity: [],
    skills: {
      softSkills: [],
      languages: [],
      programming: [],
    },
    honors: [],
  });

  const handleExportPDF = async () => {
    try {
      await generateResumePDF(formData, 'my-resume.pdf');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-50 to-slate-100 pt-20">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <FileText className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">AI Resume Builder</h1>
          <p className="mt-2 text-lg text-gray-600">
            Build your resume with a step-by-step form and live preview
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ResumeFormBuilder onDataChange={setFormData} />
              <div className="mt-8 flex">
                <button
                  onClick={handleExportPDF}
                  className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700"
                >
                  Download as PDF
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="sticky top-20 max-h-[calc(100vh-120px)]">
                <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
                <ResumePreview data={formData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
