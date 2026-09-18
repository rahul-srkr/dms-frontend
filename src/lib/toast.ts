import toast from 'react-hot-toast';

export { toast };

export const toastConfig = {
  duration: 4000,
  position: 'top-right' as const,
  style: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '14px',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,.08)',
  },
};
