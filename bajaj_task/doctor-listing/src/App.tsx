import React, { useEffect, useState } from 'react';
import './App.css';
import { Doctor, ConsultationType, SortType } from './types';
import { fetchDoctors, getUniqueSpecialties } from './services/doctorService';
import AutoComplete from './components/AutoComplete/AutoComplete';
import FilterPanel from './components/FilterPanel/FilterPanel';
import DoctorCard from './components/DoctorCard/DoctorCard';
import { updateQueryParams, getQueryParams } from './utils/urlUtils';

function App() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [consultationType, setConsultationType] = useState<ConsultationType>(null);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [sortType, setSortType] = useState<SortType>(null);

  // Hard-coded specialties list from requirements
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

  // Fetch doctors data
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Starting to fetch doctors data');
        
        const data = await fetchDoctors();
        console.log('Fetched doctors:', data.length);
        
        if (data && data.length > 0) {
          setDoctors(data);
          setFilteredDoctors(data);
          
          // Always use hardcoded specialties for consistency
          setSpecialties(hardcodedSpecialties);
        } else {
          throw new Error('No doctors data found');
        }
      } catch (err) {
        console.error('Error in getData:', err);
        setError('Failed to fetch doctors data. Please try again later.');
        // Still set specialties even on error
        setSpecialties(hardcodedSpecialties);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // Apply URL parameters on initial load
  useEffect(() => {
    if (doctors.length > 0) {
      const { search, consultation, specialties, sort } = getQueryParams();
      
      if (search) setSearchTerm(search);
      if (consultation) setConsultationType(consultation);
      if (specialties.length > 0) setSelectedSpecialties(specialties);
      if (sort) setSortType(sort);
    }
  }, [doctors]);

  // Apply filters whenever filter states change
  useEffect(() => {
    if (doctors.length > 0) {
      console.log('Applying filters:', { searchTerm, consultationType, selectedSpecialties, sortType });
      
      let filtered = [...doctors];
      
      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(doctor =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        console.log(`After search filter (${searchTerm}):`, filtered.length);
      }
      
      // Filter by consultation type
      if (consultationType) {
        filtered = filtered.filter(doctor => 
          doctor.consultation_mode.includes(consultationType)
        );
        console.log(`After consultation filter (${consultationType}):`, filtered.length);
      }
      
      // Filter by selected specialties
      if (selectedSpecialties.length > 0) {
        filtered = filtered.filter(doctor => {
          return selectedSpecialties.some(selectedSpecialty => 
            doctor.specialty.some(docSpecialty => 
              docSpecialty.includes(selectedSpecialty) || selectedSpecialty.includes(docSpecialty)
            )
          );
        });
        console.log(`After specialty filter (${selectedSpecialties.join(', ')}):`, filtered.length);
      }
      
      // Sort the filtered doctors
      if (sortType) {
        if (sortType === 'fees') {
          filtered.sort((a, b) => a.consultation_fee - b.consultation_fee);
          console.log('Sorted by fees (low to high)');
        } else if (sortType === 'experience') {
          filtered.sort((a, b) => b.experience - a.experience);
          console.log('Sorted by experience (high to low)');
        }
      }
      
      console.log(`Final filtered doctors: ${filtered.length} of ${doctors.length}`);
      setFilteredDoctors(filtered);
      
      // Update URL query parameters
      updateQueryParams(searchTerm, consultationType, selectedSpecialties, sortType);
    }
  }, [doctors, searchTerm, consultationType, selectedSpecialties, sortType]);

  // Handle search
  const handleSearch = (term: string) => {
    console.log('Search term changed:', term);
    setSearchTerm(term);
  };

  // Handle consultation type change
  const handleConsultationTypeChange = (type: ConsultationType) => {
    console.log('Consultation type changed:', type);
    setConsultationType(type === consultationType ? null : type);
  };

  // Handle specialty selection
  const handleSpecialtyChange = (specialty: string) => {
    console.log('Specialty selection changed:', specialty);
    setSelectedSpecialties(prev => 
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  // Handle sort change
  const handleSortChange = (type: SortType) => {
    console.log('Sort type changed:', type);
    setSortType(type === sortType ? null : type);
  };

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const { search, consultation, specialties, sort } = getQueryParams();
      
      setSearchTerm(search);
      setConsultationType(consultation);
      setSelectedSpecialties(specialties);
      setSortType(sort);
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Doctor Finder</h1>
        <AutoComplete 
          doctors={doctors} 
          onSearch={handleSearch} 
        />
      </header>

      <main className="App-main">
        <div className="App-container">
          <div className="App-sidebar">
            <FilterPanel
              specialties={specialties}
              consultationType={consultationType}
              selectedSpecialties={selectedSpecialties}
              sortType={sortType}
              onConsultationTypeChange={handleConsultationTypeChange}
              onSpecialtyChange={handleSpecialtyChange}
              onSortChange={handleSortChange}
            />
          </div>
          
          <div className="App-content">
            {loading ? (
              <div className="loading">Loading doctors...</div>
            ) : error ? (
              <div className="error">
                {error}
                <button onClick={() => window.location.reload()} className="retry-button">Retry</button>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="no-results">No doctors found matching your criteria.</div>
            ) : (
              <div className="doctor-list">
                {filteredDoctors.map(doctor => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
