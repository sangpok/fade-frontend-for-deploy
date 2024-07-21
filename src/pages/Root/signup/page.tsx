import { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import AgreementsView from './components/AgreementsView';
import InitializeAccountView from './components/InitializeAccountView';

export default function Page() {
  const [hasAgreements, setHasAgreements] = useState(false);

  const [searchParams] = useSearchParams();
  const authorizationCode = searchParams.get('code');

  if (authorizationCode === null || authorizationCode === '') {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {!hasAgreements && <AgreementsView onAgree={() => setHasAgreements(true)} />}
      {hasAgreements && <InitializeAccountView authorizationCode={authorizationCode} />}
    </>
  );
}
