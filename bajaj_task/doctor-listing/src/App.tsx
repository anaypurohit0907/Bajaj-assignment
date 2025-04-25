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
          const uniqueSpecialties = getUniqueSpecialties(data);
          console.log('Unique specialties:', uniqueSpecialties);
          setSpecialties(uniqueSpecialties);
        } else {
          throw new Error('No doctors data found');
        }
      } catch (err) {
        console.error('Error in getData:', err);
        setError('Failed to fetch doctors data. Please try again later.');
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
      }
      
      // Filter by consultation type
      if (consultationType) {
        filtered = filtered.filter(doctor =>
          doctor.consultation_mode.some(mode => 
            mode.toLowerCase() === consultationType.toLowerCase()
          )
        );
      }
      
      // Filter by selected specialties
      if (selectedSpecialties.length > 0) {
        filtered = filtered.filter(doctor =>
          doctor.specialty.some(spec => 
            selectedSpecialties.includes(spec)
          )
        );
      }
      
      // Sort the filtered doctors
      if (sortType) {
        filtered.sort((a, b) => {
          if (sortType === 'fees') {
            return a.consultation_fee - b.consultation_fee;
          } else if (sortType === 'experience') {
            return b.experience - a.experience;
          }
          return 0;
        });
      }
      
      console.log(`Filtered doctors: ${filtered.length} of ${doctors.length}`);
      setFilteredDoctors(filtered);
      
      // Update URL query parameters
      updateQueryParams(searchTerm, consultationType, selectedSpecialties, sortType);
    }
  }, [doctors, searchTerm, consultationType, selectedSpecialties, sortType]);

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Handle consultation type change
  const handleConsultationTypeChange = (type: ConsultationType) => {
    setConsultationType(type === consultationType ? null : type);
  };

  // Handle specialty selection
  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  // Handle sort change
  const handleSortChange = (type: SortType) => {
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

  const retryFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDoctors();
      setDoctors(data);
      setFilteredDoctors(data);
      setSpecialties(getUniqueSpecialties(data));
    } catch (err) {
      setError('Failed to fetch doctors data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
            {doctors.length > 0 && (
              <FilterPanel
                specialties={specialties}
                consultationType={consultationType}
                selectedSpecialties={selectedSpecialties}
                sortType={sortType}
                onConsultationTypeChange={handleConsultationTypeChange}
                onSpecialtyChange={handleSpecialtyChange}
                onSortChange={handleSortChange}
              />
            )}
          </div>
          
          <div className="App-content">
            {loading ? (
              <div className="loading">Loading doctors...</div>
            ) : error ? (
              <div className="error">
                {error}
                <button onClick={retryFetch} className="retry-button">Retry</button>
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
