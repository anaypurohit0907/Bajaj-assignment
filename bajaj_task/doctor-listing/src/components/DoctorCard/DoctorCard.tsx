import React from 'react';
import './DoctorCard.css';
import { Doctor } from '../../types';

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <div className="doctor-card" data-testid="doctor-card">
      <div className="doctor-photo">
        <img src={doctor.photo} alt={doctor.name} />
      </div>
      <div className="doctor-info">
        <h2 data-testid="doctor-name">{doctor.name}</h2>
        <p data-testid="doctor-specialty">{doctor.specialty.join(', ')}</p>
        <p data-testid="doctor-experience">{doctor.experience} years of experience</p>
        <p data-testid="doctor-fee">₹{doctor.consultation_fee}</p>
        <div className="doctor-details">
          <p>Languages: {doctor.languages.join(', ')}</p>
          <p>Location: {doctor.location}</p>
          <p>Consultation: {doctor.consultation_mode.join(', ')}</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
