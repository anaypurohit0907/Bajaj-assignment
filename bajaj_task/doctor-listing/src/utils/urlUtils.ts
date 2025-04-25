import { ConsultationType, SortType } from '../types';

export const updateQueryParams = (
  searchTerm: string,
  consultationType: ConsultationType,
  selectedSpecialties: string[],
  sortType: SortType
) => {
  const params = new URLSearchParams();
  
  if (searchTerm) params.set('search', searchTerm);
  if (consultationType) params.set('consultation', consultationType);
  if (selectedSpecialties.length > 0) params.set('specialties', selectedSpecialties.join(','));
  if (sortType) params.set('sort', sortType);
  
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({ path: newUrl }, '', newUrl);
};

export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  
  const search = params.get('search') || '';
  const consultation = params.get('consultation') as ConsultationType || null;
  const specialties = params.get('specialties') ? params.get('specialties')!.split(',') : [];
  const sort = params.get('sort') as SortType || null;
  
  return { search, consultation, specialties, sort };
};
