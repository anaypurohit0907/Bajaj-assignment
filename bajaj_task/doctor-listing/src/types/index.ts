export interface Doctor {
  id: number;
  name: string;
  specialty: string[];
  experience: number;
  consultation_mode: string[];
  photo: string;
  degree: string;
  languages: string[];
  consultation_fee: number;
  location: string;
  skills: string[];
  about: string;
}

export type SortType = 'fees' | 'experience' | null;
export type ConsultationType = 'Video Consult' | 'In Clinic' | null;
