import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SupportBusiness = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to fundraisers page since we're handling support there
    navigate('/normal/fundraisers');
  }, [navigate]);

  return null;
};

export default SupportBusiness;