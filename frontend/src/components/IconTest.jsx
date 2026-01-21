import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faTrophy } from '@fortawesome/free-solid-svg-icons';

export default function IconTest() {
  return (
    <div className="flex space-x-6 text-4xl">
      <FontAwesomeIcon icon={faLock} />
      <FontAwesomeIcon icon={faTrophy} />
    </div>
  );
}
