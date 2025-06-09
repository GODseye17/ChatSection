// app/component/search/FilterPanel.js
// Complete updated file with improved dual-handle slider

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Calendar, Filter, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { cn } from '@/app/lib/utils';

// Improved dual-handle date range slider component
const DateRangeSlider = ({ startYear, endYear, onRangeChange, disabled }) => {
  const currentYear = new Date().getFullYear();
  const minYear = 1950;
  const maxYear = currentYear;
  
  const [range, setRange] = useState([startYear || minYear, endYear || currentYear]);
  const [isDragging, setIsDragging] = useState({ start: false, end: false });
  const sliderRef = useRef(null);

  useEffect(() => {
    setRange([startYear || minYear, endYear || currentYear]);
  }, [startYear, endYear]);

  // Convert year to percentage position
  const yearToPercent = (year) => {
    return ((year - minYear) / (maxYear - minYear)) * 100;
  };

  // Convert percentage to year
  const percentToYear = (percent) => {
    return Math.round(minYear + (percent / 100) * (maxYear - minYear));
  };

  // Handle mouse/touch events for custom slider
  const handleSliderClick = (e) => {
    if (disabled || isDragging.start || isDragging.end) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    const clickedYear = percentToYear(Math.max(0, Math.min(100, percent)));
    
    // Determine which handle is closer and update accordingly
    const distanceToStart = Math.abs(clickedYear - range[0]);
    const distanceToEnd = Math.abs(clickedYear - range[1]);
    
    if (distanceToStart < distanceToEnd) {
      handleStartChange(clickedYear);
    } else {
      handleEndChange(clickedYear);
    }
  };

  const handleStartChange = (value) => {
    const newStart = Math.max(minYear, Math.min(value, range[1]));
    const newRange = [newStart, range[1]];
    setRange(newRange);
    onRangeChange(newRange[0], newRange[1]);
  };

  const handleEndChange = (value) => {
    const newEnd = Math.min(maxYear, Math.max(value, range[0]));
    const newRange = [range[0], newEnd];
    setRange(newRange);
    onRangeChange(newRange[0], newRange[1]);
  };

  // Generate year markers for better UX
  const getYearMarkers = () => {
    const markers = [];
    const step = 10; // Show markers every 10 years
    for (let year = Math.ceil(minYear / step) * step; year <= maxYear; year += step) {
      markers.push(year);
    }
    return markers;
  };

  const yearMarkers = getYearMarkers();

  // Mouse/touch event handlers for dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!sliderRef.current || (!isDragging.start && !isDragging.end)) return;
      
      const rect = sliderRef.current.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      const year = percentToYear(Math.max(0, Math.min(100, percent)));
      
      if (isDragging.start) {
        handleStartChange(year);
      } else if (isDragging.end) {
        handleEndChange(year);
      }
    };

    const handleMouseUp = () => {
      setIsDragging({ start: false, end: false });
    };

    if (isDragging.start || isDragging.end) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, range]);

  return (
    <div className="space-y-6 date-range-slider">
      {/* Header with current range */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-gray-300">Publication Date Range</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-purple-600/10 border border-purple-600/20 rounded-full range-display">
          <span className="text-sm font-medium text-purple-400">{range[0]}</span>
          <span className="text-xs text-purple-400/70">—</span>
          <span className="text-sm font-medium text-purple-400">{range[1]}</span>
        </div>
      </div>
      
      {/* Custom dual-handle slider */}
      <div className="relative px-2">
        {/* Slider track */}
        <div 
          ref={sliderRef}
          className="relative h-3 bg-gray-800 rounded-full cursor-pointer group slider-track"
          onClick={handleSliderClick}
        >
          {/* Selected range background */}
          <div 
            className="absolute h-3 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full transition-all duration-200 group-hover:from-purple-500 group-hover:to-purple-400 slider-range"
            style={{
              left: `${yearToPercent(range[0])}%`,
              width: `${yearToPercent(range[1]) - yearToPercent(range[0])}%`
            }}
          />
          
          {/* Start handle */}
          <div 
            className={cn(
              "absolute w-5 h-5 bg-white border-2 border-purple-600 rounded-full shadow-lg cursor-grab transition-all duration-200 transform -translate-y-1 -translate-x-1/2 slider-handle",
              isDragging.start && "cursor-grabbing scale-110 border-purple-500 shadow-xl dragging",
              !disabled && "hover:scale-105 hover:border-purple-500"
            )}
            style={{ left: `${yearToPercent(range[0])}%` }}
            onMouseDown={(e) => {
              if (disabled) return;
              setIsDragging({ ...isDragging, start: true });
              e.preventDefault();
            }}
          >
            <div className="absolute inset-1 bg-purple-600 rounded-full transition-colors duration-200" />
          </div>
          
          {/* End handle */}
          <div 
            className={cn(
              "absolute w-5 h-5 bg-white border-2 border-purple-600 rounded-full shadow-lg cursor-grab transition-all duration-200 transform -translate-y-1 -translate-x-1/2 slider-handle",
              isDragging.end && "cursor-grabbing scale-110 border-purple-500 shadow-xl dragging",
              !disabled && "hover:scale-105 hover:border-purple-500"
            )}
            style={{ left: `${yearToPercent(range[1])}%` }}
            onMouseDown={(e) => {
              if (disabled) return;
              setIsDragging({ ...isDragging, end: true });
              e.preventDefault();
            }}
          >
            <div className="absolute inset-1 bg-purple-600 rounded-full transition-colors duration-200" />
          </div>
        </div>
        
        {/* Year markers */}
        <div className="relative mt-2 h-4 year-markers">
          {yearMarkers.map((year) => (
            <div
              key={year}
              className="absolute flex flex-col items-center transform -translate-x-1/2 year-marker"
              style={{ left: `${yearToPercent(year)}%` }}
            >
              <div className="w-px h-2 bg-gray-600 tick" />
              <span className="text-xs text-gray-500 mt-1 label">{year}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Input fields */}
      <div className="flex items-center gap-4">
        <div className="flex-1 year-input">
          <label className="text-xs text-gray-500 block mb-2 font-medium">From Year</label>
          <div className="relative">
            <input
              type="number"
              min={minYear}
              max={maxYear}
              value={range[0]}
              onChange={(e) => handleStartChange(parseInt(e.target.value) || minYear)}
              disabled={disabled}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all pr-12"
              placeholder="1950"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
        </div>
        
        <div className="flex items-center justify-center mt-6">
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
        </div>
        
        <div className="flex-1 year-input">
          <label className="text-xs text-gray-500 block mb-2 font-medium">To Year</label>
          <div className="relative">
            <input
              type="number"
              min={minYear}
              max={maxYear}
              value={range[1]}
              onChange={(e) => handleEndChange(parseInt(e.target.value) || currentYear)}
              disabled={disabled}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all pr-12"
              placeholder={currentYear.toString()}
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Quick preset buttons */}
      <div className="flex flex-wrap gap-2 preset-buttons">
        <span className="text-xs text-gray-500 mr-2 self-center">Quick presets:</span>
        {[
          { label: 'Last 5 years', start: currentYear - 5, end: currentYear },
          { label: 'Last 10 years', start: currentYear - 10, end: currentYear },
          { label: 'Since 2000', start: 2000, end: currentYear },
          { label: 'All time', start: minYear, end: currentYear }
        ].map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              const newRange = [preset.start, preset.end];
              setRange(newRange);
              onRangeChange(newRange[0], newRange[1]);
            }}
            disabled={disabled}
            className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-gray-100 border border-gray-700 hover:border-gray-600 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed preset-button"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Clean dropdown component
const FilterDropdown = ({ label, value, options, onChange, defaultValue, disabled }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300 block">{label}</label>
      <select
        value={value || defaultValue}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none cursor-pointer"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Multi-select component
const MultiSelect = ({ label, options, selected, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (value) => {
    const newSelected = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300 block">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 flex items-center justify-between"
        >
          <span className="truncate">
            {selected.length === 0 ? 'Any type' : `${selected.length} selected`}
          </span>
          <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
            {options.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => toggleOption(option.value)}
                className="w-full px-3 py-2 text-left text-sm text-gray-100 hover:bg-gray-700 flex items-center gap-2"
              >
                <div className={cn(
                  "w-4 h-4 border border-gray-600 rounded flex items-center justify-center",
                  selected.includes(option.value) && "bg-purple-600 border-purple-600"
                )}>
                  {selected.includes(option.value) && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function FilterPanel({ filters, setFilters, selectedSource }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [startYear, setStartYear] = useState(null);
  const [endYear, setEndYear] = useState(null);

  // Initialize default filters
  useEffect(() => {
    if (!filters.species || filters.species.length === 0) {
      setFilters(prev => ({ ...prev, species: ['humans'] }));
    }
    if (!filters.languages || filters.languages.length === 0) {
      setFilters(prev => ({ ...prev, languages: ['english'] }));
    }
  }, []);

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateArrayFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDateRangeChange = (start, end) => {
    setStartYear(start);
    setEndYear(end);
    updateFilter('custom_start_date', `${start}/01/01`);
    updateFilter('custom_end_date', `${end}/12/31`);
    updateFilter('publication_date', 'custom');
  };

  const clearFilters = () => {
    setFilters({
      publication_date: '',
      custom_start_date: '',
      custom_end_date: '',
      article_types: [],
      languages: ['english'], // Keep English as default
      species: ['humans'], // Keep humans as default
      sex: [],
      age_groups: [],
      other_filters: [],
      custom_filters: '',
      sort_by: 'relevance',
      search_field: 'title/abstract'
    });
    setStartYear(null);
    setEndYear(null);
  };

  // Count active filters (excluding defaults)
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.publication_date && filters.publication_date !== '') count++;
    if (filters.article_types && filters.article_types.length > 0) count++;
    if (filters.languages && filters.languages.length > 0 && !filters.languages.includes('english')) count++;
    if (filters.species && filters.species.length > 0 && !filters.species.includes('humans')) count++;
    if (filters.sex && filters.sex.length > 0) count++;
    if (filters.age_groups && filters.age_groups.length > 0) count++;
    if (filters.other_filters && filters.other_filters.length > 0) count++;
    if (filters.sort_by && filters.sort_by !== 'relevance') count++;
    if (filters.search_field && filters.search_field !== 'title/abstract') count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  // Filter options
  const sortOptions = [
    { value: 'relevance', label: 'Best Match' },
    { value: 'publication_date', label: 'Publication Date' },
    { value: 'first_author', label: 'First Author' },
    { value: 'last_author', label: 'Last Author' },
    { value: 'journal', label: 'Journal' },
    { value: 'title', label: 'Title' }
  ];

  const searchFieldOptions = [
    { value: 'title/abstract', label: 'Title/Abstract' },
    { value: 'title', label: 'Title' },
    { value: 'abstract', label: 'Abstract' },
    { value: 'author', label: 'Author' },
    { value: 'all_fields', label: 'All Fields' }
  ];

  const articleTypeOptions = [
    { value: 'clinical_trial', label: 'Clinical Trial' },
    { value: 'randomized_controlled_trial', label: 'Randomized Controlled Trial' },
    { value: 'meta_analysis', label: 'Meta-Analysis' },
    { value: 'systematic_review', label: 'Systematic Review' },
    { value: 'review', label: 'Review' },
    { value: 'case_reports', label: 'Case Reports' },
    { value: 'comparative_study', label: 'Comparative Study' },
    { value: 'observational_study', label: 'Observational Study' }
  ];

  const speciesOptions = [
    { value: 'humans', label: 'Humans' },
    { value: 'mice', label: 'Mice' },
    { value: 'rats', label: 'Rats' },
    { value: 'other_animals', label: 'Other Animals' }
  ];

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'italian', label: 'Italian' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'portuguese', label: 'Portuguese' },
    { value: 'chinese', label: 'Chinese' }
  ];

  const sexOptions = [
    { value: 'female', label: 'Female' },
    { value: 'male', label: 'Male' }
  ];

  const ageGroupOptions = [
    { value: 'infant', label: 'Infant (0-1 years)' },
    { value: 'child', label: 'Child (1-12 years)' },
    { value: 'adolescent', label: 'Adolescent (13-18 years)' },
    { value: 'adult', label: 'Adult (19-64 years)' },
    { value: 'aged', label: 'Aged (65+ years)' }
  ];

  return (
    <Card className="border-gray-700 bg-gray-900/50 backdrop-blur-sm">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-100">Filters</h3>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-400 border-purple-600/30">
                {activeFilterCount} active
              </Badge>
            )}
          </div>
          {activeFilterCount > 0 && (
            <Button
              onClick={clearFilters}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-200"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}
        </div>

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sort By */}
          <FilterDropdown
            label="Sort By"
            value={filters.sort_by}
            options={sortOptions}
            onChange={(value) => updateFilter('sort_by', value)}
            defaultValue="relevance"
          />

          {/* Search In */}
          <FilterDropdown
            label="Search In"
            value={filters.search_field}
            options={searchFieldOptions}
            onChange={(value) => updateFilter('search_field', value)}
            defaultValue="title/abstract"
          />
        </div>

        {/* Publication Date Slider */}
        <DateRangeSlider
          startYear={startYear}
          endYear={endYear}
          onRangeChange={handleDateRangeChange}
        />

        {/* Article Types */}
        <MultiSelect
          label="Article Types"
          options={articleTypeOptions}
          selected={filters.article_types || []}
          onChange={(value) => updateArrayFilter('article_types', value)}
        />

        {/* Advanced Filters Toggle */}
        <div className="border-t border-gray-800 pt-4">
          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            variant="ghost"
            className="w-full justify-between text-gray-300 hover:text-gray-100"
          >
            <span className="font-medium">Advanced Filters</span>
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-6 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Species Filter */}
              <MultiSelect
                label="Species"
                options={speciesOptions}
                selected={filters.species || ['humans']}
                onChange={(value) => updateArrayFilter('species', value.length > 0 ? value : ['humans'])}
              />

              {/* Language Filter */}
              <MultiSelect
                label="Languages"
                options={languageOptions}
                selected={filters.languages || ['english']}
                onChange={(value) => updateArrayFilter('languages', value.length > 0 ? value : ['english'])}
              />

              {/* Sex Filter */}
              <MultiSelect
                label="Sex"
                options={sexOptions}
                selected={filters.sex || []}
                onChange={(value) => updateArrayFilter('sex', value)}
              />

              {/* Age Groups */}
              <MultiSelect
                label="Age Groups"
                options={ageGroupOptions}
                selected={filters.age_groups || []}
                onChange={(value) => updateArrayFilter('age_groups', value)}
              />
            </div>

            {/* Custom Query */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 block">
                Custom {selectedSource === 'pubmed' ? 'PubMed' : 'Scopus'} Query
              </label>
              <input
                type="text"
                placeholder={`e.g., ${selectedSource === 'pubmed' ? 'author[au] OR mesh[mh]' : 'TITLE-ABS-KEY(keyword)'}`}
                value={filters.custom_filters || ''}
                onChange={(e) => updateFilter('custom_filters', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              <p className="text-xs text-gray-500">
                Advanced users: Use {selectedSource === 'pubmed' ? 'PubMed' : 'Scopus'} search syntax
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}