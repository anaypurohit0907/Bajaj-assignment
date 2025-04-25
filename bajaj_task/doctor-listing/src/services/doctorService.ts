import { Doctor } from '../types';

const API_URL = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json';

export const fetchDoctors = async (): Promise<Doctor[]> => {
  try {
    console.log('Fetching doctors from:', API_URL);
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received data:', data);
    
    // Check if the data is an array
    if (!Array.isArray(data)) {
      console.error('Expected array but received:', typeof data);
      // If data is not an array but has a property that might contain the doctors array
      if (data && typeof data === 'object') {
        for (const key in data) {
          if (Array.isArray(data[key])) {
            return validateDoctorData(data[key]);
          }
        }
      }
      throw new Error('Invalid data format');
    }
    
    return validateDoctorData(data);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error; // Re-throw to handle in the component
  }
};

// Helper function to validate and clean doctor data
const validateDoctorData = (data: any[]): Doctor[] => {
  return data.map(item => {
    // Create a valid doctor object with default values for missing properties
    const doctor: Doctor = {
      id: item.id || Math.random(),
      name: item.name || 'Unknown Doctor',
      specialty: Array.isArray(item.specialty) ? item.specialty : 
                 (item.specialty ? [item.specialty] : ['General']),
      experience: typeof item.experience === 'number' ? item.experience : 0,
      consultation_mode: Array.isArray(item.consultation_mode) ? item.consultation_mode : 
                        (item.consultation_mode ? [item.consultation_mode] : ['In Clinic']),
      photo: item.photo || 'https://via.placeholder.com/150',
      degree: item.degree || 'MD',
      languages: Array.isArray(item.languages) ? item.languages : ['English'],
      consultation_fee: typeof item.consultation_fee === 'number' ? item.consultation_fee : 0,
      location: item.location || 'Unknown',
      skills: Array.isArray(item.skills) ? item.skills : [],
      about: item.about || ''
    };
    
    return doctor;
  });
};

export const getUniqueSpecialties = (doctors: Doctor[]): string[] => {
  const specialtySet = new Set<string>();
  
  doctors.forEach(doctor => {
    // Make sure specialty is an array before trying to iterate over it
    if (Array.isArray(doctor.specialty)) {
      doctor.specialty.forEach(specialty => {
        if (specialty) {
          specialtySet.add(specialty);
        }
      });
    } else if (doctor.specialty) {
      // If somehow specialty is a string, add it
      specialtySet.add(doctor.specialty as unknown as string);
    }
  });
  
  return Array.from(specialtySet).sort();
};
