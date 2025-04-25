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
    console.log('Received data type:', typeof data);
    
    // Transform the API data to match our Doctor interface
    const doctors: Doctor[] = data.map((item: any) => {
      // Extract experience as a number
      const experienceMatch = item.experience?.match(/(\d+)/);
      const experienceYears = experienceMatch ? parseInt(experienceMatch[1]) : 0;
      
      // Extract consultation fee as a number
      const feeMatch = item.fees?.match(/(\d+)/);
      const consultationFee = feeMatch ? parseInt(feeMatch[1]) : 0;
      
      // Extract specialties
      const specialties = item.specialities?.map((spec: any) => spec.name) || [];
      
      // Handle specialities with "and" in the name (map to standard specialty names)
      const normalizedSpecialties = specialties.map((spec: string) => {
        if (spec === "Gynaecologist and Obstetrician") return "Gynaecologist";
        if (spec === "Dietitian/Nutritionist") return "Dietitian/Nutritionist";
        return spec;
      });
      
      // Determine consultation modes
      const consultationModes = [];
      if (item.video_consult) consultationModes.push('Video Consult');
      if (item.in_clinic) consultationModes.push('In Clinic');
      
      // Create doctor object
      const doctor: Doctor = {
        id: parseInt(item.id.toString()) || Math.random(),
        name: item.name || 'Unknown Doctor',
        specialty: normalizedSpecialties,
        experience: experienceYears,
        consultation_mode: consultationModes,
        photo: item.photo || 'https://via.placeholder.com/150',
        degree: item.doctor_introduction?.split(',')[0] || '',
        languages: item.languages || ['English'],
        consultation_fee: consultationFee,
        location: item.clinic?.address?.locality || 'Unknown',
        skills: [],
        about: item.doctor_introduction || ''
      };
      
      return doctor;
    });
    
    console.log('Processed doctors:', doctors.length);
    return doctors;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

export const getUniqueSpecialties = (doctors: Doctor[]): string[] => {
  const specialtySet = new Set<string>();
  
  doctors.forEach(doctor => {
    if (Array.isArray(doctor.specialty)) {
      doctor.specialty.forEach(specialty => {
        if (specialty) {
          specialtySet.add(specialty);
        }
      });
    }
  });
  
  return Array.from(specialtySet).sort();
};
