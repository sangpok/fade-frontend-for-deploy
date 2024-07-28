import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AgreementsView from './components/AgreementsView';
import AccountInitializeView from './components/AccountInitializeView';

type SignUpLocaitonState = { socialAccessToken: string };

export default function Page() {
  const [hasAgreements, setHasAgreements] = useState(false);
  const { state: locationState } = useLocation();

  if (locationState === null) {
    return <Navigate to="/login" />;
  }

  const { socialAccessToken } = locationState as SignUpLocaitonState;

  return (
    <AnimatePresence mode="wait">
      {!hasAgreements && (
        <motion.div key="view-1" initial={{ opacity: 0, y: '12px' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '12px' }} className="h-full">
          <AgreementsView onAgree={() => setHasAgreements(true)} />
        </motion.div>
      )}
      {hasAgreements && (
        <motion.div key="view-2" initial={{ opacity: 0, y: '12px' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '12px' }} className="h-full">
          <AccountInitializeView accessToken={socialAccessToken} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
