// app/components/search/FilterPanel.js
import React from 'react';
import { X } from 'lucide-react';

export default function FilterPanel({ filters, setFilters }) {
  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateArrayFilter = (key, value, checked) => {
    setFilters(prev => ({
      ...prev,
      [key]: checked 
        ? [...prev[key], value]
        : prev[key].filter(item => item !== value)
    }));
  };

  const clearFilters = () => {
    setFilters({
      publication_date: '',
      custom_start_date: '',
      custom_end_date: '',
      article_types: [],
      languages: [],
      species: [],
      sex: [],
      age_groups: [],
      other_filters: [],
      custom_filters: '',
      sort_by: '',
      search_field: ''
    });
  };

  return (
    <div className="mt-4 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-800 animate-in slide-in-from-top-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Advanced Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Publication Date */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
              Publication Date
            </label>
            <select
              value={filters.publication_date}
              onChange={(e) => updateFilter('publication_date', e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Any time</option>
              <option value="1_year">Last year</option>
              <option value="5_years">Last 5 years</option>
              <option value="10_years">Last 10 years</option>
              <option value="custom">Custom range</option>
            </select>
          </div>

          {filters.publication_date === 'custom' && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                  Start Date (YYYY/MM/DD)
                </label>
                <input
                  type="text"
                  placeholder="2020/01/01"
                  value={filters.custom_start_date}
                  onChange={(e) => updateFilter('custom_start_date', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                  End Date (YYYY/MM/DD)
                </label>
                <input
                  type="text"
                  placeholder="2024/12/31"
                  value={filters.custom_end_date}
                  onChange={(e) => updateFilter('custom_end_date', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </>
          )}
        </div>

        {/* Search Options */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
              Sort By
            </label>
            <select
              value={filters.sort_by}
              onChange={(e) => updateFilter('sort_by', e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Relevance</option>
              <option value="publication_date">Publication Date</option>
              <option value="first_author">First Author</option>
              <option value="last_author">Last Author</option>
              <option value="journal">Journal</option>
              <option value="title">Title</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
              Search Field
            </label>
            <select
              value={filters.search_field}
              onChange={(e) => updateFilter('search_field', e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Title/Abstract</option>
              <option value="title">Title only</option>
              <option value="abstract">Abstract only</option>
              <option value="author">Author</option>
              <option value="all_fields">All fields</option>
            </select>
          </div>
        </div>

        {/* Article Types */}
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 block">
            Article Types
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
            {[
              { value: 'clinical_trial', label: 'Clinical Trial' },
              { value: 'randomized_controlled_trial', label: 'RCT' },
              { value: 'meta_analysis', label: 'Meta-Analysis' },
              { value: 'systematic_review', label: 'Systematic Review' },
              { value: 'review', label: 'Review' },
              { value: 'case_reports', label: 'Case Reports' },
              { value: 'comparative_study', label: 'Comparative Study' },
              { value: 'observational_study', label: 'Observational Study' }
            ].map(type => (
              <label key={type.value} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.article_types.includes(type.value)}
                  onChange={(e) => updateArrayFilter('article_types', type.value, e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span>{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 block">
            Languages
          </label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-24 overflow-y-auto">
            {[
              { value: 'english', label: 'English' },
              { value: 'spanish', label: 'Spanish' },
              { value: 'french', label: 'French' },
              { value: 'german', label: 'German' },
              { value: 'italian', label: 'Italian' },
              { value: 'japanese', label: 'Japanese' },
              { value: 'portuguese', label: 'Portuguese' },
              { value: 'chinese', label: 'Chinese' }
            ].map(lang => (
              <label key={lang.value} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.languages.includes(lang.value)}
                  onChange={(e) => updateArrayFilter('languages', lang.value, e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span>{lang.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Species */}
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 block">
            Species
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { value: 'humans', label: 'Humans' },
              { value: 'mice', label: 'Mice' },
              { value: 'rats', label: 'Rats' },
              { value: 'other_animals', label: 'Other Animals' }
            ].map(species => (
              <label key={species.value} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.species.includes(species.value)}
                  onChange={(e) => updateArrayFilter('species', species.value, e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span>{species.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sex */}
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 block">
            Sex
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'female', label: 'Female' },
              { value: 'male', label: 'Male' }
            ].map(sex => (
              <label key={sex.value} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.sex.includes(sex.value)}
                  onChange={(e) => updateArrayFilter('sex', sex.value, e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span>{sex.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Age Groups */}
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 block">
            Age Groups
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-24 overflow-y-auto">
            {[
              { value: 'infant', label: 'Infant' },
              { value: 'child', label: 'Child' },
              { value: 'adolescent', label: 'Adolescent' },
              { value: 'adult', label: 'Adult' },
              { value: 'middle_aged', label: 'Middle Aged' },
              { value: 'aged', label: 'Aged (65+)' }
            ].map(age => (
              <label key={age.value} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.age_groups.includes(age.value)}
                  onChange={(e) => updateArrayFilter('age_groups', age.value, e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span>{age.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Other Filters */}
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 block">
            Other Filters
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { value: 'exclude_preprints', label: 'Exclude Preprints' },
              { value: 'medline', label: 'MEDLINE only' },
              { value: 'free_full_text', label: 'Free Full Text' }
            ].map(other => (
              <label key={other.value} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={filters.other_filters.includes(other.value)}
                  onChange={(e) => updateArrayFilter('other_filters', other.value, e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <span>{other.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Filters */}
        <div>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block">
            Custom PubMed Query
          </label>
          <input
            type="text"
            placeholder="e.g., author[au] OR mesh[mh]"
            value={filters.custom_filters}
            onChange={(e) => updateFilter('custom_filters', e.target.value)}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Advanced users: Use PubMed search syntax
          </p>
        </div>
      </div>
    </div>
  );
}