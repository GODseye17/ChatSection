// app/component/search/FilterPanel.js
import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Calendar, FileText, Globe, Users, Baby, FlaskConical, SortAsc, X } from 'lucide-react';
import { cn } from '@/app/lib/utils';

const FILTER_CATEGORIES = {
  publication_date: {
    label: 'Publication Date',
    icon: Calendar,
    options: [
      { value: '1_year', label: 'Last year' },
      { value: '5_years', label: 'Last 5 years' },
      { value: '10_years', label: 'Last 10 years' },
      { value: 'custom', label: 'Custom range' }
    ]
  },
  text_availability: {
    label: 'Text Availability',
    icon: FileText,
    options: [
      { value: 'abstract', label: 'Abstract available' },
      { value: 'full_text', label: 'Full text' },
      { value: 'free_full_text', label: 'Free full text' }
    ]
  },
  article_types: {
    label: 'Article Types',
    icon: FileText,
    options: [
      { value: 'clinical_trial', label: 'Clinical Trial' },
      { value: 'randomized_controlled_trial', label: 'Randomized Controlled Trial' },
      { value: 'meta_analysis', label: 'Meta-Analysis' },
      { value: 'systematic_review', label: 'Systematic Review' },
      { value: 'review', label: 'Review' },
      { value: 'case_reports', label: 'Case Reports' },
      { value: 'comparative_study', label: 'Comparative Study' },
      { value: 'observational_study', label: 'Observational Study' }
    ]
  },
  languages: {
    label: 'Languages',
    icon: Globe,
    options: [
      { value: 'english', label: 'English' },
      { value: 'spanish', label: 'Spanish' },
      { value: 'french', label: 'French' },
      { value: 'german', label: 'German' },
      { value: 'chinese', label: 'Chinese' },
      { value: 'japanese', label: 'Japanese' }
    ]
  },
  species: {
    label: 'Species',
    icon: FlaskConical,
    options: [
      { value: 'humans', label: 'Humans' },
      { value: 'other_animals', label: 'Other Animals' },
      { value: 'mice', label: 'Mice' },
      { value: 'rats', label: 'Rats' }
    ]
  },
  sex: {
    label: 'Sex',
    icon: Users,
    options: [
      { value: 'female', label: 'Female' },
      { value: 'male', label: 'Male' }
    ]
  },
  age_groups: {
    label: 'Age Groups',
    icon: Baby,
    options: [
      { value: 'infant', label: 'Infant (birth-23 months)' },
      { value: 'child_preschool', label: 'Preschool (2-5 years)' },
      { value: 'child', label: 'Child (birth-18 years)' },
      { value: 'adolescent', label: 'Adolescent (13-18 years)' },
      { value: 'adult', label: 'Adult (19+ years)' },
      { value: 'young_adult', label: 'Young Adult (19-24 years)' },
      { value: 'middle_aged', label: 'Middle Aged (45-64 years)' },
      { value: 'aged', label: 'Aged (65+ years)' },
      { value: 'aged_80_and_over', label: 'Aged 80+ years' }
    ]
  }
};

export default function FilterPanel({ filters, setFilters, selectedSource }) {
  const [expandedSections, setExpandedSections] = useState(['publication_date']);

  const toggleSection = (section) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleFilterChange = (category, value, isMultiple = true) => {
    setFilters(prev => {
      if (isMultiple && Array.isArray(prev[category])) {
        const currentValues = prev[category];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        return { ...prev, [category]: newValues };
      } else {
        return { ...prev, [category]: value };
      }
    });
  };

  const clearAllFilters = () => {
    setFilters({
      publication_date: '',
      custom_start_date: '',
      custom_end_date: '',
      text_availability: [],
      article_types: [],
      languages: [],
      species: [],
      sex: [],
      age_groups: [],
      other_filters: [],
      sort_by: 'relevance',
      search_field: 'title/abstract'
    });
  };

  const getActiveFiltersCount = () => {
    return Object.entries(filters).reduce((count, [key, value]) => {
      if (key === 'sort_by' || key === 'search_field') return count;
      if (Array.isArray(value) && value.length > 0) return count + value.length;
      if (typeof value === 'string' && value !== '') return count + 1;
      return count;
    }, 0);
  };

  return (
    <Card className="border-gray-700 bg-gray-900/50 backdrop-blur-sm shadow-xl animate-in slide-in-from-top-2">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-100">Search Filters</h3>
          <div className="flex items-center gap-2">
            {getActiveFiltersCount() > 0 && (
              <>
                <Badge variant="secondary">
                  {getActiveFiltersCount()} active
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-xs"
                >
                  Clear all
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sort and Search Field */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <SortAsc className="w-4 h-4" />
                Sort by
              </label>
              <select
                value={filters.sort_by}
                onChange={(e) => handleFilterChange('sort_by', e.target.value, false)}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="relevance">Relevance</option>
                <option value="date">Publication date</option>
                <option value="author">First author</option>
                <option value="journal">Journal</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Search in
              </label>
              <select
                value={filters.search_field}
                onChange={(e) => handleFilterChange('search_field', e.target.value, false)}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="title/abstract">Title/Abstract</option>
                <option value="title">Title only</option>
                <option value="author">Author</option>
                <option value="journal">Journal</option>
                <option value="doi">DOI</option>
              </select>
            </div>
          </div>

          {/* Filter Categories */}
          {Object.entries(FILTER_CATEGORIES).map(([key, category]) => {
            const Icon = category.icon;
            const isExpanded = expandedSections.includes(key);
            const isDateFilter = key === 'publication_date';
            const selectedCount = Array.isArray(filters[key]) ? filters[key].length : (filters[key] ? 1 : 0);

            return (
              <div key={key} className="space-y-2">
                <button
                  onClick={() => toggleSection(key)}
                  className="w-full flex items-center justify-between text-sm font-medium text-gray-300 hover:text-gray-100 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {category.label}
                    {selectedCount > 0 && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0">
                        {selectedCount}
                      </Badge>
                    )}
                  </span>
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    isExpanded && "rotate-180"
                  )} />
                </button>

                {isExpanded && (
                  <div className="space-y-2 pl-6 animate-in slide-in-from-top-2">
                    {category.options.map(option => {
                      const isSelected = isDateFilter 
                        ? filters[key] === option.value
                        : filters[key]?.includes(option.value);

                      return (
                        <label
                          key={option.value}
                          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 cursor-pointer"
                        >
                          <input
                            type={isDateFilter ? "radio" : "checkbox"}
                            name={isDateFilter ? key : undefined}
                            checked={isSelected}
                            onChange={() => handleFilterChange(key, option.value, !isDateFilter)}
                            className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                          />
                          <span>{option.label}</span>
                        </label>
                      );
                    })}

                    {/* Custom date range */}
                    {isDateFilter && filters.publication_date === 'custom' && (
                      <div className="space-y-2 mt-2">
                        <input
                          type="date"
                          value={filters.custom_start_date}
                          onChange={(e) => handleFilterChange('custom_start_date', e.target.value, false)}
                          className="w-full px-3 py-1 bg-gray-800 rounded text-sm"
                          placeholder="Start date"
                        />
                        <input
                          type="date"
                          value={filters.custom_end_date}
                          onChange={(e) => handleFilterChange('custom_end_date', e.target.value, false)}
                          className="w-full px-3 py-1 bg-gray-800 rounded text-sm"
                          placeholder="End date"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Other filters (PubMed specific) */}
          {selectedSource === 'pubmed' && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Other Filters</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.other_filters?.includes('exclude_preprints')}
                    onChange={() => handleFilterChange('other_filters', 'exclude_preprints')}
                    className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Exclude preprints</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.other_filters?.includes('medline')}
                    onChange={() => handleFilterChange('other_filters', 'medline')}
                    className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                  />
                  <span>MEDLINE only</span>
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.other_filters?.includes('pmc')}
                    onChange={() => handleFilterChange('other_filters', 'pmc')}
                    className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                  />
                  <span>PMC articles</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// Add missing import
import { ChevronDown } from 'lucide-react';