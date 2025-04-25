import React from 'react';
import './FilterPanel.css';
import { ConsultationType, SortType } from '../../types';

interface FilterPanelProps {
  specialties: string[];
  consultationType: ConsultationType;
  selectedSpecialties: string[];
  sortType: SortType;
  onConsultationTypeChange: (type: ConsultationType) => void;
  onSpecialtyChange: (specialty: string) => void;
  onSortChange: (sortType: SortType) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  specialties,
  consultationType,
  selectedSpecialties,
  sortType,
  onConsultationTypeChange,
  onSpecialtyChange,
  onSortChange,
}) => {
  // Function to reset all filters
  const resetAllFilters = () => {
    // Reset consultation type
    onConsultationTypeChange(null);
    
    // Reset all specialties
    selectedSpecialties.forEach(specialty => {
      onSpecialtyChange(specialty);
    });
    
    // Reset sort
    onSortChange(null);
  };

  return (
    <div className="filter-panel">
      <div className="filter-section">
        <h3 data-testid="filter-header-moc">Consultation Mode</h3>
        <div className="filter-options">
          <label className="radio-label">
            <input
              type="radio"
              name="consultation-type"
              checked={consultationType === 'Video Consult'}
              onChange={() => onConsultationTypeChange(consultationType === 'Video Consult' ? null : 'Video Consult')}
              data-testid="filter-video-consult"
            />
            Video Consult
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="consultation-type"
              checked={consultationType === 'In Clinic'}
              onChange={() => onConsultationTypeChange(consultationType === 'In Clinic' ? null : 'In Clinic')}
              data-testid="filter-in-clinic"
            />
            In Clinic
          </label>
        </div>
      </div>

      <div className="filter-section">
        <h3 data-testid="filter-header-speciality">Speciality</h3>
        <div className="filter-options">
          {specialties.map((specialty) => (
            <label key={specialty} className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedSpecialties.includes(specialty)}
                onChange={() => onSpecialtyChange(specialty)}
                data-testid={`filter-specialty-${specialty.replace('/', '-')}`}
              />
              {specialty}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 data-testid="filter-header-sort">Sort By</h3>
        <div className="filter-options">
          <label className="radio-label">
            <input
              type="radio"
              name="sort-type"
              checked={sortType === 'fees'}
              onChange={() => onSortChange(sortType === 'fees' ? null : 'fees')}
              data-testid="sort-fees"
            />
            Fees (Low to High)
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="sort-type"
              checked={sortType === 'experience'}
              onChange={() => onSortChange(sortType === 'experience' ? null : 'experience')}
              data-testid="sort-experience"
            />
            Experience (High to Low)
          </label>
        </div>
      </div>
      
      {/* Reset button */}
      <div className="filter-section">
        <button 
          className="reset-button" 
          onClick={resetAllFilters}
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
