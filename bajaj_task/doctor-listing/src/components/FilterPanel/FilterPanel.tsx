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
  // Add debugging
  console.log('FilterPanel rendering with specialties:', specialties);
  
  // Function to reset all filters
  const resetAllFilters = () => {
    onConsultationTypeChange(null);
    selectedSpecialties.forEach(specialty => {
      onSpecialtyChange(specialty);
    });
    onSortChange(null);
  };

  // Helper function to generate the correct data-testid for specialty
  const getSpecialtyTestId = (specialty: string) => {
    // Handle specialty with forward slash (Dietitian/Nutritionist)
    return `filter-specialty-${specialty.replace('/', '-')}`;
  };

  // Hard-coded specialties list from the requirements
  const hardcodedSpecialties = [
    'General Physician',
    'Dentist',
    'Dermatologist',
    'Paediatrician',
    'Gynaecologist',
    'ENT',
    'Diabetologist',
    'Cardiologist',
    'Physiotherapist',
    'Endocrinologist',
    'Orthopaedic',
    'Ophthalmologist',
    'Gastroenterologist',
    'Pulmonologist',
    'Psychiatrist',
    'Urologist',
    'Dietitian/Nutritionist',
    'Psychologist',
    'Sexologist',
    'Nephrologist',
    'Neurologist',
    'Oncologist',
    'Ayurveda',
    'Homeopath'
  ];

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
        <div className="filter-options speciality-options">
          {/* Use hard-coded specialties instead of the dynamic ones */}
          {hardcodedSpecialties.map((specialty) => (
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
