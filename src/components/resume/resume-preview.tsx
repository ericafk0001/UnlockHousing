"use client";

import React from "react";
import { ResumeFormData } from "./resume-form-builder";

interface ResumePreviewProps {
  data: ResumeFormData;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-gray-900 font-serif text-sm leading-relaxed h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">
          {data.personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex justify-center gap-4 text-xs mt-2 flex-wrap">
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.email && <span>•</span>}
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.location && <span>•</span>}
          {data.personalInfo.location && (
            <span>{data.personalInfo.location}</span>
          )}
          {data.personalInfo.linkedin && <span>•</span>}
          {data.personalInfo.linkedin && (
            <a
              href={`https://${data.personalInfo.linkedin}`}
              className="text-blue-600 hover:underline"
            >
              {data.personalInfo.linkedin}
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-6">
          <p className="text-xs leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Education
          </h2>
          <div className="mt-2 mb-2 h-px bg-gray-800" />
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-xs">{edu.school}</p>
                  {(edu.degree || edu.field) && (
                    <p className="text-xs">
                      {edu.degree && edu.field
                        ? `${edu.degree} in ${edu.field}`
                        : edu.degree || edu.field}
                    </p>
                  )}
                </div>
                {edu.graduationDate && (
                  <p className="text-xs text-gray-600">{edu.graduationDate}</p>
                )}
              </div>
              {edu.gpa && (
                <p className="text-xs text-gray-600 mt-1">GPA: {edu.gpa}</p>
              )}
              {edu.relevantCoursework && (
                <p className="text-xs text-gray-600 mt-1">
                  <span className="font-semibold">Relevant Coursework:</span>{" "}
                  {edu.relevantCoursework}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Experience
          </h2>
          <div className="mt-2 mb-2 h-px bg-gray-800" />
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <p className="text-xs italic">{exp.company}</p>
                {exp.location && (
                  <p className="text-xs text-gray-600">{exp.location}</p>
                )}
              </div>
              <div className="flex justify-between items-start mt-1">
                <p className="font-bold text-xs">{exp.jobTitle}</p>
                <p className="text-xs text-gray-600">
                  {exp.startDate}
                  {exp.currentlyWorking
                    ? " - Present"
                    : exp.endDate
                      ? ` - ${exp.endDate}`
                      : ""}
                </p>
              </div>
              {exp.achievements.length > 0 && (
                <ul className="text-xs mt-2 ml-4 list-disc space-y-1">
                  {exp.achievements.map((ach, i) => (
                    <li key={i}>{ach}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Leadership & Community */}
      {data.leadershipCommunity.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Leadership & Community Involvement
          </h2>
          <div className="mt-2 mb-2 h-px bg-gray-800" />
          {data.leadershipCommunity.map((lead, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <p className="text-xs italic">{lead.organization}</p>
                {lead.location && (
                  <p className="text-xs text-gray-600">{lead.location}</p>
                )}
              </div>
              <div className="flex justify-between items-start mt-1">
                <p className="font-bold text-xs">{lead.position}</p>
                <p className="text-xs text-gray-600">
                  {lead.startDate}
                  {lead.currentlyHolding
                    ? " - Present"
                    : lead.endDate
                      ? ` - ${lead.endDate}`
                      : ""}
                </p>
              </div>
              {lead.achievements.length > 0 && (
                <ul className="text-xs mt-2 ml-4 list-disc space-y-1">
                  {lead.achievements.map((ach, i) => (
                    <li key={i}>{ach}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {(data.skills.softSkills.length > 0 ||
        data.skills.languages.length > 0 ||
        data.skills.programming.length > 0) && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Skills
          </h2>
          <div className="mt-2 mb-2 h-px bg-gray-800" />
          <div className="text-xs space-y-2">
            {data.skills.softSkills.length > 0 && (
              <div>
                <span className="font-semibold">Soft Skills:</span>{" "}
                {data.skills.softSkills.join(", ")}
              </div>
            )}
            {data.skills.languages.length > 0 && (
              <div>
                <span className="font-semibold">Languages:</span>{" "}
                {data.skills.languages.join(", ")}
              </div>
            )}
            {data.skills.programming.length > 0 && (
              <div>
                <span className="font-semibold">Programming:</span>{" "}
                {data.skills.programming.join(", ")}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Honors & Awards */}
      {data.honors.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Honors and Awards
          </h2>
          <div className="mt-2 mb-2 h-px bg-gray-800" />
          <div className="text-xs space-y-1">
            {data.honors.map((honor, index) => (
              <div key={index} className="flex justify-between">
                <span>{honor.title}</span>
                {honor.year && (
                  <span className="text-gray-600">{honor.year}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Criminal History */}
      {data.criminalHistory.include && data.criminalHistory.details.trim() && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Criminal History
          </h2>
          <div className="mt-2 mb-2 h-px bg-gray-800" />
          <p className="text-xs leading-relaxed whitespace-pre-line">
            {data.criminalHistory.details}
          </p>
        </div>
      )}
    </div>
  );
};
